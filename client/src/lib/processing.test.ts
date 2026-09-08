import { describe, expect, it } from "vitest";
import { CANCELLATION_ERROR, isCancellationError } from "./processing";

describe("processing cancellation", () => {
  it("recognizes the intentional cancellation sentinel", () => {
    expect(isCancellationError(new Error(CANCELLATION_ERROR))).toBe(true);
    expect(isCancellationError(new Error("network failure"))).toBe(false);
  });

  it("does not classify non-errors as cancellation", () => {
    expect(isCancellationError(null)).toBe(false);
    expect(isCancellationError("__CANCELLED__")).toBe(false);
  });
});
