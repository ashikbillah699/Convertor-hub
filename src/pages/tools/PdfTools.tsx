import { useEffect, useState, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import ToolLayout from "@/components/tools/ToolLayout";
import FileUpload from "@/components/tools/FileUpload";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument, StandardFonts } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Document, HeadingLevel, Packer, Paragraph } from "docx";
import html2pdf from "html2pdf.js";
import mammoth from "mammoth/mammoth.browser";
import { buildPptPdfHtml, createPptxFromSlides, extractPptxSlideText, isValidPptxFile } from "@/lib/pptx";
import { createXlsxFromText, pdfTextToRows, readSpreadsheetRows } from "@/lib/excel";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface ToolConfig {
  title: string;
  desc: string;
  type: "merge" | "split" | "compress" | "image-to-pdf" | "text-to-pdf" | "html-to-pdf" | "pdf-to-jpg" | "pdf-to-png" | "pdf-to-word" | "word-to-pdf" | "ppt-to-pdf" | "pdf-to-ppt" | "excel-to-pdf" | "pdf-to-excel" | "coming-soon";
  accept?: string;
}

const tools: Record<string, ToolConfig> = {
  "pdf-to-word": { title: "PDF to Word", desc: "Extract PDF text into an editable Word document", type: "pdf-to-word" },
  "word-to-pdf": { title: "Word to PDF", desc: "Convert DOCX documents to downloadable PDF files", type: "word-to-pdf" },
  "pdf-to-jpg": { title: "PDF to JPG", desc: "Render every PDF page as a downloadable JPG image", type: "pdf-to-jpg" },
  "jpg-to-pdf": { title: "JPG to PDF", desc: "Convert JPG images to PDF documents", type: "image-to-pdf", accept: ".jpg,.jpeg" },
  "pdf-to-png": { title: "PDF to PNG", desc: "Render every PDF page as a downloadable PNG image", type: "pdf-to-png" },
  "png-to-pdf": { title: "PNG to PDF", desc: "Convert PNG images to PDF documents", type: "image-to-pdf", accept: ".png" },
  "merge-pdf": { title: "Merge PDF", desc: "Combine multiple PDF files into one", type: "merge" },
  "split-pdf": { title: "Split PDF", desc: "Split PDF into separate pages", type: "split" },
  "compress-pdf": { title: "Compress PDF", desc: "Reduce PDF file size", type: "compress" },
  "ppt-to-pdf": { title: "PPT to PDF", desc: "Convert PowerPoint files to PDF", type: "ppt-to-pdf", accept: ".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation" },
  "pdf-to-ppt": { title: "PDF to PPT", desc: "Convert PDF text into editable PowerPoint slides", type: "pdf-to-ppt" },
  "excel-to-pdf": { title: "Excel to PDF", desc: "Convert Excel spreadsheets to PDF", type: "excel-to-pdf", accept: ".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" },
  "pdf-to-excel": { title: "PDF to Excel", desc: "Convert PDF text to a spreadsheet", type: "pdf-to-excel" },
  "text-to-pdf": { title: "Text to PDF", desc: "Convert plain text to PDF documents", type: "text-to-pdf" },
  "html-to-pdf": { title: "HTML to PDF", desc: "Preview HTML and use your browser print dialog to save a PDF", type: "html-to-pdf" },
};

