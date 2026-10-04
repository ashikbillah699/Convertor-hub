import { useRef } from "react";
import { Upload } from "lucide-react";

interface Props {
  accept: string;
  onFile: (file: File) => void;
  label?: string;
}

const FileUpload = ({ accept, onFile, label }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
      onClick={() => ref.current?.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
    >
      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p className="font-medium">{label || "Drop your file here or click to browse"}</p>
      <p className="text-sm text-muted-foreground mt-1">Supports: {accept}</p>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
    </div>
  );
};

export default FileUpload;
