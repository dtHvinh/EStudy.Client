"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: "single-choice" | "multiple-choice";
  text: string;
  answers: Answer[];
  points: number;
  explanation?: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
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

interface TestStore {
  test: Test;

  // Test Management
  updateTest: (field: keyof Test, value: any) => void;
  resetTest: () => void;

  // Section Management
  addSection: () => void;
  updateSection: (sectionId: string, field: keyof Section, value: any) => void;
  deleteSection: (sectionId: string) => void;
  duplicateSection: (sectionId: string) => void;
  toggleSection: (sectionId: string) => void;

  // Question Management
  addQuestion: (sectionId: string, questionType?: Question["type"]) => void;
  updateQuestion: (
    sectionId: string,
    questionId: string,
    field: keyof Question,
    value: any,
  ) => void;
  deleteQuestion: (sectionId: string, questionId: string) => void;
  duplicateQuestion: (sectionId: string, questionId: string) => void;

  // Answer Management
  updateAnswer: (
    sectionId: string,
    questionId: string,
    answerId: string,
    field: keyof Answer,
    value: any,
  ) => void;
  setCorrectAnswer: (
    sectionId: string,
    questionId: string,
    answerId: string,
  ) => void;
  addAnswerOption: (sectionId: string, questionId: string) => void;
  removeAnswerOption: (
    sectionId: string,
    questionId: string,
    answerId: string,
  ) => void;

  // Utility Functions
  getTotalQuestions: () => number;
  getTotalPoints: () => number;
  getAverageTimePerQuestion: () => number;
  getSectionStats: (sectionId: string) => { questions: number; points: number };
  validateTest: () => string[];
  isTestValid: () => boolean;

