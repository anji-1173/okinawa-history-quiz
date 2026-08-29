import type { Difficulty, QuizResult } from "../types";

const STORAGE_KEY = "okinawa-history-quiz:results:v1";

export const readResults = (): Partial<Record<Difficulty, QuizResult>> => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<
      Record<Difficulty, QuizResult>
    >;
  } catch {
    return {};
  }
};

export const saveResult = (result: QuizResult) => {
  const current = readResults();
  const previous = current[result.difficulty];
  const next = !previous || result.score >= previous.score ? result : previous;
  const updated = { ...current, [result.difficulty]: next };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const resultLabel = (score: number) => {
  if (score === 10) return "すべての問いを丁寧に読み解きました";
  if (score >= 8) return "時代のつながりがよく見えています";
  if (score >= 6) return "あと少し。解説と地図で確かめましょう";
  return "ここからが学びの始まりです";
};
