import {
  TestTakingQuestion,
  TestTakingSection,
  TestTakingType,
  UserAnswer,
} from "@/hooks/use-test-taking";
import { useMemo } from "react";

export interface TestResult {
  questionId: number;
  question: TestTakingQuestion;
  userAnswerIds: number[];
  correctAnswerIds: number[];
  isCorrect: boolean;
  points: number;
  earnedPoints: number;
  section: TestTakingSection;
}

export interface TestResultsSummary {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  sectionResults: SectionResult[];
}

export interface SectionResult {
  section: TestTakingSection;
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
}

export function useTestResults(
  testData: TestTakingType,
  userAnswers: UserAnswer[],
  timeSpent = 0,
) {
  const results = useMemo((): TestResult[] => {
    const answerMap = new Map(
      userAnswers.map((answer) => [answer.questionId, answer]),
    );
    const allResults: TestResult[] = [];

    testData.sections.forEach((section) => {
      section.questions.forEach((question) => {
        const userAnswer = answerMap.get(question.id);
        const correctAnswerIds = question.answers
          .filter((answer) => answer.isCorrect)
          .map((answer) => answer.id);

        const userAnswerIds = userAnswer?.selectedAnswerIds || [];

        // Check if answer is correct
        let isCorrect = false;
        if (question.type === "single-choice") {
          isCorrect =
            userAnswerIds.length === 1 &&
            correctAnswerIds.includes(userAnswerIds[0]);
        } else if (question.type === "multiple-choice") {
          // For multiple choice, user must select all correct answers and no incorrect ones
          isCorrect =
            userAnswerIds.length === correctAnswerIds.length &&
            userAnswerIds.every((id) => correctAnswerIds.includes(id)) &&
            correctAnswerIds.every((id) => userAnswerIds.includes(id));
        }

        allResults.push({
          questionId: question.id,
          question,
          userAnswerIds,
          correctAnswerIds,
          isCorrect,
          points: question.points,
          earnedPoints: isCorrect ? question.points : 0,
          section,
        });
      });
    });

    return allResults;
  }, [testData, userAnswers]);

  const summary = useMemo((): TestResultsSummary => {
    const totalQuestions = results.length;
    const answeredQuestions = results.filter(
      (r) => r.userAnswerIds.length > 0,
    ).length;
    const correctAnswers = results.filter((r) => r.isCorrect).length;
    const incorrectAnswers = answeredQuestions - correctAnswers;
    const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
    const earnedPoints = results.reduce((sum, r) => sum + r.earnedPoints, 0);
    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = percentage >= testData.passingScore;

    const sectionResults: SectionResult[] = testData.sections.map((section) => {
      const sectionQuestionResults = results.filter(
        (r) => r.section.id === section.id,
      );
      const sectionCorrect = sectionQuestionResults.filter(
        (r) => r.isCorrect,
      ).length;
      const sectionTotalPoints = sectionQuestionResults.reduce(
        (sum, r) => sum + r.points,
        0,
      );
      const sectionEarnedPoints = sectionQuestionResults.reduce(
        (sum, r) => sum + r.earnedPoints,
        0,
      );
      const sectionPercentage =
        sectionTotalPoints > 0
          ? (sectionEarnedPoints / sectionTotalPoints) * 100
          : 0;

      return {
        section,
        totalQuestions: sectionQuestionResults.length,
        correctAnswers: sectionCorrect,
        totalPoints: sectionTotalPoints,
        earnedPoints: sectionEarnedPoints,
        percentage: sectionPercentage,
      };
    });

    return {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers,
      totalPoints,
      earnedPoints,
      percentage,
      passed,
      timeSpent,
      sectionResults,
    };
  }, [results, testData.passingScore, timeSpent]);

  return {
    results,
    summary,
  };
}

export function calculateEarnedPoints(
  testData: TestTakingType,
  userAnswers: UserAnswer[],
): number {
  const answerMap = new Map(
    userAnswers.map((answer) => [answer.questionId, answer]),
  );

  let totalEarnedPoints = 0;

  testData.sections.forEach((section) => {
    section.questions.forEach((question) => {
      const userAnswer = answerMap.get(question.id);
      const correctAnswerIds = question.answers
        .filter((answer) => answer.isCorrect)
        .map((answer) => answer.id);

      const userAnswerIds = userAnswer?.selectedAnswerIds || [];

      let isCorrect = false;
      if (question.type === "single-choice") {
        isCorrect =
          userAnswerIds.length === 1 &&
          correctAnswerIds.includes(userAnswerIds[0]);
      } else if (question.type === "multiple-choice") {
        isCorrect =
          userAnswerIds.length === correctAnswerIds.length &&
          userAnswerIds.every((id) => correctAnswerIds.includes(id)) &&
          correctAnswerIds.every((id) => userAnswerIds.includes(id));
      }

      if (isCorrect) {
        totalEarnedPoints += question.points;
      }
    });
  });

  return totalEarnedPoints;
}
