export type Difficulty = "beginner" | "intermediate" | "advanced";

export type EraStatus = "available" | "planned";

export interface Era {
  id: string;
  number: number;
  title: string;
  years: string;
  summary: string;
  accent: string;
  status: EraStatus;
}

export interface Source {
  id: string;
  title: string;
  organization: string;
  url: string;
  checkedAt: string;
}

export interface Question {
  id: string;
  eraId: string;
  difficulty: Difficulty;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  sourceIds: string[];
  relatedPlaceIds: string[];
  theme: string;
  sensitive?: boolean;
}

export type PlaceCategory = "heritage" | "war-site" | "memorial" | "route" | "museum";

export interface Place {
  id: string;
  name: string;
  reading?: string;
  category: PlaceCategory;
  location: string;
  coordinates: [number, number];
  summary: string;
  accessStatus: string;
  sourceIds: string[];
  relatedQuestionIds?: string[];
  scope: "okinawa" | "journey";
}

export interface QuizResult {
  difficulty: Difficulty;
  score: number;
  completedAt: string;
}
