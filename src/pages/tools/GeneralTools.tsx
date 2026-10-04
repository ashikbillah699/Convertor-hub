import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import ToolLayout from "@/components/tools/ToolLayout";
import FileUpload from "@/components/tools/FileUpload";
import { Button } from "@/components/ui/button";
import { Wrench, Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";

interface ToolConfig {
  title: string;
  desc: string;
  type: "qr" | "rename" | "gzip" | "coming-soon";
}

const tools: Record<string, ToolConfig> = {
  "qr-code-generator": { title: "QR Code Generator", desc: "Generate QR codes from text or URLs", type: "qr" },
  "file-renamer": { title: "File Renamer", desc: "Rename files before downloading", type: "rename" },
  "zip-to-rar": { title: "ZIP to RAR", desc: "Convert ZIP to RAR format", type: "coming-soon" },
  "rar-to-zip": { title: "RAR to ZIP", desc: "Convert RAR to ZIP format", type: "coming-soon" },
  "file-compressor": { title: "File Compressor", desc: "Compress any file locally into a GZIP archive", type: "gzip" },
};

const GeneralTools = () => {
  const { toolId } = useParams();
  const [qrText, setQrText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [newName, setNewName] = useState("");
  const [copied, setCopied] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const tool = tools[toolId!];
  if (!tool) return <Navigate to="/tools" replace />;

  const icon = <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20"><Wrench className="h-8 w-8 text-primary" /></div>;

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

  const handleRename = () => {
    if (!file || !newName.trim()) return;
    const ext = file.name.includes(".") ? "." + file.name.split(".").pop() : "";
    const blob = new Blob([file], { type: file.type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = newName + ext;
    a.click();
    toast.success("File downloaded with new name!");
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
      <div className="space-y-6">
        {!file ? (
          <FileUpload accept="*" onFile={f => { setFile(f); setNewName(f.name.replace(/\.[^.]+$/, "")); }} />
        ) : (
          <>
            <div className="tool-card">
              <p className="text-sm text-muted-foreground mb-2">Original: {file.name}</p>
              <label className="text-sm font-medium mb-1 block">New filename</label>
              <input value={newName} onChange={e => setNewName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:outline-none" />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleRename} disabled={!newName.trim()} variant="gradient">
                <Download className="h-4 w-4" /> Download Renamed
              </Button>
              <Button onClick={() => setFile(null)} variant="outline">Change File</Button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default GeneralTools;
