export const getVideoCompressionSettings = (
  sourceWidth: number,
  sourceHeight: number,
  targetBitrateKbps: number,
) => {
  const scale = Math.min(1, 720 / sourceWidth, 405 / sourceHeight);

  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale)),
    frameRate: 15,
    videoBitsPerSecond: Math.max(150, Math.min(2000, targetBitrateKbps)) * 1000,
    audioBitsPerSecond: 32_000,
  };
};

export type VideoToGifSettings = {
  startSeconds: number;
  durationSeconds: number;
  width: number;
  fps: number;
};

export const normalizeVideoToGifSettings = (settings: VideoToGifSettings): VideoToGifSettings => ({
  startSeconds: Math.max(0, Number.isFinite(settings.startSeconds) ? settings.startSeconds : 0),
  durationSeconds: Math.max(1, Math.min(15, Number.isFinite(settings.durationSeconds) ? settings.durationSeconds : 5)),
  width: Math.max(240, Math.min(640, Math.round(Number.isFinite(settings.width) ? settings.width : 480))),
  fps: Math.max(5, Math.min(15, Math.round(Number.isFinite(settings.fps) ? settings.fps : 10))),
});