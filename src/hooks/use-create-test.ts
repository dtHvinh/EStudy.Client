"use client";

import { useCallback, useState } from "react";

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: "single-choice" | "true-false" | "short-answer";
  text: string;
  answers: Answer[];
  points: number;
  explanation?: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  timeLimit?: number;
  questions: Question[];
  isExpanded: boolean;
}

export interface Test {
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  sections: Section[];
}

export interface TestSettings {
  maxAttempts: number | "unlimited";
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
}

const createDefaultTest = (): Test => ({
  title: "",
  description: "",
  duration: 60,
  passingScore: 70,
  sections: [],
});

const createDefaultSection = (index: number): Section => ({
  id: Date.now().toString(),
  title: `Section ${index + 1}`,
  description: "",
  questions: [],
  isExpanded: true,
});

const createDefaultQuestion = (): Question => ({
  id: Date.now().toString(),
  type: "single-choice",
  text: "",
  answers: [
    { id: "1", text: "", isCorrect: true },
    { id: "2", text: "", isCorrect: false },
    { id: "3", text: "", isCorrect: false },
    { id: "4", text: "", isCorrect: false },
  ],
  points: 1,
});

const createDefaultSettings = (): TestSettings => ({
  maxAttempts: 3,
  shuffleQuestions: false,
  showResultsImmediately: true,
});

