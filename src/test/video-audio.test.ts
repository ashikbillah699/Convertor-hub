import { describe, expect, it } from "vitest";
import { getMp3OutputName } from "@/lib/videoAudio";
import { getVideoCompressionSettings, normalizeVideoToGifSettings } from "@/lib/mediaCompression";

describe("video audio helpers", () => {
  it("creates an mp3 filename from a video file name", () => {
    expect(getMp3OutputName("sample.mp4")).toBe("sample.mp3");
    expect(getMp3OutputName("movie.MOV")).toBe("movie.mp3");
    expect(getMp3OutputName("recording.wav")).toBe("recording.mp3");
  });

  it("caps video output at 720x405 and targets a low bitrate", () => {
    expect(getVideoCompressionSettings(1920, 1080, 300)).toEqual({
      width: 720,
      height: 405,
      frameRate: 15,
      videoBitsPerSecond: 300_000,
      audioBitsPerSecond: 32_000,
    });
  });

  it("does not upscale small source videos", () => {
    expect(getVideoCompressionSettings(640, 360, 250).width).toBe(640);
    expect(getVideoCompressionSettings(640, 360, 250).height).toBe(360);
  });

  it("bounds GIF duration, width, and frame rate", () => {
    expect(normalizeVideoToGifSettings({ startSeconds: -2, durationSeconds: 30, width: 900, fps: 30 })).toEqual({
      startSeconds: 0,
      durationSeconds: 15,
      width: 640,
      fps: 15,
    });
  });
});
