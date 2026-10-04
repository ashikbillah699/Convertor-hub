import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import ToolLayout from "@/components/tools/ToolLayout";
import FileUpload from "@/components/tools/FileUpload";
import { Button } from "@/components/ui/button";
import { Video, Music, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { convertVideoToMp3, convertVideoToGif, getMp3OutputName, type Mp3ConversionStatus } from "@/lib/videoAudio";
import { getVideoCompressionSettings } from "@/lib/mediaCompression";

interface ToolConfig {
  title: string;
  desc: string;
  accept: string;
  category: "video" | "audio";
}

const audioBufferToWav = (buffer: AudioBuffer): Blob => {
  const channels = buffer.numberOfChannels;
  const frames = buffer.length;
  const bytesPerSample = 2;
  const dataSize = frames * channels * bytesPerSample;
  const output = new ArrayBuffer(44 + dataSize);
  const view = new DataView(output);
  const writeText = (offset: number, value: string) => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  writeText(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeText(8, "WAVE");
  writeText(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * channels * bytesPerSample, true);
  view.setUint16(32, channels * bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeText(36, "data");
  view.setUint32(40, dataSize, true);
  let offset = 44;
  for (let frame = 0; frame < frames; frame++) {
    for (let channel = 0; channel < channels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[frame]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += bytesPerSample;
    }
  }
  return new Blob([output], { type: "audio/wav" });
};

const getYouTubeId = (value: string) => {
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0];
    if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(url.hostname)) {
      return url.searchParams.get("v") || url.pathname.match(/\/(?:shorts|embed|live)\/([^/?]+)/)?.[1] || null;
    }
  } catch {
    return null;
  }
  return null;
};

const tools: Record<string, ToolConfig> = {
  "mp4-to-mp3": { title: "MP4 to MP3", desc: "Extract audio from video files", accept: ".mp4", category: "video" },
  "mp3-to-wav": { title: "MP3 to WAV", desc: "Convert MP3 audio to WAV format", accept: ".mp3", category: "audio" },
  "wav-to-mp3": { title: "WAV to MP3", desc: "Convert WAV audio to MP3 format", accept: ".wav", category: "audio" },
  "mp4-to-gif": { title: "Video to GIF", desc: "Convert video clips to animated GIF", accept: ".mp4,.webm,.mov,.avi", category: "video" },
  "video-compress": { title: "Video Compressor", desc: "Reduce video file size", accept: ".mp4,.webm,.avi,.mov", category: "video" },
  "audio-compress": { title: "Audio Compressor", desc: "Reduce audio file size", accept: ".mp3,.wav,.m4a", category: "audio" },
  "video-to-audio": { title: "Video to Audio", desc: "Extract audio from video files and download as MP3", accept: ".mp4,.webm,.avi,.mov", category: "video" },
  "youtube-thumbnail": { title: "YouTube Thumbnail Downloader", desc: "Download YouTube video thumbnails", accept: "", category: "video" },
  "youtube-mp3": { title: "YouTube MP3 Downloader", desc: "Download audio from YouTube videos", accept: "", category: "video" },
  "m4a-to-mp3": { title: "M4A to MP3", desc: "Convert M4A audio to MP3 format", accept: ".m4a", category: "audio" },
};

