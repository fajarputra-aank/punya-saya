import { describe, expect, it } from "vitest";
import { estimateProcessingSeconds, estimateRemainingSeconds, formatEta } from "./eta";

describe("audio processing ETA", () => {
  it("uses a minimum estimate for tiny or unknown files", () => {
    expect(estimateProcessingSeconds(0, 0)).toBe(22);
    expect(estimateProcessingSeconds(Number.NaN, Number.NaN)).toBe(22);
  });

  it("increases with both audio duration and file size", () => {
    const short = estimateProcessingSeconds(30, 1 * 1024 * 1024);
    const long = estimateProcessingSeconds(1800, 80 * 1024 * 1024);
    expect(long).toBeGreaterThan(short);
  });

  it("weights remaining work differently by active pipeline stage", () => {
    const total = estimateProcessingSeconds(600, 20 * 1024 * 1024);
    const uploadRemaining = estimateRemainingSeconds(total, "uploading", 20);
    const transcribeRemaining = estimateRemainingSeconds(total, "transcribing", 70);
    const analysisRemaining = estimateRemainingSeconds(total, "analyzing", 90);
    expect(uploadRemaining).toBeGreaterThan(transcribeRemaining);
    expect(transcribeRemaining).toBeGreaterThan(analysisRemaining);
    expect(estimateRemainingSeconds(total, "done", 100)).toBe(0);
  });

  it("formats seconds and minutes for user-facing copy", () => {
    expect(formatEta(12)).toBe("12 detik");
    expect(formatEta(60)).toBe("1 m");
    expect(formatEta(125)).toBe("2 m 5 d");
  });
});
