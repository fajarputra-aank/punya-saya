export type ProcessingStage = "idle" | "uploading" | "transcribing" | "analyzing" | "done" | "cancelled";
type ActiveProcessingStage = Exclude<ProcessingStage, "idle" | "done" | "cancelled">;

export function estimateProcessingSeconds(durationSeconds: number, sizeBytes: number) {
  const safeDuration = Number.isFinite(durationSeconds) ? Math.max(0, durationSeconds) : 0;
  const safeSizeMb = Number.isFinite(sizeBytes) ? Math.max(0, sizeBytes) / 1024 / 1024 : 0;
  return Math.max(12, Math.round(22 + safeDuration * 0.3 + safeSizeMb * 2.2));
}

export function estimateRemainingSeconds(totalSeconds: number, stage: ProcessingStage, progress: number, elapsedSeconds = 0) {
  if (stage === "done" || stage === "cancelled") return 0;
  if (stage === "idle") return Math.max(0, Math.round(totalSeconds));

  const weights: Record<ActiveProcessingStage, number> = { uploading: 0.2, transcribing: 0.45, analyzing: 0.35 };
  const bounds: Record<ActiveProcessingStage, [number, number]> = { uploading: [12, 62], transcribing: [62, 80], analyzing: [80, 100] };
  const order: ActiveProcessingStage[] = ["uploading", "transcribing", "analyzing"];
  const activeStage = stage as ActiveProcessingStage;
  const activeWeight = weights[activeStage];
  const [start, end] = bounds[activeStage];
  const stageProgress = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  const laterWeight = order.slice(order.indexOf(activeStage) + 1).reduce((sum, name) => sum + weights[name], 0);
  const stageBasedRemaining = totalSeconds * (activeWeight * (1 - stageProgress) + laterWeight);
  return Math.max(0, Math.round(stageBasedRemaining - Math.max(0, elapsedSeconds)));
}

export function formatEta(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds));
  if (safeSeconds < 60) return `${Math.max(1, safeSeconds)} detik`;
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes} m${remainder ? ` ${remainder} d` : ""}`;
}
