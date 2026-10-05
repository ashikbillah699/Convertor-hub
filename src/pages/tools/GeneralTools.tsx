import { lazy, Suspense, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import ToolLayout from "@/components/tools/ToolLayout";
import FileUpload from "@/components/tools/FileUpload";
import { Button } from "@/components/ui/button";
import { Wrench, Download, Copy, Check, Upload, X } from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import JSZip from "jszip";

const ZipTo7zTool = lazy(() => import("@/pages/tools/ZipTo7zTool"));
const RarToZipTool = lazy(() => import("@/pages/tools/RarToZipTool"));

interface ToolConfig {
  title: string;
  desc: string;
  type: "qr" | "rename" | "gzip" | "zip-to-7z" | "rar-to-zip" | "coming-soon";
}

const tools: Record<string, ToolConfig> = {
  "qr-code-generator": { title: "QR Code Generator", desc: "Generate QR codes from text or URLs", type: "qr" },
  "file-renamer": { title: "File Renamer", desc: "Rename files before downloading", type: "rename" },
  "zip-to-7z": { title: "ZIP to 7z Converter", desc: "Convert ZIP archives to 7z format in your browser", type: "zip-to-7z" },
  "zip-to-rar": { title: "ZIP to RAR", desc: "Convert ZIP to RAR format", type: "coming-soon" },
  "rar-to-zip": { title: "RAR to ZIP Converter", desc: "Convert RAR archives to ZIP format securely in your browser", type: "rar-to-zip" },
  "file-compressor": { title: "File Compressor", desc: "Compress any file locally into a GZIP archive", type: "gzip" },
};

const getFileExtension = (name: string) => {
  const dotIndex = name.lastIndexOf(".");
  return dotIndex > 0 ? name.slice(dotIndex) : "";
};

const getFileBaseName = (name: string) => name.slice(0, name.length - getFileExtension(name).length);

const GeneralTools = () => {
  const { toolId } = useParams();
  const [qrText, setQrText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [renameFiles, setRenameFiles] = useState<File[]>([]);
  const [renameNames, setRenameNames] = useState<string[]>([]);
  const [zipping, setZipping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const tool = tools[toolId!];
  if (!tool) return <Navigate to="/tools" replace />;

  const icon = <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20"><Wrench className="h-8 w-8 text-primary" /></div>;

  if (tool.type === "zip-to-7z") {
    return (
      <Suspense fallback={<div className="grid min-h-96 place-items-center text-sm text-muted-foreground">Loading converter...</div>}>
        <ZipTo7zTool icon={icon} />
      </Suspense>
    );
  }

  if (tool.type === "rar-to-zip") {
    return (
      <Suspense fallback={<div className="grid min-h-96 place-items-center text-sm text-muted-foreground">Loading converter...</div>}>
        <RarToZipTool icon={icon} />
      </Suspense>
    );
  }

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "qrcode.png";
      a.click();
      toast.success("QR Code downloaded!");
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const renamedFileNames = renameFiles.map((renameFile, index) =>
    `${renameNames[index]?.trim() ?? ""}${getFileExtension(renameFile.name)}`
  );
  const hasInvalidRenameName = renameNames.some(name => !name.trim() || /[\\/]/.test(name.trim()));
  const hasDuplicateRenameNames = new Set(renamedFileNames.map(name => name.toLowerCase())).size !== renamedFileNames.length;

  const handleRename = async () => {
    if (!renameFiles.length || hasInvalidRenameName || hasDuplicateRenameNames) return;
    setZipping(true);
    try {
      const archive = new JSZip();
      renameFiles.forEach((renameFile, index) => archive.file(renamedFileNames[index], renameFile));
      const blob = await archive.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "renamed-files.zip";
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(`${renameFiles.length} renamed ${renameFiles.length === 1 ? "file" : "files"} downloaded as ZIP.`);
    } catch {
      toast.error("Could not create the ZIP archive.");
    } finally {
      setZipping(false);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    if (!("CompressionStream" in window)) {
      toast.error("GZIP compression is not supported in this browser.");
      return;
    }
    setCompressing(true);
    try {
      const stream = file.stream().pipeThrough(new CompressionStream("gzip"));
      const compressed = await new Response(stream).blob();
      const url = URL.createObjectURL(compressed);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${file.name}.gz`;
      anchor.click();
      URL.revokeObjectURL(url);
      const savings = Math.round((1 - compressed.size / file.size) * 100);
      toast.success(`GZIP archive downloaded (${savings}% size change).`);
    } catch {
      toast.error("Could not compress this file.");
    } finally {
      setCompressing(false);
    }
  };

  if (tool.type === "coming-soon") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="General">
        <div className="tool-card text-center py-12">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">This tool requires server-side processing and will be available soon.</p>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "gzip") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="General">
        <div className="space-y-6">
          {!file ? <FileUpload accept="*" onFile={setFile} /> : (
            <div className="tool-card flex items-center justify-between gap-4">
              <div><p className="font-medium">{file.name}</p><p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p></div>
              <Button variant="outline" onClick={() => setFile(null)}>Change</Button>
            </div>
          )}
          <Button onClick={handleCompress} disabled={!file || compressing} variant="gradient">
            {compressing ? "Compressing..." : "Download GZIP"}
          </Button>
          <p className="text-sm text-muted-foreground">Creates a `.gz` file in your browser. Already-compressed files such as JPG, MP4, and ZIP may become larger.</p>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "qr") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="General">
        <div className="space-y-6">
          <div className="tool-card">
            <label className="text-sm font-medium mb-2 block">Text or URL</label>
            <input value={qrText} onChange={e => setQrText(e.target.value)}
              placeholder="Enter text or URL to generate QR code..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:outline-none" />
          </div>
          {qrText && (
            <div className="tool-card flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-xl">
                <QRCode id="qr-code" value={qrText} size={256} />
              </div>
              <div className="flex gap-3">
                <Button onClick={downloadQR} variant="gradient"><Download className="h-4 w-4" /> Download PNG</Button>
                <Button onClick={() => { navigator.clipboard.writeText(qrText); setCopied(true); toast.success("Copied!"); setTimeout(() => setCopied(false), 2000); }} variant="outline">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy Text
                </Button>
              </div>
            </div>
          )}
        </div>
      </ToolLayout>
    );
  }

  // rename
  return (
    <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="General">
      <div className="space-y-4">
        <label htmlFor="rename-files" className="block border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
          <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <span className="font-medium">Choose multiple files to rename</span>
          <span className="block text-sm text-muted-foreground mt-1">Files stay in your browser</span>
          <input
            id="rename-files"
            type="file"
            multiple
            className="sr-only"
            onChange={event => {
              const selectedFiles = Array.from(event.target.files ?? []);
              setRenameFiles(current => [...current, ...selectedFiles]);
              setRenameNames(current => [...current, ...selectedFiles.map(selectedFile => getFileBaseName(selectedFile.name))]);
              event.target.value = "";
            }}
          />
        </label>
        {renameFiles.length > 0 && (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{renameFiles.length} {renameFiles.length === 1 ? "file" : "files"} selected</p>
              <Button variant="outline" size="sm" onClick={() => { setRenameFiles([]); setRenameNames([]); }}>Clear files</Button>
            </div>
            <div className="tool-card divide-y divide-border p-0 overflow-hidden">
              {renameFiles.map((renameFile, index) => (
                <div key={`${renameFile.name}-${renameFile.lastModified}-${index}`} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-3 p-3">
                  <p className="truncate text-sm" title={renameFile.name}>{renameFile.name}</p>
                  <div className="flex min-w-0 items-center gap-2">
                    <input
                      aria-label={`New name for ${renameFile.name}`}
                      value={renameNames[index]}
                      onChange={event => setRenameNames(current => current.map((name, nameIndex) => nameIndex === index ? event.target.value : name))}
                      className="min-w-0 w-full px-3 py-2 rounded-md border border-border bg-background focus:border-primary focus:outline-none"
                    />
                    {getFileExtension(renameFile.name) && <span className="text-sm text-muted-foreground">{getFileExtension(renameFile.name)}</span>}
                  </div>
                  <Button variant="ghost" size="icon" aria-label={`Remove ${renameFile.name}`} onClick={() => {
                    setRenameFiles(current => current.filter((_, fileIndex) => fileIndex !== index));
                    setRenameNames(current => current.filter((_, nameIndex) => nameIndex !== index));
                  }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {hasInvalidRenameName && <p className="text-sm text-destructive">Each file needs a name without slashes.</p>}
            {!hasInvalidRenameName && hasDuplicateRenameNames && <p className="text-sm text-destructive">Each renamed file must have a unique filename.</p>}
            <Button onClick={handleRename} disabled={zipping || hasInvalidRenameName || hasDuplicateRenameNames} variant="gradient">
              <Download className="h-4 w-4" /> {zipping ? "Creating ZIP..." : "Download ZIP"}
            </Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default GeneralTools;
