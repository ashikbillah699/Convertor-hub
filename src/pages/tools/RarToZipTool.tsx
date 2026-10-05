import { useState, type ReactNode } from "react";
import { Archive, Download, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/tools/ToolLayout";
import ToolSeo, { type SeoFaq } from "@/components/seo/ToolSeo";
import { convertRarToZip, createZipFileName } from "@/lib/rarToZip";

interface Props {
  icon: ReactNode;
}

const canonicalPath = "/tools/general/rar-to-zip";
const title = "RAR to ZIP Converter Online - Free & Private | OpticThirst";
const description = "Convert RAR files to ZIP online for free. Preserve folders and filenames with browser-based conversion; your files stay on your device.";
const keywords = [
  "RAR to ZIP",
  "convert RAR to ZIP online",
  "RAR ZIP converter",
  "RAR file converter free",
  "RAR to ZIP online free",
  "convert RAR archive",
  "RAR extractor and ZIP maker",
  "private archive converter",
];
const features = [
  "Convert RAR archives to ZIP format in your browser",
  "Preserve folder structure and file names",
  "Support for RAR v4 and RAR v5 archives",
  "Process files locally without uploading them",
];

const faqs: SeoFaq[] = [
  {
    question: "How do I convert a RAR file to ZIP?",
    answer: "Select a .rar archive, choose Convert to ZIP, and wait while the archive is read and repackaged. Your converted .zip file downloads to your device.",
  },
  {
    question: "Are my RAR files uploaded to a server?",
    answer: "No. The RAR archive is opened and converted locally in your browser. It is not uploaded to OpticThirst.",
  },
  {
    question: "Will the ZIP keep the RAR archive's folders and file names?",
    answer: "Yes. The converter preserves the paths and names of files inside the RAR archive when creating the ZIP file.",
  },
  {
    question: "Does this converter support RAR4 and RAR5?",
    answer: "The converter supports RAR v4 and RAR v5 archives. Some archives with unsupported compression methods or damaged data may not convert.",
  },
  {
    question: "Can I convert a password-protected RAR file?",
    answer: "Password-protected RAR archives are not supported. Remove the password protection before converting the archive.",
  },
  {
    question: "Does converting RAR to ZIP reduce the file size?",
    answer: "Not necessarily. The ZIP size depends on the contents and compression. Already-compressed files may stay about the same size or become larger.",
  },
];

const RarToZipTool = ({ icon }: Props) => {
  const [rarFile, setRarFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [stage, setStage] = useState("");

  const selectRar = (selectedFile?: File) => {
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith(".rar")) {
      toast.error("Choose a RAR archive to convert.");
      return;
    }
    setRarFile(selectedFile);
    setStage("");
  };

  const handleConvert = async () => {
    if (!rarFile) return;
    setConverting(true);

    try {
      const convertedFile = await convertRarToZip(rarFile, setStage);
      const downloadUrl = URL.createObjectURL(convertedFile);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = createZipFileName(rarFile.name);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      toast.success("Your ZIP archive is ready to download.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not convert this RAR archive.");
    } finally {
      setConverting(false);
      setStage("");
    }
  };

  return (
    <>
      <ToolSeo
        title={title}
        description={description}
        canonicalPath={canonicalPath}
        keywords={keywords}
        faqs={faqs}
        features={features}
      />
      <ToolLayout
        title="RAR to ZIP Converter"
        description="Convert RAR archives into ZIP files securely in your browser, with folders and filenames preserved."
        icon={icon}
        toolCategory="General"
      >
        <div className="space-y-12">
          <section aria-label="RAR to ZIP converter" className="space-y-5">
            {!rarFile ? (
              <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                <Archive className="mx-auto mb-3 h-10 w-10 text-primary" aria-hidden="true" />
                <label htmlFor="rar-to-zip-file" className="mb-2 block font-medium">Choose a RAR archive</label>
                <input
                  id="rar-to-zip-file"
                  type="file"
                  accept=".rar,application/vnd.rar,application/x-rar-compressed"
                  onChange={event => selectRar(event.target.files?.[0])}
                  className="mx-auto block max-w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-primary-foreground"
                />
                <p className="mt-3 text-sm text-muted-foreground">RAR files are processed on this device.</p>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Archive className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate font-medium" title={rarFile.name}>{rarFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(rarFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" aria-label="Remove RAR archive" onClick={() => setRarFile(null)} disabled={converting}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Button onClick={handleConvert} disabled={!rarFile || converting} variant="gradient">
                <Download className="h-4 w-4" /> {converting ? "Converting..." : "Convert to ZIP"}
              </Button>
              <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{stage}</p>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              Your archive stays in your browser and is not uploaded.
            </p>
          </section>

          <section aria-labelledby="how-to-convert" className="space-y-4 border-t border-border pt-8">
            <h2 id="how-to-convert" className="text-2xl font-semibold">How to convert RAR to ZIP online</h2>
            <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
              <li>Select a RAR archive from your device.</li>
              <li>Choose <strong className="text-foreground">Convert to ZIP</strong> and wait for processing to finish.</li>
              <li>Save the downloaded ZIP archive to your device.</li>
            </ol>
            <p className="text-sm text-muted-foreground">
              Folder paths and file names are preserved. Conversion happens on your device; password-protected archives are not supported.
            </p>
          </section>

          <section aria-labelledby="rar-to-zip-benefits" className="space-y-4 border-t border-border pt-8">
            <h2 id="rar-to-zip-benefits" className="text-2xl font-semibold">Convert a RAR archive to a ZIP file</h2>
            <p className="leading-7 text-muted-foreground">
              ZIP files are widely supported by operating systems and apps, so converting a RAR archive can make its contents easier to share and open. This free RAR to ZIP converter reads the archive in your browser and packages its files into a standard ZIP without sending the source file to a server.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Works with supported RAR v4 and RAR v5 archives.</li>
              <li>Maintains files in their original folders.</li>
              <li>Creates a ZIP archive with the same base file name.</li>
              <li>Runs locally in your browser on desktop and mobile devices.</li>
            </ul>
          </section>

          <section aria-labelledby="rar-to-zip-faq" className="border-t border-border pt-8">
            <h2 id="rar-to-zip-faq" className="mb-2 text-2xl font-semibold">RAR to ZIP converter FAQ</h2>
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

export default RarToZipTool;
