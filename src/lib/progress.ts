import { eras } from "../data/eras";
import type { Difficulty, QuizResult, QuizResults } from "../types";

const STORAGE_KEY = "okinawa-history-quiz:results:v2";
const LEGACY_KEY = "okinawa-history-quiz:results:v1";
export const courseKey = (eraId: string, difficulty: Difficulty) => `${eraId}:${difficulty}`;

export const hasLegacyResults = () => {
  try { return Boolean(window.localStorage.getItem(LEGACY_KEY)); } catch { return false; }
};

export const readResults = (): QuizResults => {
  if (typeof window === "undefined") return {};
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const valid: QuizResults = {};
    for (const [key, entry] of Object.entries(value)) {
      if (!entry || typeof entry !== "object") continue;
      const item = entry as QuizResult;
      if (!eras.some(era => era.id === item.eraId) || !["beginner", "intermediate", "advanced"].includes(item.difficulty)) continue;
      if (!Number.isInteger(item.score) || item.score < 0 || item.score > 10 || typeof item.completedAt !== "string") continue;
      if (key === courseKey(item.eraId, item.difficulty)) valid[key] = item;
    }
    return valid;
  } catch { return {}; }
};

export const saveResult = (result: QuizResult): QuizResults => {
  const current = readResults();
  const key = courseKey(result.eraId, result.difficulty);
  const previous = current[key];
  const next = !previous || result.score >= previous.score ? result : previous;
  const updated = { ...current, [key]: next };
  // v1 has no era IDs. Keep it intact rather than assigning scores to an unknown era.
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* Keep the result usable when storage is unavailable. */ }
  return updated;
};

export const resultLabel = (score: number) => {
  if (score === 10) return "すべての問いを丁寧に読み解きました";
  if (score >= 8) return "時代のつながりがよく見えています";
  if (score >= 6) return "あと少し。解説と地図で確かめましょう";
  return "ここからが学びの始まりです";
};
