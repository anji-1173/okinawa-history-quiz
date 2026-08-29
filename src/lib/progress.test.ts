import { beforeEach, describe, expect, it } from "vitest";
import { readResults, resultLabel, saveResult } from "./progress";

describe("quiz progress", () => {
  beforeEach(() => window.localStorage.clear());

  it("keeps the best score for each difficulty", () => {
    saveResult({ difficulty: "beginner", score: 8, completedAt: "2026-08-29" });
    saveResult({ difficulty: "beginner", score: 5, completedAt: "2026-08-30" });

    expect(readResults().beginner?.score).toBe(8);
  });

  it("returns an encouraging label", () => {
    expect(resultLabel(10)).toContain("すべて");
    expect(resultLabel(7)).toContain("あと少し");
  });
});
