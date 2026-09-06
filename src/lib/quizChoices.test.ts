import { describe, expect, it } from "vitest";
import { questionsFor } from "../data/questions";
import { shuffleQuestionChoices } from "./quizChoices";

describe("quiz choice shuffling", () => {
  it("preserves each correct answer while distributing answer positions", () => {
    const questions = questionsFor("prefecture-war", "advanced");
    const shuffled = shuffleQuestionChoices(questions, () => 0.37);
    const positionCounts = [0, 0, 0, 0];

    shuffled.forEach((question, index) => {
      const original = questions[index];
      expect(question.choices[question.correctIndex]).toBe(original.choices[original.correctIndex]);
      expect(new Set(question.choices).size).toBe(4);
      positionCounts[question.correctIndex] += 1;
    });

    expect(positionCounts).toEqual([3, 3, 2, 2]);
  });
});
