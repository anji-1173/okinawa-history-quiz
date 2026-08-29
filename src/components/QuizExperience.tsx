import { useMemo, useState } from "react";
import { difficultyMeta } from "../data/eras";
import { questionsFor } from "../data/questions";
import { resultLabel, saveResult } from "../lib/progress";
import type { Difficulty, QuizResult } from "../types";
import SourceLinks from "./SourceLinks";

interface QuizExperienceProps {
  difficulty: Difficulty;
  onExit: () => void;
  onOpenMap: (placeId: string) => void;
  onComplete: (results: Partial<Record<Difficulty, QuizResult>>) => void;
}

export default function QuizExperience({
  difficulty,
  onExit,
  onOpenMap,
  onComplete,
}: QuizExperienceProps) {
  const quizQuestions = useMemo(() => questionsFor("prefecture-war", difficulty), [difficulty]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const meta = difficultyMeta[difficulty];
  const question = quizQuestions[questionIndex];

  const choose = (choiceIndex: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(choiceIndex);
    if (choiceIndex === question.correctIndex) setScore((value) => value + 1);
  };

  const next = () => {
    if (questionIndex === quizQuestions.length - 1) {
      const results = saveResult({
        difficulty,
        score,
        completedAt: new Date().toISOString(),
      });
      onComplete(results);
      setFinished(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setQuestionIndex((value) => value + 1);
    setSelectedIndex(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setQuestionIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setFinished(false);
    setRestartKey((value) => value + 1);
  };

  if (finished) {
    return (
      <main id="main-content" className="quiz-shell result-shell" key={restartKey}>
        <button className="text-button" type="button" onClick={onExit}>
          ← 時代一覧へ戻る
        </button>
        <section className="result-card" aria-labelledby="result-title">
          <span className="eyebrow">{meta.label}・完了</span>
          <div className="score-ring" aria-label={`10問中${score}問正解`}>
            <strong>{score}</strong>
            <span>/ 10</span>
          </div>
          <h1 id="result-title">{resultLabel(score)}</h1>
          <p>
            正解数はゴールではありません。気になった場所を地図で開き、二つ以上の資料を読み比べてみましょう。
          </p>
          <div className="result-actions">
            <button className="primary-button" type="button" onClick={() => onOpenMap("tsushima-maru-memorial")}>
              関連する場所を見る
            </button>
            <button className="secondary-button" type="button" onClick={restart}>
              もう一度挑戦する
            </button>
          </div>
        </section>
      </main>
    );
  }

  const isCorrect = selectedIndex === question.correctIndex;
  const progress = ((questionIndex + 1) / quizQuestions.length) * 100;

  return (
    <main id="main-content" className="quiz-shell" key={restartKey}>
      <div className="quiz-topline">
        <button className="text-button" type="button" onClick={onExit}>
          ← 時代一覧へ戻る
        </button>
        <span style={{ color: meta.color }}>{meta.label}</span>
      </div>

      <section className="quiz-card" aria-labelledby="question-title">
        <div className="quiz-progress-copy">
          <span>第3時代｜沖縄県の成立から沖縄戦</span>
          <span>{questionIndex + 1} / {quizQuestions.length}</span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${progress}%`, background: meta.color }} />
        </div>

        {question.sensitive && (
          <p className="sensitive-note">この問いは戦争・犠牲に関する内容を含みます。時間制限はありません。</p>
        )}
        <span className="question-theme">{question.theme}</span>
        <h1 id="question-title">{question.prompt}</h1>

        <div className="choice-list" role="group" aria-label="選択肢">
          {question.choices.map((choice, choiceIndex) => {
            const answered = selectedIndex !== null;
            const classNames = ["choice-button"];
            if (answered && choiceIndex === question.correctIndex) classNames.push("choice-button--correct");
            if (answered && choiceIndex === selectedIndex && !isCorrect) classNames.push("choice-button--wrong");
            return (
              <button
                className={classNames.join(" ")}
                type="button"
                key={choice}
                disabled={answered}
                onClick={() => choose(choiceIndex)}
              >
                <span aria-hidden="true">{String.fromCharCode(65 + choiceIndex)}</span>
                {choice}
              </button>
            );
          })}
        </div>

        {selectedIndex !== null && (
          <div className={`answer-panel ${isCorrect ? "answer-panel--correct" : "answer-panel--wrong"}`} aria-live="polite">
            <strong className="answer-verdict" aria-label={isCorrect ? "正解" : "不正解"}>
              <span aria-hidden="true">{isCorrect ? "○" : "×"}</span>
              {isCorrect ? "正解です" : "ここを確かめましょう"}
            </strong>
            <p>{question.explanation}</p>
            <SourceLinks sourceIds={question.sourceIds} />
            <div className="answer-actions">
              {question.relatedPlaceIds[0] && (
                <button className="map-link-button" type="button" onClick={() => onOpenMap(question.relatedPlaceIds[0])}>
                  地図で見る
                </button>
              )}
              <button className="primary-button" type="button" onClick={next}>
                {questionIndex === quizQuestions.length - 1 ? "結果を見る" : "次の問いへ"}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

