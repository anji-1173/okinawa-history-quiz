import { useMemo, useState } from "react";
import { difficultyMeta, eras } from "../data/eras";
import { questionsFor } from "../data/questions";
import { resultLabel, saveResult } from "../lib/progress";
import { shuffleQuestionChoices } from "../lib/quizChoices";
import type { Difficulty, QuizResult } from "../types";
import SourceLinks from "./SourceLinks";
import "./quiz-navigation.css";

interface QuizExperienceProps {
  eraId: string;
  eraTitle: string;
  difficulty: Difficulty;
  onExit: () => void;
  onOpenMap: (placeId: string) => void;
  onComplete: (results: Partial<Record<Difficulty, QuizResult>>) => void;
}

export default function QuizExperience({
  eraId,
  eraTitle,
  difficulty,
  onExit,
  onOpenMap,
  onComplete,
}: QuizExperienceProps) {
  const sourceQuestions = useMemo(() => questionsFor(eraId, difficulty), [eraId, difficulty]);
  const featuredPlaceId = useMemo(
    () => sourceQuestions.flatMap((item) => item.relatedPlaceIds)[0],
    [sourceQuestions],
  );
  const [quizQuestions, setQuizQuestions] = useState(() => shuffleQuestionChoices(sourceQuestions));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => quizQuestions.map(() => null));
  const [finished, setFinished] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const meta = difficultyMeta[difficulty];
  const eraNumber = eras.find((era) => era.id === eraId)?.number ?? "";
  const question = quizQuestions[questionIndex];
  const selectedIndex = answers[questionIndex];
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const score = answers.reduce<number>((total, answer, index) => total + Number(answer === quizQuestions[index].correctIndex), 0);
  const allAnswered = answeredCount === quizQuestions.length;

  const choose = (choiceIndex: number) => {
    if (selectedIndex !== null) return;
    setAnswers((current) => current.map((answer, index) => index === questionIndex ? choiceIndex : answer));
  };

  const moveToQuestion = (index: number) => {
    setQuestionIndex(index);
    setFinished(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (allAnswered || questionIndex === quizQuestions.length - 1) {
      if (allAnswered) {
        const results = saveResult({
          difficulty,
          score,
          completedAt: new Date().toISOString(),
        });
        onComplete(results);
      }
      setFinished(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    moveToQuestion(questionIndex + 1);
  };

  const restart = () => {
    const reshuffledQuestions = shuffleQuestionChoices(sourceQuestions);
    setQuizQuestions(reshuffledQuestions);
    setQuestionIndex(0);
    setAnswers(reshuffledQuestions.map(() => null));
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
          <span className="eyebrow">{meta.label}・{allAnswered ? "完了" : "途中参加の結果"}</span>
          <div className="score-ring" aria-label={`${answeredCount}問中${score}問正解`}>
            <strong>{score}</strong>
            <span>/ {answeredCount}</span>
          </div>
          <h1 id="result-title">{allAnswered ? resultLabel(score) : "回答した問いを振り返りましょう"}</h1>
          {!allAnswered && (
            <p>今回は{answeredCount}問に回答しました。未回答の{quizQuestions.length - answeredCount}問は採点に含めていません。</p>
          )}
          <p>
            正解数はゴールではありません。気になった場所を地図で開き、二つ以上の資料を読み比べてみましょう。
          </p>
          <div className="result-actions">
            {!allAnswered && (
              <button className="primary-button" type="button" onClick={() => moveToQuestion(answers.findIndex((answer) => answer === null))}>
                未回答の問題を続ける
              </button>
            )}
            {featuredPlaceId && (
              <button className="primary-button" type="button" onClick={() => onOpenMap(featuredPlaceId)}>
                関連する場所を見る
              </button>
            )}
            <button className="secondary-button" type="button" onClick={restart}>
              もう一度挑戦する
            </button>
          </div>
        </section>
      </main>
    );
  }

  const isCorrect = selectedIndex === question.correctIndex;
  const progress = (answeredCount / quizQuestions.length) * 100;

  return (
    <main id="main-content" className="quiz-shell" key={restartKey}>
      <div className="quiz-topline">
        <button className="text-button" type="button" onClick={onExit}>
          ← 時代一覧へ戻る
        </button>
        <span style={{ color: meta.color }}>{meta.label}</span>
      </div>

      <section className="question-picker" aria-labelledby="question-picker-title">
        <div>
          <h2 id="question-picker-title">途中の問題から参加できます</h2>
          <p id="question-picker-help">好きな問題を選んで始めましょう。回答済みの問題は、解説を読み直せます。</p>
        </div>
        <div className="question-picker__control">
          <label htmlFor="question-number">参加する問題</label>
          <select
            id="question-number"
            value={questionIndex}
            aria-describedby="question-picker-help"
            onChange={(event) => moveToQuestion(Number(event.target.value))}
          >
            {quizQuestions.map((item, index) => (
              <option key={item.id} value={index}>
                第{index + 1}問｜{item.theme}{answers[index] !== null ? "（回答済み）" : ""}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="quiz-card" aria-labelledby="question-title">
        <div className="quiz-progress-copy">
          <span>第{eraNumber}時代｜{eraTitle}</span>
          <span>第{questionIndex + 1}問 / 全{quizQuestions.length}問</span>
        </div>
        <p className="quiz-answered-count" role="status">{answeredCount} / {quizQuestions.length}問 回答済み</p>
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
                {allAnswered || questionIndex === quizQuestions.length - 1 ? "結果を見る" : "次の問いへ"}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
