import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Type, Copy, Trash2, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const WordCounter = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    const words = trimmedText ? trimmedText.split(/\s+/).filter(Boolean) : [];
    const sentences = trimmedText ? trimmedText.split(/[.!?]+/).filter(s => s.trim()) : [];
    const paragraphs = trimmedText ? trimmedText.split(/\n\n+/).filter(p => p.trim()) : [];
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const readingTime = Math.ceil(words.length / 200);
    const speakingTime = Math.ceil(words.length / 150);

    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      readingTime,
      speakingTime,
    };
  }, [text]);

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

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text-content.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
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
              Word <span className="gradient-text">Counter</span>
            </h1>
            <p className="text-muted-foreground">
              Count words, characters, sentences, and more. Free and instant.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="tool-card text-center">
              <div className="text-3xl font-bold gradient-text">{stats.words}</div>
              <div className="text-sm text-muted-foreground">Words</div>
            </div>
            <div className="tool-card text-center">
              <div className="text-3xl font-bold gradient-text">{stats.characters}</div>
              <div className="text-sm text-muted-foreground">Characters</div>
            </div>
            <div className="tool-card text-center">
              <div className="text-3xl font-bold gradient-text">{stats.sentences}</div>
              <div className="text-sm text-muted-foreground">Sentences</div>
            </div>
            <div className="tool-card text-center">
              <div className="text-3xl font-bold gradient-text">{stats.paragraphs}</div>
              <div className="text-sm text-muted-foreground">Paragraphs</div>
            </div>
          </div>

          {/* Textarea */}
          <div className="tool-card mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className="w-full h-64 p-4 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button onClick={handleCopy} variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </Button>
            <Button onClick={handleClear} variant="outline">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
            <Button onClick={handleDownload} variant="outline" disabled={!text}>
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="tool-card">
              <h3 className="font-semibold mb-4">Reading Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Characters (no spaces)</span>
                  <span className="font-medium">{stats.charactersNoSpaces}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reading time</span>
                  <span className="font-medium">{stats.readingTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Speaking time</span>
                  <span className="font-medium">{stats.speakingTime} min</span>
                </div>
              </div>
            </div>
            <div className="tool-card">
              <h3 className="font-semibold mb-4">Tips</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Average reading speed: 200 words/min</li>
                <li>• Average speaking speed: 150 words/min</li>
                <li>• Twitter limit: 280 characters</li>
                <li>• Meta description: 155-160 characters</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WordCounter;
