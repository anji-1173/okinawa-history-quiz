import type { Question } from "../types";

type RandomSource = () => number;

const shuffled = <T,>(items: T[], random: RandomSource) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

export const shuffleQuestionChoices = (questions: Question[], random: RandomSource = Math.random) => {
  const answerPositions = shuffled(questions.map((_, index) => index % 4), random);

  return questions.map((question, questionIndex) => {
    const correctAnswer = question.choices[question.correctIndex];
    const distractors = shuffled(
      question.choices.filter((_, choiceIndex) => choiceIndex !== question.correctIndex),
      random,
    );
    const correctIndex = answerPositions[questionIndex];
    const choices = [...distractors];
    choices.splice(correctIndex, 0, correctAnswer);

    return { ...question, choices, correctIndex };
  });
};
