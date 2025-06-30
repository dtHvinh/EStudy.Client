"use client";
import { WarningLevel } from "@/components/test-taking/count-down-timer";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

export interface TestTakingType {
  id: number;
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  sectionCount: number;
  attemptCount: number;
  questionCount: number;
  sections: TestTakingSection[];
}

export interface TestTakingSection {
  id: number;
  title: string;
  description: string;
  questions: TestTakingQuestion[];
}

export interface TestTakingQuestion {
  id: number;
  type: "multiple-choice" | "single-choice";
  text: string;
  points: number;
  answers: TestTakingAnswer[];
}

export interface TestTakingAnswer {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface SectionProgress {
  sectionId: number;
  totalQuestions: number;
  answeredQuestions: number;
  isCompleted: boolean;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswerIds?: number[];
  textAnswer?: string;
}

export function useTestTaking(testData: TestTakingType) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, UserAnswer>>(
    new Map(),
  );
  const [timeRemaining, setTimeRemaining] = useState(testData.duration * 60); // Convert to seconds
  const [isActive, setIsActive] = useState(true);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) {
      if (timeRemaining <= 0) {
        setIsTimeUp(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimeUp(true);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);

  const formatTime = useCallback((seconds: number) => {
    return dayjs.duration(seconds, "seconds").format("HH:mm:ss");
  }, []);

  const getTimeWarningLevel = useCallback(() => {
    const totalTime = testData.duration * 60;
    const percentage = (timeRemaining / totalTime) * 100;

    if (percentage <= 5) return "critical";
    if (percentage <= 15) return "warning";
    return "normal" as WarningLevel;
  }, [timeRemaining, testData.duration]);

  const getSectionProgress = useCallback((): SectionProgress[] => {
    return testData.sections.map((section) => {
      const totalQuestions = section.questions.length;
      const answeredQuestions = section.questions.filter((q) =>
        userAnswers.has(q.id),
      ).length;

      return {
        sectionId: section.id,
        totalQuestions,
        answeredQuestions,
        isCompleted: answeredQuestions === totalQuestions,
      };
    });
  }, [testData.sections, userAnswers]);

  const updateAnswer = useCallback(
    (questionId: number, selectedAnswerIds: number[]) => {
      setUserAnswers(
        (prev) =>
          new Map(prev.set(questionId, { questionId, selectedAnswerIds })),
      );
    },
    [],
  );

  const navigateToSection = useCallback((sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentQuestionIndex(0);
  }, []);

  const navigateToQuestion = useCallback((questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
  }, []);

  const goToNextQuestion = useCallback(() => {
    const currentSection = testData.sections[currentSectionIndex];
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentSectionIndex < testData.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  }, [currentSectionIndex, currentQuestionIndex, testData.sections]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentSectionIndex > 0) {
      const prevSectionIndex = currentSectionIndex - 1;
      setCurrentSectionIndex(prevSectionIndex);
      setCurrentQuestionIndex(
        testData.sections[prevSectionIndex].questions.length - 1,
      );
    }
  }, [currentSectionIndex, currentQuestionIndex, testData.sections]);

  const getTotalProgress = useCallback(() => {
    const totalQuestions = testData.questionCount;
    const answeredQuestions = userAnswers.size;
    return {
      total: totalQuestions,
      answered: answeredQuestions,
      percentage: (answeredQuestions / totalQuestions) * 100,
    };
  }, [testData.questionCount, userAnswers.size]);

  const isQuestionAnswered = useCallback(
    (questionId: number) => {
      return userAnswers.has(questionId);
    },
    [userAnswers],
  );

  return {
    currentSectionIndex,
    currentQuestionIndex,
    userAnswers,
    timeRemaining,
    isTimeUp,
    formatTime: formatTime(timeRemaining),
    warningLevel: getTimeWarningLevel(),
    sectionProgress: getSectionProgress(),
    totalProgress: getTotalProgress(),
    updateAnswer,
    navigateToSection,
    navigateToQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    isQuestionAnswered,
    pauseTimer: () => setIsActive(false),
    resumeTimer: () => setIsActive(true),
  };
}
