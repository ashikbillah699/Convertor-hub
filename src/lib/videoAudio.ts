import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import classWorkerURL from "@ffmpeg/ffmpeg/worker?url";
import coreURL from "@ffmpeg/core?url";
import wasmURL from "@ffmpeg/core/wasm?url";
import { normalizeVideoToGifSettings, type VideoToGifSettings } from "@/lib/mediaCompression";

export type Mp3ConversionStatus = {
  phase: "loading-engine" | "preparing-file" | "converting";
  progress?: number;
};

export const getMp3OutputName = (fileName: string) => {
  const cleanName = fileName.replace(/\.[^.]+$/, "") || "audio";
  return `${cleanName}.mp3`;
};

let ffmpegInstance: FFmpeg | null = null;
let engineLoad: Promise<void> | null = null;

const getFfmpeg = async (onStatus?: (status: Mp3ConversionStatus) => void) => {
  if (!ffmpegInstance) ffmpegInstance = new FFmpeg();
  if (!ffmpegInstance.loaded) {
    if (!engineLoad) {
      let timeoutId: number | undefined;
      engineLoad = Promise.race([
        ffmpegInstance.load({ classWorkerURL, coreURL, wasmURL }).then(() => undefined),
        new Promise<never>((_, reject) => {
          timeoutId = window.setTimeout(
            () => reject(new Error("FFmpeg worker did not start. Restart the dev server and try again.")),
            45000,
          );
        }),
      ]).catch((error: unknown) => {
        ffmpegInstance?.terminate();
        ffmpegInstance = null;
        throw error;
      }).finally(() => {
        if (timeoutId !== undefined) window.clearTimeout(timeoutId);
        engineLoad = null;
      });
    }
    onStatus?.({ phase: "loading-engine" });
    await engineLoad;
  }
  return ffmpegInstance;
};

const cleanupFfmpegFiles = async (ffmpeg: FFmpeg, fileNames: string[]) => {
  const results = await Promise.allSettled(fileNames.map(fileName => ffmpeg.deleteFile(fileName)));
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.warn(`Could not remove temporary FFmpeg file "${fileNames[index]}".`, result.reason);
    }
  });
};

export const convertMediaToMp3 = async (
  file: File,
  onStatus?: (status: Mp3ConversionStatus) => void,
): Promise<Blob> => {
  const ffmpeg = await getFfmpeg(onStatus);
  let ffmpegError = "";
  const onProgress = ({ progress }: { progress: number }) => {
    onStatus?.({ phase: "converting", progress: Math.max(0, Math.min(1, progress)) });
  };
  const onLog = ({ message }: { message: string }) => {
    if (/error|invalid|unsupported|failed/i.test(message)) ffmpegError = message.trim();
  };

  ffmpeg.on("progress", onProgress);
  ffmpeg.on("log", onLog);
  try {
    onStatus?.({ phase: "preparing-file" });
    const extension = file.name.match(/\.[a-z0-9]+$/i)?.[0] || ".media";
    const inputName = `input${extension}`;
    const outputName = "output.mp3";

    await ffmpeg.writeFile(inputName, await fetchFile(file));
    const exitCode = await ffmpeg.exec([
      "-v",
      "error",
      "-i",
      inputName,
      "-vn",
      "-acodec",
      "libmp3lame",
      "-threads",
      "0",
      "-q:a",
      "2",
      outputName,
    ]);
    if (exitCode !== 0) {
      throw new Error(ffmpegError || "Could not decode this video or extract its audio track.");
    }

    const data = await ffmpeg.readFile(outputName, "binary");
    if (!(data instanceof Uint8Array)) throw new Error("FFmpeg returned audio data in an unexpected text format.");
    return new Blob([Uint8Array.from(data).buffer], { type: "audio/mpeg" });
  } finally {
    ffmpeg.off("progress", onProgress);
    ffmpeg.off("log", onLog);
  }
};

