import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("feature router contracts", () => {
  it("exposes the core notulen workspace routers", () => {
    const record = appRouter._def.record as Record<string, unknown>;
    expect(record.meetings).toBeDefined();
    expect(record.actionItems).toBeDefined();
    expect(record.audio).toBeDefined();
    expect(record.transcription).toBeDefined();
    expect(record.ai).toBeDefined();
    expect(record.processing).toBeDefined();
  });
});
