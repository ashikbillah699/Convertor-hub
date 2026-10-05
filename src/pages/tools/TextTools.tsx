import { useState, useMemo, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import ToolLayout from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Type, Copy, Check, Trash2, Play, Volume2, Code, Eye } from "lucide-react";
import { toast } from "sonner";
import { marked } from "marked";

interface ToolConfig {
  title: string;
  desc: string;
  type: "counter" | "case" | "transform" | "tts" | "stt";
  transform?: (input: string) => string;
}

const caseTransforms = {
  lower: (t: string) => t.toLowerCase(),
  upper: (t: string) => t.toUpperCase(),
  title: (t: string) => t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
  sentence: (t: string) => t.toLowerCase().replace(/(^\w|[.!?]\s*\w)/g, c => c.toUpperCase()),
  alternating: (t: string) => t.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(""),
  inverse: (t: string) => t.split("").map(c => c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase()).join(""),
};

const jsonToCsv = (input: string): string => {
  const data = JSON.parse(input);
  if (!Array.isArray(data) || !data.length) throw new Error("Input must be a non-empty JSON array");
  const headers = Object.keys(data[0]);
  return [headers.join(","), ...data.map(row => headers.map(h => {
    const v = String(row[h] ?? "");
    return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
  }).join(","))].join("\n");
};

const csvToJson = (input: string): string => {
  const lines = input.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  return JSON.stringify(lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] || ""]));
  }), null, 2);
};

const xmlToJson = (input: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "text/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error("Invalid XML");
  const convert = (node: Element): unknown => {
    const obj: Record<string, unknown> = {};
    for (const child of Array.from(node.children)) {
      const val = child.children.length ? convert(child) : child.textContent;
      if (obj[child.tagName]) {
        if (!Array.isArray(obj[child.tagName])) obj[child.tagName] = [obj[child.tagName]];
        (obj[child.tagName] as unknown[]).push(val);
      } else obj[child.tagName] = val;
    }
    return Object.keys(obj).length ? obj : node.textContent;
  };
  return JSON.stringify(convert(doc.documentElement), null, 2);
};

const tools: Record<string, ToolConfig> = {
  "word-counter": { title: "Word Counter", desc: "Count words, characters, sentences and paragraphs", type: "counter" },
  "character-counter": { title: "Character Counter", desc: "Count characters with and without spaces", type: "counter" },
  "case-converter": { title: "Case Converter", desc: "Convert text case: uppercase, lowercase, title case & more", type: "case" },
  "text-to-speech": { title: "Text to Speech", desc: "Convert text to spoken audio using your browser", type: "tts" },
  "speech-to-text": { title: "Speech to Text", desc: "Transcribe speech using your browser microphone", type: "stt" },
  "json-to-csv": { title: "JSON to CSV", desc: "Convert JSON arrays to CSV format", type: "transform", transform: jsonToCsv },
  "csv-to-json": { title: "CSV to JSON", desc: "Convert CSV data to JSON format", type: "transform", transform: csvToJson },
  "xml-to-json": { title: "XML to JSON", desc: "Convert XML data to JSON format", type: "transform", transform: xmlToJson },
  "base64-encode": { title: "Base64 Encode", desc: "Encode text to Base64 format", type: "transform", transform: (t: string) => btoa(unescape(encodeURIComponent(t))) },
  "base64-decode": { title: "Base64 Decode", desc: "Decode Base64 to plain text", type: "transform", transform: (t: string) => decodeURIComponent(escape(atob(t))) },
  "url-encode": { title: "URL Encode", desc: "Encode text for safe use in URLs", type: "transform", transform: encodeURIComponent },
  "url-decode": { title: "URL Decode", desc: "Decode URL-encoded text", type: "transform", transform: decodeURIComponent },
  "markdown-to-html": { title: "Markdown to HTML", desc: "Convert Markdown text to HTML", type: "transform", transform: (t: string) => marked(t) as string },
};