export const compressAudioWithFfmpeg = async (
  file: File,
  bitrateKbps: number,
  onStatus?: (status: Mp3ConversionStatus) => void,
): Promise<Blob> => {
  const ffmpeg = await getFfmpeg(onStatus);
  const extension = file.name.match(/\.[a-z0-9]+$/i)?.[0] || ".audio";
  const inputName = `audio-input${extension}`;
  const outputName = "audio-compressed.webm";
  let ffmpegError = "";
  const onProgress = ({ progress }: { progress: number }) => {
    onStatus?.({ phase: "converting", progress: Math.max(0, Math.min(1, progress)) });
  };
  const onLog = ({ message }: { message: string }) => {
    if (/error|invalid|unsupported|failed/i.test(message)) ffmpegError = message.trim();
  };

  ffmpeg.on("progress", onProgress);
  ffmpeg.on("log", onLog);
  try {
    onStatus?.({ phase: "preparing-file" });
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    const exitCode = await ffmpeg.exec([
      "-v", "error",
      "-i", inputName,
      "-vn",
      "-c:a", "libopus",
      "-b:a", `${bitrateKbps}k`,
      "-compression_level", "3",
      "-application", "audio",
      "-f", "webm",
      outputName,
    ]);
    if (exitCode !== 0) throw new Error(ffmpegError || "Could not compress this audio file.");

    const data = await ffmpeg.readFile(outputName, "binary");
    if (!(data instanceof Uint8Array)) throw new Error("FFmpeg returned audio data in an unexpected text format.");
    const bytes = Uint8Array.from(data);
    if (!bytes.length) throw new Error("The compressed audio file is empty.");
    onStatus?.({ phase: "converting", progress: 1 });
    return new Blob([bytes], { type: "audio/webm;codecs=opus" });
  } finally {
    ffmpeg.off("progress", onProgress);
    ffmpeg.off("log", onLog);
    await cleanupFfmpegFiles(ffmpeg, [inputName, outputName]);
  }
};

export const convertVideoToGif = async (
  file: File,
  options: VideoToGifSettings,
  onStatus?: (status: Mp3ConversionStatus) => void,
): Promise<Blob> => {
  if (file.size > 100 * 1024 * 1024) {
    throw new Error("This video is over 100 MB. Choose a smaller video for GIF conversion.");
  }

  const settings = normalizeVideoToGifSettings(options);
  const ffmpeg = await getFfmpeg(onStatus);
  const inputName = "video-to-gif-input";
  const outputName = "video-to-gif-output.gif";
  let ffmpegError = "";
  const onProgress = ({ progress }: { progress: number }) => {
    onStatus?.({ phase: "converting", progress: Math.max(0, Math.min(1, progress)) });
  };
  const onLog = ({ message }: { message: string }) => {
    if (/error|invalid|unsupported|failed/i.test(message)) ffmpegError = message.trim();
  };

  ffmpeg.on("progress", onProgress);
  ffmpeg.on("log", onLog);
  try {
    onStatus?.({ phase: "preparing-file" });
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    const filter = `[0:v]fps=${settings.fps},scale=${settings.width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=3[out]`;
    const exitCode = await ffmpeg.exec([
      "-v", "error",
      "-ss", String(settings.startSeconds),
      "-i", inputName,
      "-t", String(settings.durationSeconds),
      "-filter_complex", filter,
      "-map", "[out]",
      "-loop", "0",
      outputName,
    ]);
    if (exitCode !== 0) {
      throw new Error(ffmpegError || "Could not decode this video to make a GIF.");
    }

    const data = await ffmpeg.readFile(outputName, "binary");
    if (!(data instanceof Uint8Array)) throw new Error("FFmpeg returned GIF data in an unexpected text format.");
    const bytes = Uint8Array.from(data);
    if (!bytes.length) throw new Error("No GIF frames were created. Check the selected start time.");
    onStatus?.({ phase: "converting", progress: 1 });
    return new Blob([bytes], { type: "image/gif" });
  } finally {
    ffmpeg.off("progress", onProgress);
    ffmpeg.off("log", onLog);
    await cleanupFfmpegFiles(ffmpeg, [inputName, outputName]);
  }
};
