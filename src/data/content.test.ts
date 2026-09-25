import { describe, expect, it } from "vitest";
import { eras } from "./eras";
import { places } from "./places";
import { questions } from "./questions";
import { sourceById } from "./sources";

describe("historical content integrity", () => {
  const availableEras = eras.filter((era) => era.status === "available");

  it("completes all eight eras with 240 distinct, sourced questions", () => {
    expect(availableEras).toHaveLength(8);
    expect(questions).toHaveLength(240);
    const duplicates = questions.filter((q, index) => questions.findIndex(other => other.prompt === q.prompt) !== index).map(q => ({ id: q.id, prompt: q.prompt }));
    expect(duplicates).toEqual([]);
    for (const era of eras) {
      for (const level of ["beginner", "intermediate", "advanced"]) {
        expect(questions.filter(q => q.eraId === era.id && q.difficulty === level)).toHaveLength(10);
      }
    }
    for (const question of questions) {
      expect(new Set(question.choices).size).toBe(4);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.explanation.trim().length).toBeGreaterThan(0);
    }
  });

  it("publishes complete ten-question courses while allowing staged era releases", () => {
    for (const era of availableEras) {
      const eraQuestions = questions.filter((question) => question.eraId === era.id);
      expect(eraQuestions.length).toBeGreaterThanOrEqual(10);
      expect(eraQuestions.filter((question) => question.difficulty === "beginner")).toHaveLength(10);
      for (const difficulty of ["intermediate", "advanced"]) {
        expect([0, 10]).toContain(eraQuestions.filter((question) => question.difficulty === difficulty).length);
      }
    }
    expect(questions.filter(q => q.eraId === "satsuma-era")).toHaveLength(30);
    expect(new Set(questions.map(q => q.id)).size).toBe(questions.length);
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
