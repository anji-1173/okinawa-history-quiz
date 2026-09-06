import { describe, expect, it } from "vitest";
import { eras } from "./eras";
import { places } from "./places";
import { questions } from "./questions";
import { sourceById } from "./sources";

describe("historical content integrity", () => {
  const availableEras = eras.filter((era) => era.status === "available");

  it("ships a full 30-question set (10/10/10) for every available era", () => {
    for (const era of availableEras) {
      const eraQuestions = questions.filter((question) => question.eraId === era.id);
      expect(eraQuestions).toHaveLength(30);
      expect(eraQuestions.filter((question) => question.difficulty === "beginner")).toHaveLength(10);
      expect(eraQuestions.filter((question) => question.difficulty === "intermediate")).toHaveLength(10);
      expect(eraQuestions.filter((question) => question.difficulty === "advanced")).toHaveLength(10);
    }
    expect(questions).toHaveLength(availableEras.length * 30);
  });

  it("only ships questions for eras marked available", () => {
    const availableIds = new Set(availableEras.map((era) => era.id));
    for (const question of questions) {
      expect(availableIds.has(question.eraId)).toBe(true);
    }
  });

  it("states the 1879 administrative transition precisely", () => {
    const transition = questions.find((question) => question.id === "war-b01");
    expect(transition).toBeDefined();
    expect(transition?.prompt).toContain("琉球藩に代わって");
    expect(transition?.explanation).toContain("1872年に琉球王国を琉球藩とし");
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