export function useCreateTest(initialTest?: Partial<Test>) {
  const [test, setTest] = useState<Test>(() => ({
    ...createDefaultTest(),
    ...initialTest,
  }));

  const [settings, setSettings] = useState<TestSettings>(
    createDefaultSettings(),
  );

  // Test Management
  const updateTest = useCallback((field: keyof Test, value: any) => {
    setTest((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetTest = useCallback(() => {
    setTest(createDefaultTest());
    setSettings(createDefaultSettings());
  }, []);

  // Section Management
  const addSection = useCallback(() => {
    setTest((prev) => {
      const newSection = createDefaultSection(prev.sections.length);
      return {
        ...prev,
        sections: [...prev.sections, newSection],
      };
    });
  }, []);

  const updateSection = useCallback(
    (sectionId: string, field: keyof Section, value: any) => {
      setTest((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId ? { ...section, [field]: value } : section,
        ),
      }));
    },
    [],
  );

  const deleteSection = useCallback((sectionId: string) => {
    setTest((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }));
  }, []);

  const duplicateSection = useCallback((sectionId: string) => {
    setTest((prev) => {
      const sectionToDuplicate = prev.sections.find((s) => s.id === sectionId);
      if (!sectionToDuplicate) return prev;

      const duplicatedSection: Section = {
        ...sectionToDuplicate,
        id: Date.now().toString(),
        title: `${sectionToDuplicate.title} (Copy)`,
        questions: sectionToDuplicate.questions.map((q) => ({
          ...q,
          id: `${Date.now()}-${Math.random()}`,
          answers: q.answers.map((a) => ({
            ...a,
            id: `${Date.now()}-${Math.random()}`,
          })),
        })),
      };

      return {
        ...prev,
        sections: [...prev.sections, duplicatedSection],
      };
    });
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setTest((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section,
      ),
    }));
  }, []);

  const reorderSections = useCallback(
    (startIndex: number, endIndex: number) => {
      setTest((prev) => {
        const result = Array.from(prev.sections);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { ...prev, sections: result };
      });
    },
    [],
  );

  // Question Management
  const addQuestion = useCallback(
    (sectionId: string, questionType?: Question["type"]) => {
      setTest((prev) => {
        const newQuestion = createDefaultQuestion();
        if (questionType) {
          newQuestion.type = questionType;

          // Adjust answers based on question type
          if (questionType === "true-false") {
            newQuestion.answers = [
              { id: "1", text: "True", isCorrect: true },
              { id: "2", text: "False", isCorrect: false },
            ];
          } else if (questionType === "short-answer") {
            newQuestion.answers = [];
          }
        }

        return {
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === sectionId
              ? { ...section, questions: [...section.questions, newQuestion] }
              : section,
          ),
        };
      });
    },
    [],
  );

  const updateQuestion = useCallback(
    (
      sectionId: string,
      questionId: string,
      field: keyof Question,
      value: any,
    ) => {
      setTest((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map((question) =>
                  question.id === questionId
                    ? { ...question, [field]: value }
                    : question,
                ),
              }
            : section,
        ),
      }));
    },
    [],
  );

  const deleteQuestion = useCallback(
    (sectionId: string, questionId: string) => {
      setTest((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                questions: section.questions.filter((q) => q.id !== questionId),
              }
            : section,
        ),
      }));
    },
    [],
  );

  const duplicateQuestion = useCallback(
    (sectionId: string, questionId: string) => {
      setTest((prev) => {
        const section = prev.sections.find((s) => s.id === sectionId);
        const question = section?.questions.find((q) => q.id === questionId);

        if (!question) return prev;

        const duplicatedQuestion: Question = {
          ...question,
          id: Date.now().toString(),
          text: `${question.text} (Copy)`,
          answers: question.answers.map((answer) => ({
            ...answer,
            id: `${Date.now()}-${Math.random()}`,
          })),
        };

        return {
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  questions: [...section.questions, duplicatedQuestion],
                }
              : section,
          ),
        };
      });
    },
    [],
  );

  const reorderQuestions = useCallback(
    (sectionId: string, startIndex: number, endIndex: number) => {
      setTest((prev) => ({
        ...prev,
        sections: prev.sections.map((section) => {
          if (section.id !== sectionId) return section;

          const result = Array.from(section.questions);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);

          return { ...section, questions: result };
        }),
      }));
    },
    [],
  );

  // Answer Management
  const updateAnswer = useCallback(
    (
      sectionId: string,
      questionId: string,
      answerId: string,
      field: keyof Answer,
      value: any,
    ) => {
      setTest((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map((question) =>
                  question.id === questionId
                    ? {
                        ...question,
                        answers: question.answers.map((answer) =>
                          answer.id === answerId
                            ? { ...answer, [field]: value }
                            : answer,
                        ),
                      }
                    : question,
                ),
              }
            : section,
        ),
      }));
    },
    [],
  );

  const setCorrectAnswer = useCallback(
    (sectionId: string, questionId: string, answerId: string) => {
      setTest((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map((question) =>
                  question.id === questionId
                    ? {
                        ...question,
                        answers: question.answers.map((answer) => ({
                          ...answer,
                          isCorrect: answer.id === answerId,
                        })),
                      }
                    : question,
                ),
              }
            : section,
        ),
      }));
    },
    [],
  );

  const addAnswerOption = useCallback(
    (sectionId: string, questionId: string) => {
      setTest((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map((question) => {
                  if (question.id !== questionId) return question;

                  const newAnswer: Answer = {
                    id: Date.now().toString(),
                    text: "",
                    isCorrect: false,
                  };

                  return {
                    ...question,
                    answers: [...question.answers, newAnswer],
                  };
                }),
              }
            : section,
        ),
      }));
    },
    [],
  );

  const removeAnswerOption = useCallback(
    (sectionId: string, questionId: string, answerId: string) => {
      setTest((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map((question) =>
                  question.id === questionId
                    ? {
                        ...question,
                        answers: question.answers.filter(
                          (answer) => answer.id !== answerId,
                        ),
                      }
                    : question,
                ),
              }
            : section,
        ),
      }));
    },
    [],
  );

  // Settings Management
  const updateSettings = useCallback(
    (field: keyof TestSettings, value: any) => {
      setSettings((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  // Utility Functions
  const getTotalQuestions = useCallback(() => {
    return test.sections.reduce(
      (total, section) => total + section.questions.length,
      0,
    );
  }, [test.sections]);

  const getTotalPoints = useCallback(() => {
    return test.sections.reduce(
      (total, section) =>
        total +
        section.questions.reduce(
          (sectionTotal, question) => sectionTotal + question.points,
          0,
        ),
      0,
    );
  }, [test.sections]);

  const getAverageTimePerQuestion = useCallback(() => {
    const totalQuestions = getTotalQuestions();
    return totalQuestions > 0 ? Math.round(test.duration / totalQuestions) : 0;
  }, [test.duration, getTotalQuestions]);

  const getSectionStats = useCallback(
    (sectionId: string) => {
      const section = test.sections.find((s) => s.id === sectionId);
      if (!section) return { questions: 0, points: 0 };

      return {
        questions: section.questions.length,
        points: section.questions.reduce(
          (total, question) => total + question.points,
          0,
        ),
      };
    },
    [test.sections],
  );

  const validateTest = useCallback(() => {
    const errors: string[] = [];

    if (!test.title.trim()) {
      errors.push("Test title is required");
    }

    if (test.sections.length === 0) {
      errors.push("At least one section is required");
    }

    test.sections.forEach((section, sectionIndex) => {
      if (!section.title.trim()) {
        errors.push(`Section ${sectionIndex + 1} title is required`);
      }

      if (section.questions.length === 0) {
        errors.push(
          `Section "${section.title}" must have at least one question`,
        );
      }

      section.questions.forEach((question, questionIndex) => {
        if (!question.text.trim()) {
          errors.push(
            `Question ${questionIndex + 1} in section "${section.title}" is empty`,
          );
        }

        if (question.type !== "short-answer") {
          const hasCorrectAnswer = question.answers.some(
            (answer) => answer.isCorrect,
          );
          if (!hasCorrectAnswer) {
            errors.push(
              `Question ${questionIndex + 1} in section "${section.title}" has no correct answer`,
            );
          }

          const hasEmptyAnswers = question.answers.some(
            (answer) => !answer.text.trim(),
          );
          if (hasEmptyAnswers) {
            errors.push(
              `Question ${questionIndex + 1} in section "${section.title}" has empty answer options`,
            );
          }
        }
      });
    });

    return errors;
  }, [test]);

  const isTestValid = useCallback(() => {
    return validateTest().length === 0;
  }, [validateTest]);

  // Export/Import Functions
  const exportTest = useCallback(() => {
    return {
      test,
      settings,
      metadata: {
        createdAt: new Date().toISOString(),
        version: "1.0",
      },
    };
  }, [test, settings]);

  const importTest = useCallback((importedData: any) => {
    try {
      if (importedData.test) {
        setTest(importedData.test);
      }
      if (importedData.settings) {
        setSettings(importedData.settings);
      }
      return true;
    } catch (error) {
      console.error("Failed to import test:", error);
      return false;
    }
  }, []);

  return {
    // State
    test,
    settings,

    // Test Management
    updateTest,
    resetTest,

    // Section Management
    addSection,
    updateSection,
    deleteSection,
    duplicateSection,
    toggleSection,
    reorderSections,

    // Question Management
    addQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    reorderQuestions,

    // Answer Management
    updateAnswer,
    setCorrectAnswer,
    addAnswerOption,
    removeAnswerOption,

    // Settings Management
    updateSettings,

    // Utility Functions
    getTotalQuestions,
    getTotalPoints,
    getAverageTimePerQuestion,
    getSectionStats,

    // Validation
    validateTest,
    isTestValid,

    // Export/Import
    exportTest,
    importTest,
  };
}
