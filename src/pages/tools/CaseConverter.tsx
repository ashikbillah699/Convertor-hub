import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Type, Copy, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const caseOptions = [
  { id: "lowercase", label: "lowercase", transform: (text: string) => text.toLowerCase() },
  { id: "uppercase", label: "UPPERCASE", transform: (text: string) => text.toUpperCase() },
  { id: "titlecase", label: "Title Case", transform: (text: string) => 
    text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) 
  },
  { id: "sentencecase", label: "Sentence case", transform: (text: string) => 
    text.toLowerCase().replace(/(^\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
  },
  { id: "capitalize", label: "Capitalize Each Word", transform: (text: string) => 
    text.replace(/\b\w/g, (c) => c.toUpperCase())
  },
  { id: "alternating", label: "aLtErNaTiNg CaSe", transform: (text: string) => 
    text.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("")
  },
  { id: "inverse", label: "InVeRsE cAsE", transform: (text: string) => 
    text.split("").map((c) => c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase()).join("")
  },
];

const CaseConverter = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = (transform: (text: string) => string) => {
    setText(transform(text));
    toast.success("Text converted!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText("");
    toast.success("Text cleared!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-text/20">
                <Type className="h-8 w-8 text-text" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Case <span className="gradient-text">Converter</span>
            </h1>
            <p className="text-muted-foreground">
              Convert text to uppercase, lowercase, title case, and more. Free and instant.
            </p>
          </div>

          {/* Textarea */}
          <div className="tool-card mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className="w-full h-48 p-4 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Conversion Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {caseOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="h-auto py-3"
                onClick={() => handleConvert(option.transform)}
                disabled={!text}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCopy} variant="gradient" disabled={!text}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </Button>
            <Button onClick={handleClear} variant="outline">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>

          {/* Info Section */}
          <div className="mt-12 tool-card">
            <h3 className="font-semibold mb-4">About Case Converter</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>lowercase:</strong> Converts all letters to lowercase.
              </p>
              <p>
                <strong>UPPERCASE:</strong> Converts all letters to uppercase.
              </p>
              <p>
                <strong>Title Case:</strong> Capitalizes the first letter of each word.
              </p>
              <p>
                <strong>Sentence case:</strong> Capitalizes the first letter of each sentence.
              </p>
              <p>
                <strong>aLtErNaTiNg:</strong> Alternates between lower and uppercase letters.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CaseConverter;
