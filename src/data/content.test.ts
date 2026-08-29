import { describe, expect, it } from "vitest";
import { places } from "./places";
import { questions } from "./questions";
import { sourceById } from "./sources";

describe("historical content integrity", () => {
  it("ships the 30-question vertical slice", () => {
    expect(questions).toHaveLength(30);
    expect(questions.filter((question) => question.difficulty === "beginner")).toHaveLength(10);
    expect(questions.filter((question) => question.difficulty === "intermediate")).toHaveLength(10);
    expect(questions.filter((question) => question.difficulty === "advanced")).toHaveLength(10);
  });

  it("states the 1879 administrative transition precisely", () => {
    expect(questions[0].prompt).toContain("琉球藩に代わって");
    expect(questions[0].explanation).toContain("1872年に琉球王国を琉球藩とし");
  });

  it("keeps every answer and reference resolvable", () => {
    const placeIds = new Set(places.map((place) => place.id));
    for (const question of questions) {
      expect(question.choices).toHaveLength(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(question.choices.length);
      question.sourceIds.forEach((sourceId) => expect(sourceById[sourceId]).toBeDefined());
      question.relatedPlaceIds.forEach((placeId) => expect(placeIds.has(placeId)).toBe(true));
    }
  });

  it("includes all nine World Heritage component properties", () => {
    expect(places.filter((place) => place.category === "heritage")).toHaveLength(9);
  });

  it("keeps every map source resolvable", () => {
    for (const place of places) {
      place.sourceIds.forEach((sourceId) => expect(sourceById[sourceId]).toBeDefined());
    }
  });
});

