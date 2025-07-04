import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Course {
  id?: number;
  title: string;
  description: string;
  imageUrl?: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  isFree: boolean;
  isPublished: boolean;
  previewVideoUrl?: string;
  prerequisites?: string;
  learningObjectives?: string;
  language: string;
  estimatedDurationHours: number;
  chapters: CourseChapter[];
}

export interface CourseChapter {
  id?: number;
  title: string;
  description?: string;
  orderIndex: number;
  isPublished: boolean;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id?: number;
  title: string;
  videoUrl: string;
  content: string;
  description?: string;
  durationMinutes: number;
  orderIndex: number;
  transcriptUrl?: string;
  thumbnailUrl?: string;
}

interface CourseStore {
  course: Course;
  isLoading: boolean;
  isDirty: boolean;

  // Course actions
  updateCourse: (updates: Partial<Course>) => void;

  // Chapter actions
  addChapter: () => void;
  updateChapter: (chapterId: number, updates: Partial<CourseChapter>) => void;
  deleteChapter: (chapterId: number) => void;
  reorderChapters: (startIndex: number, endIndex: number) => void;

  // Lesson actions
  addLesson: (chapterId: number) => void;
  updateLesson: (
    chapterId: number,
    lessonId: number,
    updates: Partial<CourseLesson>,
  ) => void;
  deleteLesson: (chapterId: number, lessonId: number) => void;
  reorderLessons: (
    chapterId: number,
    startIndex: number,
    endIndex: number,
  ) => void;

  // Utility actions
  setLoading: (loading: boolean) => void;
  markClean: () => void;
}

export const useCreateCourse = create<CourseStore>()(
  immer((set) => ({
    course: {
      title: "",
      description: "",
      difficultyLevel: "Beginner",
      price: 0,
      isFree: true,
      isPublished: false,
      language: "English",
      estimatedDurationHours: 0,
      chapters: [],
    },
    isLoading: false,
    isDirty: false,

    updateCourse: (updates) =>
      set((state) => {
        Object.assign(state.course, updates);
        state.isDirty = true;
      }),

    addChapter: () =>
      set((state) => {
        const newChapter: CourseChapter = {
          title: `Chapter ${state.course.chapters.length + 1}`,
          description: "",
          orderIndex: state.course.chapters.length,
          isPublished: false,
          lessons: [],
        };
        state.course.chapters.push(newChapter);
        state.isDirty = true;
      }),

    updateChapter: (chapterId, updates) =>
      set((state) => {
        const chapter = state.course.chapters.find((c, i) => i === chapterId);
        if (chapter) {
          Object.assign(chapter, updates);
          state.isDirty = true;
        }
      }),

    deleteChapter: (chapterId) =>
      set((state) => {
        state.course.chapters.splice(chapterId, 1);
        // Reorder remaining chapters
        state.course.chapters.forEach((chapter, index) => {
          chapter.orderIndex = index;
        });
        state.isDirty = true;
      }),

    reorderChapters: (startIndex, endIndex) =>
      set((state) => {
        const [removed] = state.course.chapters.splice(startIndex, 1);
        state.course.chapters.splice(endIndex, 0, removed);
        // Update order indices
        state.course.chapters.forEach((chapter, index) => {
          chapter.orderIndex = index;
        });
        state.isDirty = true;
      }),

    addLesson: (chapterId) =>
      set((state) => {
        const chapter = state.course.chapters[chapterId];
        if (chapter) {
          const newLesson: CourseLesson = {
            title: `Lesson ${chapter.lessons.length + 1}`,
            videoUrl: "",
            content: "",
            description: "",
            durationMinutes: 0,
            orderIndex: chapter.lessons.length,
          };
          chapter.lessons.push(newLesson);
          state.isDirty = true;
        }
      }),

    updateLesson: (chapterId, lessonId, updates) =>
      set((state) => {
        const lesson = state.course.chapters[chapterId]?.lessons[lessonId];
        if (lesson) {
          Object.assign(lesson, updates);
          state.isDirty = true;
        }
      }),

    deleteLesson: (chapterId, lessonId) =>
      set((state) => {
        const chapter = state.course.chapters[chapterId];
        if (chapter) {
          chapter.lessons.splice(lessonId, 1);
          // Reorder remaining lessons
          chapter.lessons.forEach((lesson, index) => {
            lesson.orderIndex = index;
          });
          state.isDirty = true;
        }
      }),

    reorderLessons: (chapterId, startIndex, endIndex) =>
      set((state) => {
        const chapter = state.course.chapters[chapterId];
        if (chapter) {
          const [removed] = chapter.lessons.splice(startIndex, 1);
          chapter.lessons.splice(endIndex, 0, removed);
          // Update order indices
          chapter.lessons.forEach((lesson, index) => {
            lesson.orderIndex = index;
          });
          state.isDirty = true;
        }
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    markClean: () =>
      set((state) => {
        state.isDirty = false;
      }),
  })),
);
