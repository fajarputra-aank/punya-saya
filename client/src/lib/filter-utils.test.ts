import { describe, expect, it } from "vitest";
import { getFilterEmptyMessage } from "./filter-utils";

describe("getFilterEmptyMessage", () => {
  it("menjelaskan workspace rapat yang belum memiliki data", () => {
    expect(getFilterEmptyMessage("meeting", 0, 0)).toContain("Belum ada rapat");
  });

  it("menjelaskan ketika filter rapat tidak menemukan hasil", () => {
    expect(getFilterEmptyMessage("meeting", 4, 0)).toMatch(/Tidak ada rapat/);
  });

  it("mengembalikan null ketika masih ada hasil yang terlihat", () => {
    expect(getFilterEmptyMessage("action", 4, 2)).toBeNull();
  });
});