const downloadBlob = (data: Uint8Array, name: string) => {
  const blob = new Blob([new Uint8Array(data)], { type: "application/pdf" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
};

const downloadBlobObject = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};


const sanitizeDocxHtml = (html: string) => {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const allowedTags = new Set([
    "a", "blockquote", "br", "caption", "code", "dd", "div", "dl", "dt", "em", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "img", "li", "ol", "p", "pre", "s", "span", "strong", "sub", "sup", "table", "tbody", "td", "th", "thead", "tr", "u", "ul",
  ]);
  const elements = Array.from(parsed.body.querySelectorAll("*"));

  for (const element of elements) {
    const tag = element.tagName.toLowerCase();
    if (!allowedTags.has(tag)) {
      if (["script", "style", "iframe", "object", "embed", "svg"].includes(tag)) element.remove();
      else element.replaceWith(...Array.from(element.childNodes));
      continue;
    }

    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      const safeLink = tag === "a" && name === "href" && /^(https?:|mailto:)/i.test(value);
      const safeImage = tag === "img" && name === "src" && /^data:image\/(png|jpeg|gif|webp);base64,/i.test(value);
      const safeAlt = tag === "img" && name === "alt";
      const safeDimension = tag === "img" && ["width", "height"].includes(name) && /^\d{1,4}$/.test(value);
      const safeSpan = ["td", "th"].includes(tag) && ["colspan", "rowspan"].includes(name) && /^\d{1,2}$/.test(value);
      if (!safeLink && !safeImage && !safeAlt && !safeDimension && !safeSpan) element.removeAttribute(attribute.name);
    }
  }

  return parsed.body.innerHTML;
};

