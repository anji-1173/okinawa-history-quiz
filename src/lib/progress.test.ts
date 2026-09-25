import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readResults, resultLabel, saveResult } from "./progress";

describe("quiz progress", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("keeps the best score for each difficulty", () => {
    saveResult({ eraId: "prefecture-war", difficulty: "beginner", score: 8, completedAt: "2026-08-29" });
    saveResult({ eraId: "prefecture-war", difficulty: "beginner", score: 5, completedAt: "2026-08-30" });

    expect(readResults()["prefecture-war:beginner"]?.score).toBe(8);
  });

  it("keeps scores separate between eras", () => {
    saveResult({ eraId: "prefecture-war", difficulty: "beginner", score: 10, completedAt: "2026-09-25" });
    saveResult({ eraId: "reversion", difficulty: "beginner", score: 3, completedAt: "2026-09-25" });
    expect(readResults()["prefecture-war:beginner"].score).toBe(10);
    expect(readResults()["reversion:beginner"].score).toBe(3);
    expect(Object.keys(readResults())).toHaveLength(2);
  });

  it("preserves legacy data without assigning it to an unknown era", () => {
    const legacy = JSON.stringify({ beginner: { difficulty: "beginner", score: 9, completedAt: "2026-08-29" } });
    window.localStorage.setItem("okinawa-history-quiz:results:v1", legacy);
    expect(readResults()).toEqual({});
    saveResult({ eraId: "reversion", difficulty: "beginner", score: 5, completedAt: "2026-09-25" });
    expect(window.localStorage.getItem("okinawa-history-quiz:results:v1")).toBe(legacy);
  });

  it.each(["null", "[]", "{", '{"bogus":{"eraId":"unknown","difficulty":"beginner","score":99}}'])("ignores invalid stored data: %s", value => {
    window.localStorage.setItem("okinawa-history-quiz:results:v2", value);
    expect(readResults()).toEqual({});
  });

  it("returns a result even if persistence is blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    const result = saveResult({ eraId: "reversion", difficulty: "beginner", score: 6, completedAt: "2026-09-25" });
    expect(result["reversion:beginner"].score).toBe(6);
  });

  it("returns an encouraging label", () => {
    expect(resultLabel(10)).toContain("すべて");
    expect(resultLabel(7)).toContain("あと少し");
  });
});