const TextTools = () => {
  const { toolId } = useParams();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [markdownView, setMarkdownView] = useState<"html" | "preview">("html");
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<{ start: () => void; stop: () => void; continuous: boolean; interimResults: boolean; onresult: ((event: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null } | null>(null);
  const listeningRef = useRef(false);
  const transcriptBeforeListeningRef = useRef("");

  const tool = tools[toolId!];

  const stats = useMemo(() => {
    if (!tool || tool.type !== "counter") return null;
    const text = input;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(s => s.trim()).length : 0;
    const readTime = Math.ceil(words / 200);
    return { chars, charsNoSpace, words, sentences, paragraphs, readTime };
  }, [input, tool]);

  if (!tool) return <Navigate to="/tools" replace />;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransform = () => {
    if (!input.trim()) { toast.error("Enter text first"); return; }
    try {
      setOutput(tool.transform!(input));
      toast.success("Converted!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Conversion failed");
    }
  };

  const handleSpeak = () => {
    if (!input.trim()) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(input);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const handleListen = () => {
    if (listening) {
      listeningRef.current = false;
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const speechWindow = window as typeof window & {
      SpeechRecognition?: new () => NonNullable<typeof recognitionRef.current>;
      webkitSpeechRecognition?: new () => NonNullable<typeof recognitionRef.current>;
    };
    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    transcriptBeforeListeningRef.current = input.trim();
    recognition.onresult = event => {
      const transcript = Array.from(event.results).map(result => result[0].transcript).join(" ").trim();
      const prefix = transcriptBeforeListeningRef.current;
      setInput(transcript ? `${prefix}${prefix ? " " : ""}${transcript}` : prefix);
    };
    recognition.onerror = event => {
      if (event.error === "no-speech" || event.error === "aborted") return;
      listeningRef.current = false;
      setListening(false);
      toast.error("Microphone transcription failed. Check browser microphone permission.");
    };
    recognition.onend = () => {
      if (listeningRef.current) {
        try {
          recognition.start();
          return;
        } catch {
          listeningRef.current = false;
        }
      }
      setListening(false);
    };
    try {
      listeningRef.current = true;
      setListening(true);
      recognition.start();
    } catch {
      listeningRef.current = false;
      setListening(false);
      toast.error("Could not start speech recognition.");
    }
  };

  const icon = <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-text/20"><Type className="h-8 w-8 text-text" /></div>;

  if (tool.type === "counter") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="Text">
        <div className="space-y-6">
          <div className="tool-card">
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className="w-full h-48 p-4 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground" />
          </div>
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Characters", value: stats.chars },
                { label: "Characters (no spaces)", value: stats.charsNoSpace },
                { label: "Words", value: stats.words },
                { label: "Sentences", value: stats.sentences },
                { label: "Paragraphs", value: stats.paragraphs },
                { label: "Reading Time", value: `${stats.readTime} min` },
              ].map(s => (
                <div key={s.label} className="tool-card text-center">
                  <p className="text-2xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={() => handleCopy(input)} disabled={!input} variant="gradient">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </Button>
            <Button onClick={() => setInput("")} variant="outline"><Trash2 className="h-4 w-4" /> Clear</Button>
          </div>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "case") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="Text">
        <div className="space-y-6">
          <div className="tool-card">
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className="w-full h-48 p-4 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(caseTransforms).map(([key, fn]) => (
              <Button key={key} variant="outline" className="h-auto py-3" disabled={!input}
                onClick={() => { setInput(fn(input)); toast.success("Converted!"); }}>
                {key === "lower" ? "lowercase" : key === "upper" ? "UPPERCASE" : key === "title" ? "Title Case" :
                  key === "sentence" ? "Sentence case" : key === "alternating" ? "aLtErNaTiNg" : "iNvErSe"}
              </Button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button onClick={() => handleCopy(input)} disabled={!input} variant="gradient">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied!" : "Copy"}
            </Button>
            <Button onClick={() => setInput("")} variant="outline"><Trash2 className="h-4 w-4" /> Clear</Button>
          </div>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "tts") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="Text">
        <div className="space-y-6">
          <div className="tool-card">
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder="Enter text to convert to speech..."
              className="w-full h-48 p-4 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSpeak} disabled={!input.trim()} variant="gradient">
              {speaking ? <><Volume2 className="h-4 w-4 animate-pulse" /> Stop</> : <><Play className="h-4 w-4" /> Speak</>}
            </Button>
            <Button onClick={() => setInput("")} variant="outline"><Trash2 className="h-4 w-4" /> Clear</Button>
          </div>
        </div>
      </ToolLayout>
    );
  }

  if (tool.type === "stt") {
    return (
      <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="Text">
        <div className="space-y-6">
          <div className="tool-card">
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Your transcription will appear here..."
              className="w-full h-48 p-4 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleListen} variant="gradient">
              {listening ? "Stop listening" : "Start microphone"}
            </Button>
            <Button onClick={() => setInput("")} variant="outline"><Trash2 className="h-4 w-4" /> Clear</Button>
            <Button onClick={() => handleCopy(input)} disabled={!input} variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Requires microphone permission and a browser with speech recognition support. Transcription availability varies by browser and language.</p>
        </div>
      </ToolLayout>
    );
  }

  // transform type
  return (
    <ToolLayout title={tool.title} description={tool.desc} icon={icon} toolCategory="Text">
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="tool-card">
            <h3 className="font-semibold mb-3">Input</h3>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder="Paste your input here..."
              className="w-full h-48 p-4 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground font-mono text-sm" />
          </div>
          <div className="tool-card">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="font-semibold">{toolId === "markdown-to-html" ? "HTML Output" : "Output"}</h3>
              <div className="flex items-center gap-1">
                {toolId === "markdown-to-html" && output && (
                  <>
                    <Button size="sm" variant={markdownView === "html" ? "secondary" : "ghost"} onClick={() => setMarkdownView("html")}>
                      <Code className="h-4 w-4" /> HTML
                    </Button>
                    <Button size="sm" variant={markdownView === "preview" ? "secondary" : "ghost"} onClick={() => setMarkdownView("preview")}>
                      <Eye className="h-4 w-4" /> Preview
                    </Button>
                  </>
                )}
                {output && <Button size="sm" variant="ghost" onClick={() => handleCopy(output)} aria-label="Copy output">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>}
              </div>
            </div>
            {toolId === "markdown-to-html" && output && markdownView === "preview" ? (
              <iframe title="Rendered Markdown preview" sandbox="" srcDoc={output} className="h-48 w-full rounded-md bg-background" />
            ) : (
              <textarea value={output} readOnly placeholder="Output will appear here..."
                className="w-full h-48 p-4 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground font-mono text-sm" />
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleTransform} disabled={!input.trim()} variant="gradient">Convert</Button>
          <Button onClick={() => { setInput(""); setOutput(""); }} variant="outline"><Trash2 className="h-4 w-4" /> Clear</Button>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TextTools;
