import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface CourseDetails {
  id?: number;
  title: string;
  description: string;
  imageUrl?: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  isFree: boolean;
  isPublished: boolean;
  prerequisites?: string;
  learningObjectives?: string;
  language: string;
  estimatedDurationHours: number;
}

interface CourseDetailsStore {
  courseDetails: CourseDetails;
  isLoading: boolean;
  isDirty: boolean;

  // Course details actions
  updateCourseDetails: (updates: Partial<CourseDetails>) => void;
  setCourseDetails: (details: CourseDetails) => void;
  resetCourseDetails: () => void;

  // Utility actions
  setLoading: (loading: boolean) => void;
  markClean: () => void;
  markDirty: () => void;
}

const initialCourseDetails: CourseDetails = {
  title: "",
  description: "",
  difficultyLevel: "Beginner",
  price: 0,
  isFree: true,
  isPublished: false,
  language: "English",
  estimatedDurationHours: 0,
};

export const useCreateCourseDetails = create<CourseDetailsStore>()(
  immer((set) => ({
    courseDetails: initialCourseDetails,
    isLoading: false,
    isDirty: false,

    updateCourseDetails: (updates) =>
      set((state) => {
        Object.assign(state.courseDetails, updates);
        state.isDirty = true;
      }),

    setCourseDetails: (details) =>
      set((state) => {
        state.courseDetails = details;
        state.isDirty = false;
      }),

    resetCourseDetails: () =>
      set((state) => {
        state.courseDetails = initialCourseDetails;
        state.isDirty = false;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    markClean: () =>
      set((state) => {
        state.isDirty = false;
      }),

    markDirty: () =>
      set((state) => {
        state.isDirty = true;
      }),
  })),
);
