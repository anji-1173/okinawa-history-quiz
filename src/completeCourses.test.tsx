import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import { eras, difficultyMeta } from "./data/eras";
import { questionsFor } from "./data/questions";
import { courseKey, readResults } from "./lib/progress";
import type { Difficulty } from "./types";

vi.mock("./lib/soundFeedback", () => ({ playFeedbackSound: vi.fn() }));
beforeEach(() => {
  window.localStorage.clear();
  window.location.hash = "#journey";
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(() => { cleanup(); window.location.hash = ""; vi.restoreAllMocks(); });

const courses = eras.flatMap(era => (["beginner", "intermediate", "advanced"] as Difficulty[]).map(level => ({ era, level })));

it.each(courses)("completes $era.id / $level from the era picker", ({ era, level }) => {
  render(<App />);
  const card = screen.getByRole("heading", { name: era.title }).closest("article")!;
  fireEvent.click(within(card).getByRole("button"));
  fireEvent.click(screen.getByRole("button", { name: new RegExp(difficultyMeta[level].label) }));
  const questions = questionsFor(era.id, level);
  expect(questions).toHaveLength(10);
  // Start partway through and visit every question, including after shuffling choices.
  for (const index of [4, 9, 0, 1, 2, 3, 5, 6, 7, 8]) {
    fireEvent.change(screen.getByRole("combobox", { name: "参加する問題" }), { target: { value: String(index) } });
    const question = questions[index];
    fireEvent.click(screen.getByRole("button", { name: question.choices[question.correctIndex] }));
    expect(screen.getByLabelText("正解")).toBeTruthy();
  }
  fireEvent.click(screen.getByRole("button", { name: "結果を見る" }));
  expect(screen.getByLabelText("10問中10問正解")).toBeTruthy();
  expect(readResults()[courseKey(era.id, level)].score).toBe(10);
  expect(screen.getByRole("button", { name: "1 / 24 コース" })).toBeTruthy();
}, 15000);
