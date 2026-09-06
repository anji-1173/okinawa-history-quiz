import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { questionsFor } from "../data/questions";
import { readResults, saveResult } from "../lib/progress";
import type { Difficulty } from "../types";
import QuizExperience from "./QuizExperience";

const showQuiz = (difficulty: Difficulty = "beginner") => {
  const onComplete = vi.fn();
  render(<QuizExperience difficulty={difficulty} onExit={vi.fn()} onOpenMap={vi.fn()} onComplete={onComplete} />);
  return onComplete;
};
const goTo = (index: number) => fireEvent.change(screen.getByRole("combobox", { name: "参加する問題" }), { target: { value: String(index) } });
const answer = (choiceIndex: number) => fireEvent.click(within(screen.getByRole("group", { name: "選択肢" })).getAllByRole("button")[choiceIndex]);

beforeEach(() => {
  window.localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("joining a quiz partway through", () => {
  it.each<Difficulty>(["beginner", "intermediate", "advanced"])("opens question five directly in %s", (difficulty) => {
    showQuiz(difficulty);
    goTo(4);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(questionsFor("prefecture-war", difficulty)[4].prompt);
    expect(screen.getByRole("status").textContent).toBe("0 / 10問 回答済み");
  });

  it("preserves answers when revisiting and does not score the same question twice", () => {
    showQuiz();
    const questions = questionsFor("prefecture-war", "beginner");
    goTo(4);
    answer(questions[4].correctIndex);
    goTo(5);
    goTo(4);
    expect(within(screen.getByRole("group", { name: "選択肢" })).getAllByRole("button").every((button) => button.hasAttribute("disabled"))).toBe(true);
    expect(screen.getByText(questions[4].explanation)).toBeDefined();
    expect(screen.getByRole("status").textContent).toBe("1 / 10問 回答済み");
    goTo(9);
    answer((questions[9].correctIndex + 1) % 4);
    fireEvent.click(screen.getByRole("button", { name: "結果を見る" }));
    expect(screen.getByLabelText("2問中1問正解")).toBeDefined();
  });

  it("counts only attempted questions and leaves existing course records intact", () => {
    saveResult({ difficulty: "beginner", score: 7, completedAt: "2026-08-29" });
    const onComplete = showQuiz();
    goTo(9);
    answer(questionsFor("prefecture-war", "beginner")[9].correctIndex);
    fireEvent.click(screen.getByRole("button", { name: "結果を見る" }));
    expect(screen.getByLabelText("1問中1問正解")).toBeDefined();
    expect(screen.getByText("今回は1問に回答しました。未回答の9問は採点に含めていません。")).toBeDefined();
    expect(onComplete).not.toHaveBeenCalled();
    expect(readResults().beginner?.score).toBe(7);
    fireEvent.click(screen.getByRole("button", { name: "未回答の問題を続ける" }));
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("0");
    expect(screen.getByRole("status").textContent).toBe("1 / 10問 回答済み");
  });

  it("records a full course once all questions have been answered out of order", () => {
    const onComplete = showQuiz();
    const questions = questionsFor("prefecture-war", "beginner");
    for (const index of [9, 4, 0, 1, 2, 3, 5, 6, 7, 8]) {
      goTo(index);
      answer(questions[index].correctIndex);
    }
    fireEvent.click(screen.getByRole("button", { name: "結果を見る" }));
    expect(screen.getByLabelText("10問中10問正解")).toBeDefined();
    expect(readResults().beginner?.score).toBe(10);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("starts a new attempt with no answers after restarting a partial result", () => {
    showQuiz();
    goTo(9);
    answer(0);
    fireEvent.click(screen.getByRole("button", { name: "結果を見る" }));
    fireEvent.click(screen.getByRole("button", { name: "もう一度挑戦する" }));
    expect(screen.getByRole("status").textContent).toBe("0 / 10問 回答済み");
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("0");
  });
});
