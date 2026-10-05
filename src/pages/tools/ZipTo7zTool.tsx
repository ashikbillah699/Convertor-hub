import { useState, type ReactNode } from "react";
import { Archive, Download, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/tools/ToolLayout";
import ToolSeo, { type SeoFaq } from "@/components/seo/ToolSeo";
import { convertZipTo7z, create7zFileName } from "@/lib/zipTo7z";

interface Props {
  icon: ReactNode;
}

const canonicalPath = "/tools/general/zip-to-7z";
const title = "ZIP to 7z Converter Online | Free & Private";
const description = "Convert ZIP archives to 7z online for free. Preserve folders and filenames with secure, browser-based conversion; your files stay on your device.";
const keywords = ["zip to 7z", "convert zip to 7z online", "zip to 7zip converter", "free 7z converter", "online archive converter"];

const faqs: SeoFaq[] = [
  {
    question: "How do I convert a ZIP file to 7z?",
    answer: "Choose a ZIP archive and select Convert to 7z. The converter extracts its files in your browser, creates a 7z archive, and downloads it to your device.",
  },
  {
    question: "Are my ZIP files uploaded to a server?",
    answer: "No. The archive is processed locally in your browser and is not uploaded to OpticThirst.",
  },
  {
    question: "Will the converted 7z archive keep folders and filenames?",
    answer: "Yes. The converter preserves the paths and filenames of files inside the ZIP archive.",
  },
  {
    question: "Can I convert password-protected ZIP files?",
    answer: "Password-protected ZIP archives are not supported yet. Remove the password protection before converting.",
  },
];

const ZipTo7zTool = ({ icon }: Props) => {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [stage, setStage] = useState("");

  const selectZip = (selectedFile?: File) => {
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith(".zip")) {
      toast.error("Choose a ZIP archive to convert.");
      return;
    }
    setZipFile(selectedFile);
    setStage("");
  };

  const handleConvert = async () => {
    if (!zipFile) return;
    setConverting(true);

    try {
      const convertedFile = await convertZipTo7z(zipFile, setStage);
      const downloadUrl = URL.createObjectURL(convertedFile);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = create7zFileName(zipFile.name);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      toast.success("Your 7z archive is ready to download.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not convert this ZIP archive.");
    } finally {
      setConverting(false);
      setStage("");
    }
  };

  return (
    <>
      <ToolSeo title={title} description={description} canonicalPath={canonicalPath} keywords={keywords} faqs={faqs} />
      <ToolLayout title="ZIP to 7z Converter" description="Convert ZIP archives to 7z format securely in your browser." icon={icon} toolCategory="General">
        <div className="space-y-12">
          <section aria-label="ZIP to 7z converter" className="space-y-5">
            {!zipFile ? (
              <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                <Archive className="mx-auto mb-3 h-10 w-10 text-primary" aria-hidden="true" />
                <label htmlFor="zip-to-7z-file" className="mb-2 block font-medium">Choose a ZIP archive</label>
                <input
                  id="zip-to-7z-file"
                  type="file"
                  accept=".zip,application/zip"
                  onChange={event => selectZip(event.target.files?.[0])}
                  className="mx-auto block max-w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-primary-foreground"
                />
                <p className="mt-3 text-sm text-muted-foreground">ZIP files are processed on this device.</p>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Archive className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate font-medium" title={zipFile.name}>{zipFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(zipFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" aria-label="Remove ZIP archive" onClick={() => setZipFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Button onClick={handleConvert} disabled={!zipFile || converting} variant="gradient">
                <Download className="h-4 w-4" /> {converting ? "Converting..." : "Convert to 7z"}
              </Button>
              <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{stage}</p>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              Your archive stays in your browser and is not uploaded.
            </p>
          </section>

          <section aria-labelledby="how-to-convert" className="space-y-4 border-t border-border pt-8">
            <h2 id="how-to-convert" className="text-2xl font-semibold">How to convert ZIP to 7z</h2>
            <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
              <li>Select a ZIP archive from your device.</li>
              <li>Choose <strong className="text-foreground">Convert to 7z</strong> and wait for processing to finish.</li>
              <li>Save the downloaded 7z archive to your device.</li>
            </ol>
            <p className="text-sm text-muted-foreground">File names and folder paths are preserved. Password-protected ZIP files are not supported.</p>
          </section>

          <section aria-labelledby="zip-to-7z-faq" className="border-t border-border pt-8">
            <h2 id="zip-to-7z-faq" className="mb-2 text-2xl font-semibold">ZIP to 7z converter FAQ</h2>
            {faqs.map(({ question, answer }) => (
              <details key={question} className="border-b border-border py-4">
                <summary className="cursor-pointer font-medium">{question}</summary>
                <p className="pt-3 text-sm leading-6 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </section>
        </div>
      </ToolLayout>
    </>
  );
};

export default ZipTo7zTool;