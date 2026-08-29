import type { Difficulty, Era } from "../types";

export const eras: Era[] = [
  {
    id: "kingdom-trade",
    number: 1,
    title: "琉球王国の成立と交易",
    years: "1429–1609",
    summary: "王国統一、首里と港、東アジア・東南アジアとの交流をたどります。",
    accent: "#d38a43",
    status: "planned",
  },
  {
    id: "satsuma-era",
    number: 2,
    title: "薩摩侵攻後の王国",
    years: "1609–1879",
    summary: "薩摩と中国の間で続いた王国の制度、外交、文化を考えます。",
    accent: "#a85e45",
    status: "planned",
  },
  {
    id: "prefecture-war",
    number: 3,
    title: "沖縄県の成立から沖縄戦",
    years: "1879–1945",
    summary: "近代化、学童疎開、戦時行政、沖縄戦を複数の資料から学びます。",
    accent: "#a3463b",
    status: "available",
  },
  {
    id: "postwar-restart",
    number: 4,
    title: "戦後の再出発",
    years: "1945–1952",
    summary: "収容から生活再建へ。住民組織と統治の始まりを見つめます。",
    accent: "#7a7b55",
    status: "planned",
  },
  {
    id: "us-administration",
    number: 5,
    title: "米国統治と琉球政府",
    years: "1952–1972",
    summary: "琉球政府、ドル経済、基地問題、復帰運動の歩みを学びます。",
    accent: "#447b7b",
    status: "planned",
  },
  {
    id: "reversion",
    number: 6,
    title: "日本復帰と制度転換",
    years: "1972–1975",
    summary: "1972年5月15日。変わった制度と残った課題を整理します。",
    accent: "#35768a",
    status: "planned",
  },
  {
    id: "expo-tourism",
    number: 7,
    title: "海洋博と観光・振興",
    years: "1975–1999",
    summary: "海洋博を軸に、交通、観光、地域づくりの変化をたどります。",
    accent: "#2d718c",
    status: "planned",
  },
  {
    id: "summit-present",
    number: 8,
    title: "サミットから現代へ",
    years: "2000–現在",
    summary: "国際交流、世界遺産、文化継承と現代の課題を考えます。",
    accent: "#345b78",
    status: "planned",
  },
];

export const difficultyMeta: Record<
  Difficulty,
  { label: string; shortLabel: string; description: string; focus: string; color: string }
> = {
  beginner: {
    label: "初級編",
    shortLabel: "初級",
    description: "人物・年代・場所を押さえる10問",
    focus: "まず全体像をつかむ",
    color: "#2f7a68",
  },
  intermediate: {
    label: "中級編",
    shortLabel: "中級",
    description: "背景と因果関係を考える10問",
    focus: "出来事のつながりを読む",
    color: "#b27431",
  },
  advanced: {
    label: "上級編",
    shortLabel: "上級",
    description: "二つの資料を比較する10問",
    focus: "事実と見方を分ける",
    color: "#9b4f4a",
  },
};
