import { useState, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import ToolLayout from "@/components/tools/ToolLayout";
import FileUpload from "@/components/tools/FileUpload";
import { Button } from "@/components/ui/button";
import { Image, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ToolConfig {
  title: string;
  desc: string;
  accept: string;
  outMime: string;
  outExt: string;
  type?: "resize" | "compress" | "background-remove";
}

const tools: Record<string, ToolConfig> = {
  "jpg-to-png": { title: "JPG to PNG", desc: "Convert JPG images to PNG format with transparency support", accept: ".jpg,.jpeg", outMime: "image/png", outExt: "png" },
  "png-to-jpg": { title: "PNG to JPG", desc: "Convert PNG images to JPG format for smaller file size", accept: ".png", outMime: "image/jpeg", outExt: "jpg" },
  "webp-to-png": { title: "WebP to PNG", desc: "Convert WebP images to PNG format", accept: ".webp", outMime: "image/png", outExt: "png" },
  "webp-to-jpg": { title: "WebP to JPG", desc: "Convert WebP images to JPG format", accept: ".webp", outMime: "image/jpeg", outExt: "jpg" },
  "heic-to-jpg": { title: "HEIC to JPG", desc: "Convert HEIC photos to JPG format (Safari supported)", accept: ".heic,.heif", outMime: "image/jpeg", outExt: "jpg" },
  "bmp-to-jpg": { title: "BMP to JPG", desc: "Convert BMP images to JPG format", accept: ".bmp", outMime: "image/jpeg", outExt: "jpg" },
  "ico-to-png": { title: "ICO to PNG", desc: "Convert ICO icons to PNG format", accept: ".ico", outMime: "image/png", outExt: "png" },
  "image-resize": { title: "Image Resize", desc: "Resize images to any dimension", accept: "image/*", outMime: "image/png", outExt: "png", type: "resize" },
  "image-compress": { title: "Image Compressor", desc: "Reduce image file size with quality control", accept: "image/*", outMime: "image/jpeg", outExt: "jpg", type: "compress" },
  "background-remover": { title: "Background Remover", desc: "Remove a solid-color background locally using color matching", accept: "image/*", outMime: "image/png", outExt: "png", type: "background-remove" },
};

const ImageTools = () => {
  const { toolId } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [quality, setQuality] = useState(80);
  const [keepAspect, setKeepAspect] = useState(true);
  const [tolerance, setTolerance] = useState(36);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);

  const tool = tools[toolId!];
  if (!tool) return <Navigate to="/tools" replace />;

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult("");
    const img = new window.Image();
    img.onload = () => { setOrigW(img.width); setOrigH(img.height); setWidth(img.width); setHeight(img.height); };
    img.src = URL.createObjectURL(f);
  };

  const convert = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const isHeic = /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
      let imageBitmap: ImageBitmap | null = null;
      let source: HTMLImageElement | ImageBitmap | null = null;

      if (isHeic && "createImageBitmap" in window) {
        try {
          imageBitmap = await createImageBitmap(file);
          source = imageBitmap;
        } catch {
          imageBitmap = null;
        }
      }

      if (!source) {
        const img = new window.Image();
        img.src = URL.createObjectURL(file);
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("This file could not be decoded by the browser."));
        });
        source = img;
      }

      const canvas = document.createElement("canvas");
      const widthValue = tool.type === "resize" ? width : (source instanceof HTMLImageElement ? source.width : source.width);
      const heightValue = tool.type === "resize" ? height : (source instanceof HTMLImageElement ? source.height : source.height);
      canvas.width = widthValue;
      canvas.height = heightValue;
      const ctx = canvas.getContext("2d")!;
      if (tool.outMime === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, widthValue, heightValue);
      }
      ctx.drawImage(source, 0, 0, widthValue, heightValue);
      if (tool.type === "background-remove") {
        const pixels = ctx.getImageData(0, 0, widthValue, heightValue);
        const data = pixels.data;
        const sample = [data[0], data[1], data[2]];
        const threshold = tolerance * Math.sqrt(3);
        for (let i = 0; i < data.length; i += 4) {
          const distance = Math.hypot(data[i] - sample[0], data[i + 1] - sample[1], data[i + 2] - sample[2]);
          if (distance <= threshold) data[i + 3] = 0;
        }
        ctx.putImageData(pixels, 0, 0);
      }
      const q = tool.type === "compress" ? quality / 100 : 0.92;
      const blob = await new Promise<Blob>((r, reject) => {
        canvas.toBlob((b) => {
          if (!b) reject(new Error("Canvas export failed."));
          else r(b);
        }, tool.outMime, q);
      });
      setResult(URL.createObjectURL(blob));
      toast.success("Conversion complete!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Conversion failed. Try a different file.";
      toast.error(message.includes("browser") ? "HEIC/HEIF images are not supported in this browser. Try Safari/Chrome with HEIC support or convert the file first." : message);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `converted.${tool.outExt}`;
    a.click();
  };

  return (
    <ToolLayout
      title={tool.title}
      description={tool.desc}
      icon={<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-image/20"><Image className="h-8 w-8 text-image" /></div>}
      toolCategory="Image"
    >
      <div className="space-y-6">
          {!file ? (
            <FileUpload accept={tool.accept} onFile={handleFile} />
          ) : (
            <>
              <div className="tool-card">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
                  <Button variant="outline" size="sm" onClick={() => { setFile(null); setPreview(""); setResult(""); }}>Change File</Button>
                </div>
                {preview && <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />}
              </div>

              {tool.type === "resize" && (
                <div className="tool-card">
                  <h3 className="font-semibold mb-3">Resize Options</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Width (px)</label>
                      <input type="number" value={width} onChange={e => {
                        const w = Number(e.target.value);
                        setWidth(w);
                        if (keepAspect && origW) setHeight(Math.round(w * origH / origW));
                      }} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Height (px)</label>
                      <input type="number" value={height} onChange={e => {
                        const h = Number(e.target.value);
                        setHeight(h);
                        if (keepAspect && origH) setWidth(Math.round(h * origW / origH));
                      }} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 mt-3 text-sm">
                    <input type="checkbox" checked={keepAspect} onChange={e => setKeepAspect(e.target.checked)} />
                    Keep aspect ratio
                  </label>
                </div>
              )}

              {tool.type === "compress" && (
                <div className="tool-card">
                  <h3 className="font-semibold mb-3">Quality: {quality}%</h3>
                  <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Smaller file</span><span>Better quality</span>
                  </div>
                </div>
              )}

              {tool.type === "background-remove" && (
                <div className="tool-card">
                  <label className="font-semibold">Color match tolerance: {tolerance}</label>
                  <input type="range" min="5" max="140" value={tolerance} onChange={e => setTolerance(Number(e.target.value))} className="w-full mt-3" />
                  <p className="text-sm text-muted-foreground mt-2">The top-left pixel is treated as the background color. Best for images with a plain, evenly lit background.</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={convert} disabled={loading} variant="gradient">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</> : "Convert Now"}
                </Button>
                {result && (
                  <Button onClick={download} variant="outline">
                    <Download className="h-4 w-4" /> Download
                  </Button>
                )}
              </div>

              {result && (
                <div className="tool-card">
                  <h3 className="font-semibold mb-3">Result</h3>
                  <img src={result} alt="Result" className="max-h-64 mx-auto rounded-lg" />
                </div>
              )}
            </>
          )}
      </div>
    </ToolLayout>
  );
};

export default ImageTools;