  // Export/Import
  exportTest: () => any;
  importTest: (importedData: any) => boolean;
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

const createDefaultQuestion = (
  type: Question["type"] = "single-choice",
): Question => ({
  id: Date.now().toString(),
  type,
  text: "",
  points: 1,
  answers: [
    { id: "1", text: "", isCorrect: true },
    { id: "2", text: "", isCorrect: false },
    { id: "3", text: "", isCorrect: false },
    { id: "4", text: "", isCorrect: false },
  ],
});

export const useTestStore = create<TestStore>()(
  immer((set, get) => ({
    test: createDefaultTest(),

    // Test Management
    updateTest: (field, value) =>
      set((state) => {
        (state.test as any)[field] = value;
      }),

    resetTest: () =>
      set((state) => {
        state.test = createDefaultTest();
      }),

    // Section Management
    addSection: () =>
      set((state) => {
        const newSection = createDefaultSection(state.test.sections.length);
        state.test.sections.push(newSection);
      }),

    updateSection: (sectionId, field, value) =>
      set((state) => {
        const section = state.test.sections.find((s) => s.id === sectionId);
        if (section) {
          (section[field] as any) = value;
        }
      }),

    deleteSection: (sectionId) =>
      set((state) => {
        state.test.sections = state.test.sections.filter(
          (s) => s.id !== sectionId,
        );
      }),

    duplicateSection: (sectionId) =>
      set((state) => {
        const sectionToDuplicate = state.test.sections.find(
          (s) => s.id === sectionId,
        );
        if (sectionToDuplicate) {
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
          state.test.sections.push(duplicatedSection);
        }
      }),

    toggleSection: (sectionId) =>
      set((state) => {
        const section = state.test.sections.find((s) => s.id === sectionId);
        if (section) {
          section.isExpanded = !section.isExpanded;
        }
      }),

    // Question Management
    addQuestion: (sectionId, questionType) =>
      set((state) => {
        const section = state.test.sections.find((s) => s.id === sectionId);
        if (section) {
          const newQuestion = createDefaultQuestion(questionType);
          section.questions.push(newQuestion);
        }
      }),

    updateQuestion: (sectionId, questionId, field, value) =>
      set((state) => {
        const section = state.test.sections.find((s) => s.id === sectionId);
        const question = section?.questions.find((q) => q.id === questionId);
        if (question) {
          (question[field] as any) = value;

          // Handle question type changes
          if (field === "type" && value === "single-choice") {
            const firstCorrectIndex = question.answers.findIndex(
              (a) => a.isCorrect,
            );
            question.answers.forEach((answer, index) => {
              answer.isCorrect =
                index === (firstCorrectIndex >= 0 ? firstCorrectIndex : 0);
            });
          }
        }
      }),

    deleteQuestion: (sectionId, questionId) =>
      set((state) => {
        const section = state.test.sections.find((s) => s.id === sectionId);
        if (section) {
          section.questions = section.questions.filter(
            (q) => q.id !== questionId,
          );
        }
      }),

    duplicateQuestion: (sectionId, questionId) =>
      set((state) => {
        const section = state.test.sections.find((s) => s.id === sectionId);
        const question = section?.questions.find((q) => q.id === questionId);
        if (question) {
          const duplicatedQuestion: Question = {
            ...question,
            id: Date.now().toString(),
            text: `${question.text} (Copy)`,
            answers: question.answers.map((answer) => ({
              ...answer,
              id: `${Date.now()}-${Math.random()}`,
            })),
          };
          section?.questions.push(duplicatedQuestion);
        }
      }),

    // Answer Management
    updateAnswer: (sectionId, questionId, answerId, field, value) =>
      set((state) => {
        const section = state.test.sections.find((s) => s.id === sectionId);
        const question = section?.questions.find((q) => q.id === questionId);
        const answer = question?.answers.find((a) => a.id === answerId);
        if (answer) {
          (answer[field] as any) = value;
        }
      }),

    setCorrectAnswer: (sectionId, questionId, answerId) =>
      set((state) => {
        const section = state.test.sections.find((s) => s.id === sectionId);
        const question = section?.questions.find((q) => q.id === questionId);
        if (question) {
          if (question.type === "multiple-choice") {
            const answer = question.answers.find((a) => a.id === answerId);
            if (answer) {
              answer.isCorrect = !answer.isCorrect;
            }
          } else {
            question.answers.forEach((answer) => {
              answer.isCorrect = answer.id === answerId;
            });
          }
        }
      }),

    addAnswerOption: (sectionId, questionId) =>
      set((state) => {
        const section = state.test.sections.find((s) => s.id === sectionId);
        const question = section?.questions.find((q) => q.id === questionId);
        if (question) {
          const newAnswer: Answer = {
            id: Date.now().toString(),
            text: "",
            isCorrect: false,
          };
          question.answers.push(newAnswer);
        }
      }),

    removeAnswerOption: (sectionId, questionId, answerId) =>
      set((state) => {
        const section = state.test.sections.find((s) => s.id === sectionId);
        const question = section?.questions.find((q) => q.id === questionId);
        if (question) {
          question.answers = question.answers.filter((a) => a.id !== answerId);
        }
      }),

    // Utility Functions
    getTotalQuestions: () => {
      const { test } = get();
      return test.sections.reduce(
        (total, section) => total + section.questions.length,
        0,
      );
    },

    getTotalPoints: () => {
      const { test } = get();
      return test.sections.reduce(
        (total, section) =>
          total +
          section.questions.reduce(
            (sectionTotal, question) => sectionTotal + question.points,
            0,
          ),
        0,
      );
    },

    getAverageTimePerQuestion: () => {
      const { test, getTotalQuestions } = get();
      const totalQuestions = getTotalQuestions();
      return totalQuestions > 0
        ? Math.round(test.duration / totalQuestions)
        : 0;
    },

    getSectionStats: (sectionId) => {
      const { test } = get();
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

    validateTest: () => {
      const { test } = get();
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

          if (question.answers.length < 2) {
            errors.push(
              `Question ${questionIndex + 1} in section "${section.title}" needs at least 2 answer options`,
            );
          }
        });
      });

      return errors;
    },

    isTestValid: () => {
      const { validateTest } = get();
      return validateTest().length === 0;
    },

    exportTest: () => {
      const { test } = get();
      return {
        test,
        metadata: {
          createdAt: new Date().toISOString(),
          version: "1.0",
        },
      };
    },

    importTest: (importedData) => {
      try {
        if (importedData.test) {
          set((state) => {
            state.test = importedData.test;
          });
        }
        return true;
      } catch (error) {
        console.error("Failed to import test:", error);
        return false;
      }
    },
  })),
);

export function useCreateTest() {
  const store = useTestStore();
  return store;
}
