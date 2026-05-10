import { describe, expect, it } from "vitest";
import { getInitials } from "./utils";

describe("getInitials", () => {
  it("returns fallback for empty and whitespace names", () => {
    expect(getInitials("")).toBe("U");
    expect(getInitials("   ")).toBe("U");
  });

  it("handles single and multi-word names", () => {
    expect(getInitials("Akbar")).toBe("A");
    expect(getInitials("Akbar Syahwana")).toBe("AS");
  });
});