const PdfTools = () => {
  const { toolId } = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [jpgResults, setJpgResults] = useState<{ name: string; url: string }[]>([]);
  const [splitResults, setSplitResults] = useState<{ name: string; data: Uint8Array }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const jpgUrlsRef = useRef<string[]>([]);

  useEffect(() => () => jpgUrlsRef.current.forEach(URL.revokeObjectURL), []);

  const tool = tools[toolId!];
  if (!tool) return <Navigate to="/tools" replace />;

  const handleMerge = async () => {
    if (files.length < 2) { toast.error("Add at least 2 PDF files"); return; }
    setLoading(true);
    try {
      const merged = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      downloadBlob(await merged.save(), "merged.pdf");
      toast.success("PDFs merged successfully!");
    } catch { toast.error("Failed to merge PDFs"); }
    finally { setLoading(false); }
  };

  const handleSplit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const results: { name: string; data: Uint8Array }[] = [];
      for (let i = 0; i < pdf.getPageCount(); i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(page);
        results.push({ name: `page-${i + 1}.pdf`, data: await newPdf.save() });
      }
      setSplitResults(results);
      toast.success(`Split into ${results.length} pages!`);
    } catch { toast.error("Failed to split PDF"); }
    finally { setLoading(false); }
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const compressed = await pdf.save();
      const savings = ((file.size - compressed.length) / file.size * 100).toFixed(1);
      downloadBlob(compressed, "compressed.pdf");
      toast.success(`Compressed! Saved ${savings}%`);
    } catch { toast.error("Failed to compress PDF"); }
    finally { setLoading(false); }
  };

  const handleImageToPdf = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const pdf = await PDFDocument.create();
      const bytes = await file.arrayBuffer();
      const img = file.type.includes("png") ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
      const page = pdf.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      downloadBlob(await pdf.save(), "converted.pdf");
      toast.success("Image converted to PDF!");
    } catch { toast.error("Failed to convert image to PDF"); }
    finally { setLoading(false); }
  };

  const handleTextToPdf = async () => {
    if (!text.trim()) { toast.error("Enter some text first"); return; }
    setLoading(true);
    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const margin = 50;
      const lines = text.split("\n");
      let page = pdf.addPage();
      let y = page.getHeight() - margin;
      for (const line of lines) {
        if (y < margin) { page = pdf.addPage(); y = page.getHeight() - margin; }
        page.drawText(line, { x: margin, y, size: fontSize, font });
        y -= fontSize * 1.5;
      }
      downloadBlob(await pdf.save(), "text-document.pdf");
      toast.success("Text converted to PDF!");
    } catch { toast.error("Failed to create PDF"); }
    finally { setLoading(false); }
  };

  const handleHtmlToPdf = () => {
    if (!html.trim()) { toast.error("Enter HTML first"); return; }
    const previewUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const opened = window.open(previewUrl, "_blank");
    if (!opened) {
      URL.revokeObjectURL(previewUrl);
      toast.error("Allow pop-ups to open the print preview");
      return;
    }
    opened.opener = null;
    toast.success("Preview opened. Use your browser's Print command and choose Save as PDF.");
  };

  const handlePdfToWord = async () => {
    if (!file) { toast.error("Choose a PDF file first"); return; }
    setLoading(true);
    try {
      const loadingTask = pdfjs.getDocument({ data: await file.arrayBuffer() });
      const pdf = await loadingTask.promise;
      const paragraphs: Paragraph[] = [];
      let extractedCharacters = 0;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const items = content.items.filter(item => "str" in item);
        const pageText = items
          .map(item => `${item.str}${item.hasEOL ? "\n" : " "}`)
          .join("")
          .replace(/[ \t]+\n/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        extractedCharacters += pageText.length;
        paragraphs.push(new Paragraph({ text: `Page ${pageNumber}`, heading: HeadingLevel.HEADING_1 }));
        for (const line of pageText.split(/\n+/).map(value => value.trim()).filter(Boolean)) {
          paragraphs.push(new Paragraph({ text: line }));
        }
        if (!pageText) paragraphs.push(new Paragraph({ text: "No extractable text on this page." }));
      }

      await loadingTask.destroy();
      if (!extractedCharacters) {
        toast.error("No selectable text was found. Scanned PDFs need OCR, which this tool does not include.");
        return;
      }

      const document = new Document({ sections: [{ children: paragraphs }] });
      const docxBlob = await Packer.toBlob(document);
      const url = URL.createObjectURL(docxBlob);
      const anchor = window.document.createElement("a");
      anchor.href = url;
      anchor.download = `${file.name.replace(/\.pdf$/i, "")}.docx`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(`Converted ${pdf.numPages} PDF page${pdf.numPages === 1 ? "" : "s"} to Word.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not convert this PDF to Word.");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfToImage = async () => {
    if (!file) { toast.error("Choose a PDF file first"); return; }
    const isPng = toolId === "pdf-to-png";
    const format = isPng ? "PNG" : "JPG";
    const extension = isPng ? "png" : "jpg";
    const mimeType = isPng ? "image/png" : "image/jpeg";
    jpgUrlsRef.current.forEach(URL.revokeObjectURL);
    jpgUrlsRef.current = [];
    setJpgResults([]);
    setLoading(true);
    let loadingTask: ReturnType<typeof pdfjs.getDocument> | null = null;
    const results: { name: string; url: string }[] = [];
    try {
      loadingTask = pdfjs.getDocument({ data: await file.arrayBuffer() });
      const pdf = await loadingTask.promise;
      const baseName = file.name.replace(/\.pdf$/i, "") || "page";

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: Math.min(2, 2000 / baseViewport.width) });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, viewport, background: "#ffffff" }).promise;
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(result => result ? resolve(result) : reject(new Error(`Could not render page ${pageNumber}.`)), mimeType, isPng ? undefined : 0.92);
        });
        const name = `${baseName}-page-${pageNumber}.${extension}`;
        const url = URL.createObjectURL(blob);
        jpgUrlsRef.current.push(url);
        results.push({ name, url });
      }

      await loadingTask.destroy();
      loadingTask = null;
      setJpgResults(results);
      toast.success(`Converted ${results.length} PDF page${results.length === 1 ? "" : "s"} to ${format}.`);
    } catch (error) {
      results.forEach(result => URL.revokeObjectURL(result.url));
      jpgUrlsRef.current = [];
      toast.error(error instanceof Error ? error.message : "Could not convert this PDF to JPG.");
    } finally {
      if (loadingTask) await loadingTask.destroy().catch(() => {});
      setLoading(false);
    }
  };

  const handleWordToPdf = async () => {
    if (!file) { toast.error("Choose a DOCX file first"); return; }
    setLoading(true);
    let renderContainer: HTMLDivElement | null = null;
    try {
      const { value } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
      const safeHtml = sanitizeDocxHtml(value);
      if (!safeHtml.trim()) {
        toast.error("No printable document content was found.");
        return;
      }
      renderContainer = document.createElement("div");
      renderContainer.style.cssText = "position:fixed;left:0;top:0;z-index:-1;opacity:0.01;pointer-events:none;width:794px;padding:48px;background:#fff;color:#111;font-family:Arial,sans-serif;font-size:16px;line-height:1.5;box-sizing:border-box";
      renderContainer.innerHTML = `<style>img{max-width:100%;height:auto}table{border-collapse:collapse;width:100%;margin:1em 0}td,th{border:1px solid #777;padding:6px 8px;text-align:left}h1,h2,h3,h4,h5,h6{page-break-after:avoid}p,li,tr{page-break-inside:avoid}</style>${safeHtml}`;
      document.body.appendChild(renderContainer);
      const images = Array.from(renderContainer.querySelectorAll("img"));
      await Promise.all(images.map(image => image.complete ? Promise.resolve() : new Promise<void>(resolve => {
        image.onload = () => resolve();
        image.onerror = () => resolve();
      })));
      const pdfBlob = await html2pdf().set({
        margin: [10, 10, 10, 10],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: "#ffffff", logging: false, useCORS: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(renderContainer).outputPdf("blob") as Blob;
      if (!(pdfBlob instanceof Blob) || pdfBlob.size < 100 || pdfBlob.type !== "application/pdf") {
        throw new Error("PDF generation returned an invalid file.");
      }
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const anchor = document.createElement("a");
      anchor.href = pdfUrl;
      anchor.download = `${file.name.replace(/\.docx$/i, "")}.pdf`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
      toast.success("PDF downloaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read this DOCX file.");
    } finally {
      renderContainer?.remove();
      setLoading(false);
    }
  };

  const handlePptToPdf = async () => {
    if (!file) { toast.error("Choose a PPTX file first"); return; }
    if (/\.ppt$/i.test(file.name) || /ms-powerpoint/i.test(file.type)) {
      toast.error("Legacy .ppt files are not supported here. Please convert the file to .pptx and try again.");
      return;
    }
    if (!isValidPptxFile(file)) {
      toast.error("Please upload a valid PowerPoint file in .pptx format.");
      return;
    }
    setLoading(true);
    let renderContainer: HTMLDivElement | null = null;
    try {
      const fileBuffer = await file.arrayBuffer();
      const slideTexts = await extractPptxSlideText(fileBuffer);

      if (!slideTexts.length) {
        throw new Error("No readable slide text was found in this PowerPoint file.");
      }

      renderContainer = document.createElement("div");
      renderContainer.style.cssText = "position:fixed;left:0;top:0;z-index:-1;opacity:0.01;pointer-events:none;width:794px;padding:24px;background:#f3f4f6;box-sizing:border-box;";
      renderContainer.innerHTML = buildPptPdfHtml(slideTexts);
      document.body.appendChild(renderContainer);

      const pdfBlob = await html2pdf().set({
        margin: [8, 8, 8, 8],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: "#ffffff", logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(renderContainer).outputPdf("blob") as Blob;

      if (!(pdfBlob instanceof Blob) || pdfBlob.size < 100 || pdfBlob.type !== "application/pdf") {
        throw new Error("PDF generation returned an invalid file.");
      }

      downloadBlobObject(pdfBlob, `${file.name.replace(/\.(pptx|ppt)$/i, "") || "presentation"}.pdf`);
      toast.success(`Converted ${slideTexts.length} slide${slideTexts.length === 1 ? "" : "s"} to PDF.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not convert this PowerPoint file.");
    } finally {
      renderContainer?.remove();
      setLoading(false);
    }
  };

  const handlePdfToPpt = async () => {
    if (!file) { toast.error("Choose a PDF file first"); return; }
    setLoading(true);
    try {
      const loadingTask = pdfjs.getDocument({ data: await file.arrayBuffer() });
      const pdf = await loadingTask.promise;
      const slideTexts: string[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = content.items
          .filter(item => "str" in item)
          .map(item => item.str)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        slideTexts.push(pageText || `Slide ${pageNumber}`);
      }

      if (!slideTexts.length) {
        throw new Error("No readable text was found in this PDF.");
      }

      const pptxBlob = await createPptxFromSlides(slideTexts);
      downloadBlobObject(pptxBlob, `${file.name.replace(/\.pdf$/i, "") || "presentation"}.pptx`);
      toast.success(`Converted ${slideTexts.length} PDF page${slideTexts.length === 1 ? "" : "s"} to PPT.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not convert this PDF to PowerPoint.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcelToPdf = async () => {
    if (!file) { toast.error("Choose an Excel or CSV file first"); return; }
    setLoading(true);
    let renderContainer: HTMLDivElement | null = null;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const rows = await readSpreadsheetRows(file.name, arrayBuffer);
      const tableRows = rows.filter(row => row.some(cell => String(cell).trim()));

      if (!tableRows.length) {
        throw new Error("No readable spreadsheet data was found in this file.");
      }

      const htmlTable = `
        <style>
          body { font-family: Arial, sans-serif; color: #111827; background: #fff; padding: 24px; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th, td { border: 1px solid #d1d5db; padding: 8px 10px; text-align: left; vertical-align: top; }
          th { background: #f3f4f6; font-weight: 700; }
        </style>
        <h2 style="margin-bottom:16px;">Spreadsheet Export</h2>
        <table>
          ${tableRows.map(row => `<tr>${row.map(cell => `<td>${String(cell).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`).join("")}</tr>`).join("")}
        </table>
      `;

      renderContainer = document.createElement("div");
      renderContainer.style.cssText = "position:fixed;left:0;top:0;z-index:-1;opacity:0.01;pointer-events:none;width:794px;padding:24px;box-sizing:border-box;";
      renderContainer.innerHTML = htmlTable;
      document.body.appendChild(renderContainer);

      const pdfBlob = await html2pdf().set({
        margin: [10, 10, 10, 10],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: "#ffffff", logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      }).from(renderContainer).outputPdf("blob") as Blob;

      if (!(pdfBlob instanceof Blob) || pdfBlob.size < 100) {
        throw new Error("PDF generation returned an invalid file.");
      }

      downloadBlobObject(pdfBlob, `${file.name.replace(/\.(xlsx|xls|csv)$/i, "") || "spreadsheet"}.pdf`);
      toast.success(`Converted ${tableRows.length} row${tableRows.length === 1 ? "" : "s"} to PDF.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not convert this spreadsheet to PDF.");
    } finally {
      renderContainer?.remove();
      setLoading(false);
    }
  };

  const handlePdfToExcel = async () => {
    if (!file) { toast.error("Choose a PDF file first"); return; }
    setLoading(true);
    try {
      const loadingTask = pdfjs.getDocument({ data: await file.arrayBuffer() });
      const pdf = await loadingTask.promise;
      const rows: string[][] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = content.items
          .filter(item => "str" in item)
          .map(item => item.str)
          .join("\n");

        if (pageText.trim()) {
          rows.push(...pdfTextToRows(pageText));
        }
      }

      if (!rows.length) {
        throw new Error("No readable text was found in this PDF.");
      }

      const xlsxBlob = await createXlsxFromText(rows.slice(0, 200));
      downloadBlobObject(xlsxBlob, `${file.name.replace(/\.pdf$/i, "") || "document"}.xlsx`);
      toast.success(`Converted ${pdf.numPages} PDF page${pdf.numPages === 1 ? "" : "s"} into Excel rows.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not convert this PDF to Excel.");
    } finally {
      setLoading(false);
    }
  };

  const icon = <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pdf/20"><FileText className="h-8 w-8 text-pdf" /></div>;

  if (tool.type === "pdf-to-word") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="PDF">
        <div className="space-y-6">
          {!file ? <FileUpload accept=".pdf,application/pdf" onFile={setFile} /> : (
            <div className="tool-card flex items-center justify-between gap-4">
              <div><p className="font-medium">{file.name}</p><p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p></div>
              <Button variant="outline" onClick={() => setFile(null)}>Change PDF</Button>
            </div>
          )}
          <Button onClick={handlePdfToWord} disabled={!file || loading} variant="gradient">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</> : "Convert to Word"}
          </Button>
          <p className="text-sm text-muted-foreground">Text is extracted locally and arranged into editable paragraphs. Original layout, images, and tables may not be preserved. Scanned PDFs require OCR.</p>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "pdf-to-jpg" || tool.type === "pdf-to-png") {
    const format = tool.type === "pdf-to-png" ? "PNG" : "JPG";
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="PDF">
        <div className="space-y-6">
          {!file ? <FileUpload accept=".pdf,application/pdf" onFile={setFile} /> : (
            <div className="tool-card flex items-center justify-between gap-4">
              <div><p className="font-medium">{file.name}</p><p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p></div>
              <Button variant="outline" onClick={() => { setFile(null); setJpgResults([]); jpgUrlsRef.current.forEach(URL.revokeObjectURL); jpgUrlsRef.current = []; }}>Change PDF</Button>
            </div>
          )}
          <Button onClick={handlePdfToImage} disabled={!file || loading} variant="gradient">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Rendering pages...</> : `Convert PDF pages to ${format}`}
          </Button>
          {jpgResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{format} Pages ({jpgResults.length})</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {jpgResults.map(result => (
                  <div key={result.name} className="tool-card space-y-3">
                    <img src={result.url} alt={result.name} className="max-h-96 w-full object-contain bg-white" />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium">{result.name}</span>
                      <a href={result.url} download={result.name} className="inline-flex items-center gap-2 text-sm text-primary hover:underline"><Download className="h-4 w-4" /> Download {format}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-sm text-muted-foreground">Each PDF page becomes a separate {format} image. Pages are rendered locally; larger PDFs may take longer. PNG is lossless and may create larger files.</p>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "word-to-pdf") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="PDF">
        <div className="space-y-6">
          {!file ? <FileUpload accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onFile={setFile} /> : (
            <div className="tool-card flex items-center justify-between gap-4">
              <div><p className="font-medium">{file.name}</p><p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p></div>
              <Button variant="outline" onClick={() => setFile(null)}>Change DOCX</Button>
            </div>
          )}
          <Button onClick={handleWordToPdf} disabled={!file || loading} variant="gradient">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</> : "Convert and download PDF"}
          </Button>
          <p className="text-sm text-muted-foreground">Accepts DOCX files. Legacy DOC files and some complex Word layouts may not convert exactly. The PDF is rendered locally in your browser and downloaded directly.</p>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "ppt-to-pdf") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="PDF">
        <div className="space-y-6">
          {!file ? <FileUpload accept={tool.accept || ".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"} onFile={setFile} /> : (
            <div className="tool-card flex items-center justify-between gap-4">
              <div><p className="font-medium">{file.name}</p><p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p></div>
              <Button variant="outline" onClick={() => setFile(null)}>Change File</Button>
            </div>
          )}
          <Button onClick={handlePptToPdf} disabled={!file || loading} variant="gradient">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</> : "Convert to PDF"}
          </Button>
          <p className="text-sm text-muted-foreground">This converter reads slide text from PPTX files and generates a downloadable PDF locally in your browser. Complex animations, charts, and embedded media may not be preserved exactly.</p>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "pdf-to-ppt") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="PDF">
        <div className="space-y-6">
          {!file ? <FileUpload accept=".pdf,application/pdf" onFile={setFile} /> : (
            <div className="tool-card flex items-center justify-between gap-4">
              <div><p className="font-medium">{file.name}</p><p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p></div>
              <Button variant="outline" onClick={() => setFile(null)}>Change PDF</Button>
            </div>
          )}
          <Button onClick={handlePdfToPpt} disabled={!file || loading} variant="gradient">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</> : "Convert to PPT"}
          </Button>
          <p className="text-sm text-muted-foreground">This converts each PDF page into a slide with extracted text. For scanned PDFs, the text may be empty and needs OCR for a better result.</p>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "excel-to-pdf") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="PDF">
        <div className="space-y-6">
          {!file ? <FileUpload accept={tool.accept || ".xlsx,.xls,.csv"} onFile={setFile} /> : (
            <div className="tool-card flex items-center justify-between gap-4">
              <div><p className="font-medium">{file.name}</p><p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p></div>
              <Button variant="outline" onClick={() => setFile(null)}>Change File</Button>
            </div>
          )}
          <Button onClick={handleExcelToPdf} disabled={!file || loading} variant="gradient">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</> : "Convert to PDF"}
          </Button>
          <p className="text-sm text-muted-foreground">This reads spreadsheet rows and turns them into a printable PDF table. .xlsx and CSV formats are supported; legacy .xls files may need conversion first.</p>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "pdf-to-excel") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="PDF">
        <div className="space-y-6">
          {!file ? <FileUpload accept=".pdf,application/pdf" onFile={setFile} /> : (
            <div className="tool-card flex items-center justify-between gap-4">
              <div><p className="font-medium">{file.name}</p><p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p></div>
              <Button variant="outline" onClick={() => setFile(null)}>Change PDF</Button>
            </div>
          )}
          <Button onClick={handlePdfToExcel} disabled={!file || loading} variant="gradient">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</> : "Convert to Excel"}
          </Button>
          <p className="text-sm text-muted-foreground">Text is extracted page-by-page and placed into spreadsheet rows. Complex tables and scanned PDFs may need cleanup after conversion.</p>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "coming-soon") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="PDF">
        <div className="tool-card text-center py-12">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">This tool requires server-side processing and will be available soon.</p>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "html-to-pdf") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="PDF">
        <div className="space-y-6">
          <div className="tool-card"><textarea value={html} onChange={e => setHtml(e.target.value)} placeholder="Paste a complete HTML document here..." className="w-full h-64 p-4 bg-transparent border-0 resize-y focus:outline-none font-mono text-sm" /></div>
          <Button onClick={handleHtmlToPdf} disabled={!html.trim()} variant="gradient">Open print preview</Button>
          <p className="text-sm text-muted-foreground">In the print dialog, choose “Save as PDF”. This runs locally in your browser.</p>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "text-to-pdf") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="PDF">
        <div className="space-y-6">
          <div className="tool-card">
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter or paste your text here..."
              className="w-full h-64 p-4 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground" />
          </div>
          <Button onClick={handleTextToPdf} disabled={loading || !text.trim()} variant="gradient">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating PDF...</> : "Convert to PDF"}
          </Button>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "merge") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="PDF">
        <div className="space-y-6">
          <div className="tool-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">PDF Files ({files.length})</h3>
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Plus className="h-4 w-4" /> Add PDF
              </Button>
              <input ref={fileRef} type="file" accept=".pdf" multiple className="hidden"
                onChange={e => { setFiles(prev => [...prev, ...Array.from(e.target.files || [])]); }} />
            </div>
            {files.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileRef.current?.click()}>
                <p className="text-muted-foreground">Click to add PDF files or drag & drop</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <span className="text-sm">{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
                    <button onClick={() => setFiles(files.filter((_, j) => j !== i))}><X className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleMerge} disabled={loading || files.length < 2} variant="gradient">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Merging...</> : "Merge PDFs"}
          </Button>
        </div>
      </ToolLayout>
    );
  }

  // split, compress, image-to-pdf
  const handleAction = tool.type === "split" ? handleSplit : tool.type === "compress" ? handleCompress : handleImageToPdf;
  const actionLabel = tool.type === "split" ? "Split PDF" : tool.type === "compress" ? "Compress PDF" : "Convert to PDF";

  return (
    <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="PDF">
      <div className="space-y-6">
        {!file ? (
          <FileUpload accept={tool.accept || ".pdf"} onFile={f => { setFile(f); setSplitResults([]); }} />
        ) : (
          <>
            <div className="tool-card flex items-center justify-between">
              <p className="text-sm font-medium">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
              <Button variant="outline" size="sm" onClick={() => { setFile(null); setSplitResults([]); }}>Change</Button>
            </div>
            <Button onClick={handleAction} disabled={loading} variant="gradient">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : actionLabel}
            </Button>
            {splitResults.length > 0 && (
              <div className="tool-card space-y-2">
                <h3 className="font-semibold mb-3">Split Pages ({splitResults.length})</h3>
                {splitResults.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <span className="text-sm">{r.name}</span>
                    <Button size="sm" variant="outline" onClick={() => downloadBlob(r.data, r.name)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default PdfTools;