const VideoAudioTools = () => {
  const { toolId } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mp3Status, setMp3Status] = useState<Mp3ConversionStatus | null>(null);
  const [gifStatus, setGifStatus] = useState<Mp3ConversionStatus | null>(null);
  const [gifStartSeconds, setGifStartSeconds] = useState(0);
  const [gifDuration, setGifDuration] = useState(5);
  const [gifWidth, setGifWidth] = useState(480);
  const [gifFps, setGifFps] = useState(10);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [videoBitrate, setVideoBitrate] = useState(300);
  const [audioBitrate, setAudioBitrate] = useState(96);

  const tool = tools[toolId!];
  if (!tool) return <Navigate to="/tools" replace />;
  const Icon = tool.category === "video" ? Video : Music;
  const colorClass = tool.category === "video" ? "bg-video/20 text-video" : "bg-audio/20 text-audio";

  const handleThumbnail = () => {
    const videoId = getYouTubeId(youtubeUrl);
    if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
      toast.error("Enter a valid YouTube video URL");
      return;
    }
    setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
  };

  const handleAudioToWav = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const context = new AudioContext();
      const decoded = await context.decodeAudioData(await file.arrayBuffer());
      const wav = audioBufferToWav(decoded);
      const url = URL.createObjectURL(wav);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${file.name.replace(/\.[^.]+$/, "")}.wav`;
      anchor.click();
      URL.revokeObjectURL(url);
      await context.close();
      toast.success("WAV file downloaded");
    } catch {
      toast.error("This browser could not decode the selected audio format.");
    } finally {
      setLoading(false);
    }
  };

  const handleMp4ToMp3 = async () => {
    if (!file) return;
    setLoading(true);
    setMp3Status(null);
    try {
      const mp3Blob = await convertVideoToMp3(file, setMp3Status);
      const url = URL.createObjectURL(mp3Blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = getMp3OutputName(file.name);
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("MP4 converted to MP3 and downloaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "MP4 to MP3 conversion failed.");
    } finally {
      setLoading(false);
      setMp3Status(null);
    }
  };

  const handleWavToMp3 = async () => {
    if (!file) return;
    setLoading(true);
    setMp3Status(null);
    try {
      const mp3Blob = await convertVideoToMp3(file, setMp3Status);
      const url = URL.createObjectURL(mp3Blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = getMp3OutputName(file.name);
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(`WAV converted to MP3 (${(mp3Blob.size / 1024 / 1024).toFixed(2)} MB).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "WAV to MP3 conversion failed.");
    } finally {
      setLoading(false);
      setMp3Status(null);
    }
  };

  const handleVideoToGif = async () => {
    if (!file) return;
    setLoading(true);
    setGifStatus(null);
    try {
      const gifBlob = await convertVideoToGif(file, {
        startSeconds: gifStartSeconds,
        durationSeconds: gifDuration,
        width: gifWidth,
        fps: gifFps,
      }, setGifStatus);
      const url = URL.createObjectURL(gifBlob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${file.name.replace(/\.[^.]+$/, "") || "video"}.gif`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(`GIF created (${(gifBlob.size / 1024 / 1024).toFixed(2)} MB).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Video to GIF conversion failed.");
    } finally {
      setLoading(false);
      setGifStatus(null);
    }
  };

  const handleVideoToAudio = async () => {
    if (!file) return;
    setLoading(true);
    setMp3Status(null);
    try {
      const mp3Blob = await convertVideoToMp3(file, setMp3Status);
      const url = URL.createObjectURL(mp3Blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = getMp3OutputName(file.name);
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(`Audio extracted as MP3 (${(mp3Blob.size / 1024 / 1024).toFixed(2)} MB).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Video audio extraction failed.");
    } finally {
      setLoading(false);
      setMp3Status(null);
    }
  };

  const handleCompression = async () => {
    if (!file) return;
    if (!window.MediaRecorder) {
      toast.error("Media recording is not supported in this browser.");
      return;
    }
    setLoading(true);
    setCompressionProgress(0);
    let audioContext: AudioContext | null = null;
    let mediaUrl = "";
    let animationFrame = 0;
    let activeRecorder: MediaRecorder | null = null;
    let videoSettings: ReturnType<typeof getVideoCompressionSettings> | null = null;
    let cleanup = () => {};
    let onMediaEnded: (() => void) | null = null;
    try {
      const isVideo = toolId === "video-compress";
      const mimeCandidates = isVideo
        ? ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"]
        : ["audio/webm;codecs=opus", "audio/ogg;codecs=opus"];
      const mimeType = mimeCandidates.find(type => MediaRecorder.isTypeSupported(type));
      if (!mimeType) throw new Error("This browser does not support the required WebM/Opus encoder.");

      let stream: MediaStream;
      let start: () => Promise<void>;

      if (isVideo) {
        const video = document.createElement("video");
        mediaUrl = URL.createObjectURL(file);
        video.src = mediaUrl;
        video.playsInline = true;
        video.preload = "auto";
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject(new Error("This browser cannot decode this video file."));
        });

        const canvas = document.createElement("canvas");
        videoSettings = getVideoCompressionSettings(video.videoWidth, video.videoHeight, videoBitrate);
        canvas.width = videoSettings.width;
        canvas.height = videoSettings.height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas is not available in this browser.");
        const videoStream = canvas.captureStream(videoSettings.frameRate);
        audioContext = new AudioContext();
        const audioDestination = audioContext.createMediaStreamDestination();
        const audioSource = audioContext.createMediaElementSource(video);
        audioSource.connect(audioDestination);
        const tracks = [...videoStream.getVideoTracks(), ...audioDestination.stream.getAudioTracks()];
        stream = new MediaStream(tracks);

        const drawFrame = () => {
          if (video.ended || video.paused) return;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          animationFrame = requestAnimationFrame(drawFrame);
        };
        video.ontimeupdate = () => {
          if (video.duration > 0) setCompressionProgress(Math.min(99, Math.round((video.currentTime / video.duration) * 100)));
        };
        video.onended = () => {
          setCompressionProgress(100);
          onMediaEnded?.();
        };
        const stopTracks = () => tracks.forEach(track => track.stop());
        cleanup = () => {
          cancelAnimationFrame(animationFrame);
          video.pause();
          video.removeAttribute("src");
          video.load();
          stopTracks();
          URL.revokeObjectURL(mediaUrl);
        };
        start = async () => {
          await audioContext!.resume();
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          await video.play();
          animationFrame = requestAnimationFrame(drawFrame);
        };
      } else {
        audioContext = new AudioContext();
        const decoded = await audioContext.decodeAudioData(await file.arrayBuffer());
        const audioDestination = audioContext.createMediaStreamDestination();
        const source = audioContext.createBufferSource();
        source.buffer = decoded;
        source.connect(audioDestination);
        source.onended = () => {
          setCompressionProgress(100);
          onMediaEnded?.();
        };
        stream = audioDestination.stream;
        cleanup = () => {
          try { source.stop(); } catch {}
          stream.getTracks().forEach(track => track.stop());
        };
        start = async () => {
          await audioContext!.resume();
          source.start();
        };
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        ...(isVideo
          ? videoSettings
            ? {
                videoBitsPerSecond: videoSettings.videoBitsPerSecond,
                audioBitsPerSecond: videoSettings.audioBitsPerSecond,
              }
            : {}
          : { audioBitsPerSecond: audioBitrate * 1000 }),
      });
      activeRecorder = recorder;
      onMediaEnded = () => {
        if (recorder.state === "recording") recorder.stop();
      };
      const chunks: BlobPart[] = [];
      const output = await new Promise<Blob>((resolve, reject) => {
        recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
        recorder.onerror = () => reject(new Error("Media encoding failed."));
        recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
        recorder.start(250);
        void start().catch(error => {
          if (recorder.state === "recording") recorder.stop();
          reject(error);
        });
      });

      const extension = mimeType.startsWith("audio/ogg") ? "ogg" : "webm";
      const url = URL.createObjectURL(output);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${file.name.replace(/\.[^.]+$/, "")}-compressed.${extension}`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      const change = Math.round((1 - output.size / file.size) * 100);
      if (change > 0) {
        toast.success(`Reduced file size by ${change}% (${(output.size / 1024 / 1024).toFixed(2)} MB).`);
      } else {
        toast.warning("The encoded file is larger than the original. Lower the target bitrate and try again.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Compression failed.");
    } finally {
      if (activeRecorder?.state === "recording") activeRecorder.stop();
      cleanup();
      cancelAnimationFrame(animationFrame);
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
      if (audioContext && audioContext.state !== "closed") await audioContext.close();
      setLoading(false);
      setCompressionProgress(0);
    }
  };

  return (
    <ToolLayout
      title={tool.title}
      description={tool.desc}
      icon={<div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${colorClass}`}><Icon className="h-8 w-8" /></div>}
      toolCategory={tool.category === "video" ? "Video" : "Audio"}
    >
      {tool.title === "YouTube Thumbnail Downloader" ? (
        <div className="space-y-6">
          <div className="tool-card">
            <label htmlFor="youtube-url" className="text-sm font-medium">YouTube video URL</label>
            <input id="youtube-url" type="url" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..."
              className="w-full mt-2 px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:outline-none" />
          </div>
          <Button onClick={handleThumbnail} disabled={!youtubeUrl.trim()} variant="gradient">Get thumbnail</Button>
          {thumbnailUrl && (
            <div className="tool-card space-y-4">
              <img src={thumbnailUrl} onError={e => { e.currentTarget.src = thumbnailUrl.replace("maxresdefault", "hqdefault"); }} alt="YouTube video thumbnail" className="w-full max-w-2xl mx-auto rounded-lg" />
              <a href={thumbnailUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline"><Download className="h-4 w-4" /> Open or download image</a>
            </div>
          )}
          <p className="text-sm text-muted-foreground">Only publicly available thumbnails can be retrieved. Availability and image size depend on the video.</p>
        </div>
      ) : tool.title === "YouTube MP3 Downloader" ? (
        <div className="tool-card text-center py-12">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">Video & audio processing requires server-side FFmpeg. This feature will be available once the backend is set up.</p>
        </div>
      ) : toolId === "mp4-to-gif" ? (
        <div className="space-y-6">
          {!file ? <FileUpload accept={tool.accept} onFile={setFile} /> : <div className="tool-card flex items-center justify-between"><p className="text-sm font-medium">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p><Button variant="outline" size="sm" onClick={() => setFile(null)}>Change</Button></div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="tool-card space-y-2">
              <label htmlFor="gif-start" className="text-sm font-medium">Start at (seconds)</label>
              <input id="gif-start" type="number" min={0} step={0.5} value={gifStartSeconds} onChange={event => setGifStartSeconds(Math.max(0, Number(event.target.value) || 0))} className="w-full rounded-md border border-input bg-background px-3 py-2" />
            </div>
            <div className="tool-card space-y-2">
              <label htmlFor="gif-duration" className="text-sm font-medium">Clip length: {gifDuration} sec (max 15)</label>
              <input id="gif-duration" type="range" min={1} max={15} step={1} value={gifDuration} onChange={event => setGifDuration(Number(event.target.value))} className="w-full" />
            </div>
            <div className="tool-card space-y-2">
              <label htmlFor="gif-width" className="text-sm font-medium">GIF width: {gifWidth} px</label>
              <input id="gif-width" type="range" min={240} max={640} step={40} value={gifWidth} onChange={event => setGifWidth(Number(event.target.value))} className="w-full" />
            </div>
            <div className="tool-card space-y-2">
              <label htmlFor="gif-fps" className="text-sm font-medium">Frame rate: {gifFps} fps</label>
              <input id="gif-fps" type="range" min={5} max={15} step={1} value={gifFps} onChange={event => setGifFps(Number(event.target.value))} className="w-full" />
            </div>
          </div>
          <Button onClick={handleVideoToGif} disabled={!file || loading} variant="gradient">{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {gifStatus?.phase === "loading-engine" ? "Loading engine..." : gifStatus?.phase === "preparing-file" ? "Preparing video..." : `Creating GIF${gifStatus?.progress === undefined ? "..." : ` ${Math.round(gifStatus.progress * 100)}%`}`}</> : "Convert to GIF"}</Button>
          {loading && <progress value={(gifStatus?.progress ?? 0) * 100} max={100} className="h-2 w-full" aria-label="GIF conversion progress" />}
          <p className="text-sm text-muted-foreground">Creates a palette-optimized animated GIF locally in your browser. Choose a short clip; longer clips, higher width, and higher frame rate produce larger files. Videos over 100 MB are not supported.</p>
        </div>
      ) : toolId === "mp4-to-mp3" ? (
        <div className="space-y-6">
          {!file ? <FileUpload accept={tool.accept} onFile={setFile} /> : <div className="tool-card flex items-center justify-between"><p className="text-sm font-medium">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p><Button variant="outline" size="sm" onClick={() => setFile(null)}>Change</Button></div>}
          <Button onClick={handleMp4ToMp3} disabled={!file || loading} variant="gradient">{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {mp3Status?.phase === "loading-engine" ? "Loading engine..." : mp3Status?.phase === "preparing-file" ? "Preparing file..." : "Converting..."}</> : "Convert to MP3"}</Button>
          {loading && <p className="text-sm text-muted-foreground" aria-live="polite">{mp3Status?.phase === "loading-engine" ? "Downloading the conversion engine..." : mp3Status?.phase === "preparing-file" ? "Preparing your video for conversion..." : `Converting audio${mp3Status?.progress === undefined ? "..." : `: ${Math.round(mp3Status.progress * 100)}%`}`}</p>}
          <p className="text-sm text-muted-foreground">Uses browser-side FFmpeg to extract the audio track and save it as an MP3 file. Larger videos may take longer to transcode in the browser.</p>
        </div>
      ) : toolId === "video-to-audio" ? (
        <div className="space-y-6">
          {!file ? <FileUpload accept={tool.accept} onFile={setFile} /> : <div className="tool-card flex items-center justify-between"><p className="text-sm font-medium">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p><Button variant="outline" size="sm" onClick={() => setFile(null)}>Change</Button></div>}
          <Button onClick={handleVideoToAudio} disabled={!file || loading} variant="gradient">{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {mp3Status?.phase === "loading-engine" ? "Loading engine..." : mp3Status?.phase === "preparing-file" ? "Preparing video..." : `Extracting audio${mp3Status?.progress === undefined ? "..." : ` ${Math.round(mp3Status.progress * 100)}%`}`}</> : "Extract audio (MP3)"}</Button>
          {loading && <progress value={(mp3Status?.progress ?? 0) * 100} max={100} className="h-2 w-full" aria-label="Audio extraction progress" />}
          <p className="text-sm text-muted-foreground">Extracts and converts only the audio stream locally with FFmpeg; the video does not have to play through in real time. Output downloads as MP3.</p>
        </div>
      ) : toolId === "wav-to-mp3" ? (
        <div className="space-y-6">
          {!file ? <FileUpload accept={tool.accept} onFile={setFile} /> : <div className="tool-card flex items-center justify-between"><p className="text-sm font-medium">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p><Button variant="outline" size="sm" onClick={() => setFile(null)}>Change</Button></div>}
          <Button onClick={handleWavToMp3} disabled={!file || loading} variant="gradient">{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {mp3Status?.phase === "loading-engine" ? "Loading engine..." : mp3Status?.phase === "preparing-file" ? "Preparing WAV..." : `Converting${mp3Status?.progress === undefined ? "..." : ` ${Math.round(mp3Status.progress * 100)}%`}`}</> : "Convert to MP3"}</Button>
          {loading && <progress value={(mp3Status?.progress ?? 0) * 100} max={100} className="h-2 w-full" aria-label="WAV conversion progress" />}
          <p className="text-sm text-muted-foreground">Converts your WAV audio to a high-quality MP3 locally in your browser. The first conversion may take a moment while the audio engine starts.</p>
        </div>
      ) : toolId === "mp3-to-wav" ? (
        <div className="space-y-6">
          {!file ? <FileUpload accept={tool.accept} onFile={setFile} /> : <div className="tool-card flex items-center justify-between"><p className="text-sm font-medium">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p><Button variant="outline" size="sm" onClick={() => setFile(null)}>Change</Button></div>}
          <Button onClick={handleAudioToWav} disabled={!file || loading} variant="gradient">{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Converting...</> : "Convert to WAV"}</Button>
          <p className="text-sm text-muted-foreground">Runs locally using your browser's audio decoder. Browser codec support may vary.</p>
        </div>
      ) : toolId === "audio-compress" || toolId === "video-compress" ? (
        <div className="space-y-6">
          {!file ? <FileUpload accept={tool.accept} onFile={setFile} /> : <div className="tool-card flex items-center justify-between"><p className="text-sm font-medium">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p><Button variant="outline" size="sm" onClick={() => setFile(null)}>Change</Button></div>}
          <div className="tool-card">
            <label htmlFor="media-bitrate" className="font-semibold">Target bitrate: {toolId === "video-compress" ? videoBitrate : audioBitrate} kbps</label>
            <input id="media-bitrate" type="range" min={toolId === "video-compress" ? 150 : 32} max={toolId === "video-compress" ? 2000 : 192} step={toolId === "video-compress" ? 50 : 16} value={toolId === "video-compress" ? videoBitrate : audioBitrate} onChange={e => toolId === "video-compress" ? setVideoBitrate(Number(e.target.value)) : setAudioBitrate(Number(e.target.value))} className="w-full mt-3" />
            <p className="text-sm text-muted-foreground mt-2">{toolId === "video-compress" ? "Strong compression: output is capped at 720×405, 15 fps, with 32 kbps audio. Output is WebM. Video plays through in real time while encoding." : "Output is WebM using browser-supported Opus. Processing happens locally in real time."}</p>
          </div>
          <Button onClick={handleCompression} disabled={!file || loading} variant="gradient">{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Compressing {compressionProgress}%...</> : "Compress and download"}</Button>
          {loading && <progress value={compressionProgress} max={100} className="h-2 w-full" aria-label="Compression progress" />}
        </div>
      ) : (
        <div className="tool-card text-center py-12">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">Video & audio processing requires server-side FFmpeg. This feature will be available once the backend is set up.</p>
        </div>
      )}
    </ToolLayout>
  );
};

export default VideoAudioTools;
