import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface CourseChapter {
  id?: number;
  title: string;
  description?: string;
  orderIndex: number;
  isPublished: boolean;
  lessons: CourseLesson[];
}

export interface CourseLesson extends LessionAttachment {
  id?: number;
  title: string;
  attachedFileUrls: string[]; // Comma-separated string of file URLs
  content: string;
  description?: string;
  durationMinutes: number;
  orderIndex: number;
  transcriptUrl?: string;
  videoUrl?: string;
}

export interface LessionAttachment {
  attachments: File[];
  video?: File;
}

interface CourseStructureStore {
  courseId?: number;
  chapters: CourseChapter[];
  isLoading: boolean;
  isDirty: boolean;

  // File upload actions
  setAttachments: (chapterId: number, lessonId: number, files: File[]) => void;
  deleteAttachment: (chapterId: number, lessonId: number, file: File) => void;
  setVideo: (chapterId: number, lessonId: number, video: File) => void;
  deleteVideo: (chapterId: number, lessonId: number) => void;

  // Course structure actions
  setCourseId: (id: number) => void;
  setChapters: (chapters: CourseChapter[]) => void;

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
  markDirty: () => void;
  resetStructure: () => void;

  // Computed values
  getTotalLessons: () => number;
  getTotalDuration: () => number;
}

export const useCreateCourseStructure = create<CourseStructureStore>()(
  immer((set, get) => ({
    courseId: undefined,
    chapters: [],
    isLoading: false,
    isDirty: false,
    pendingUploadFiles: {},

    setCourseId: (id) =>
      set((state) => {
        state.courseId = id;
      }),

    setAttachments: (chapterId, lessonId, files) =>
      set((state) => {
        const chapter = state.chapters.find((_, i) => i === chapterId);
        console.log("Chapter", chapter);
        if (chapter) {
          const lesson = chapter.lessons.find((_, i) => i === lessonId);
          if (lesson) {
            lesson.attachments = files;
            state.isDirty = true;
          }
        }
      }),

    deleteAttachment: (chapterId, lessonId, file) =>
      set((state) => {
        const chapter = state.chapters.find((_, i) => i === chapterId);
        if (chapter) {
          const lesson = chapter.lessons.find((_, i) => i === lessonId);
          if (lesson) {
            lesson.attachments = lesson.attachments.filter((f) => f !== file);
            state.isDirty = true;
          }
        }
      }),

    setVideo: (chapterId, lessonId, video) =>
      set((state) => {
        const chapter = state.chapters.find((_, i) => i === chapterId);
        if (chapter) {
          const lesson = chapter.lessons.find((_, i) => i === lessonId);
          if (lesson) {
            lesson.video = video;
            state.isDirty = true;
          }
        }
      }),

    deleteVideo: (chapterId, lessonId) =>
      set((state) => {
        const chapter = state.chapters.find((_, i) => i === chapterId);
        if (chapter) {
          const lesson = chapter.lessons.find((_, i) => i === lessonId);
          if (lesson) {
            lesson.video = undefined;
            state.isDirty = true;
          }
        }
      }),

    setChapters: (chapters) =>
      set((state) => {
        state.chapters = chapters;
        state.isDirty = false;
      }),

    addChapter: () =>
      set((state) => {
        const newChapter: CourseChapter = {
          title: `Chapter ${state.chapters.length + 1}`,
          description: "",
          orderIndex: state.chapters.length,
          isPublished: false,
          lessons: [],
        };
        state.chapters.push(newChapter);
        state.isDirty = true;
      }),
    updateChapter: (chapterId, updates) =>
      set((state) => {
        const chapter = state.chapters.find((c, i) => i === chapterId);
        if (chapter) {
          Object.assign(chapter, updates);
          state.isDirty = true;
        }
      }),

    deleteChapter: (chapterId) =>
      set((state) => {
        state.chapters.splice(chapterId, 1);
        // Reorder remaining chapters
        state.chapters.forEach((chapter, index) => {
          chapter.orderIndex = index;
        });
        state.isDirty = true;
      }),

    reorderChapters: (startIndex, endIndex) =>
      set((state) => {
        const [removed] = state.chapters.splice(startIndex, 1);
        state.chapters.splice(endIndex, 0, removed);
        // Update order indices
        state.chapters.forEach((chapter, index) => {
          chapter.orderIndex = index;
        });
        state.isDirty = true;
      }),

    addLesson: (chapterId) =>
      set((state) => {
        const chapter = state.chapters[chapterId];
        if (chapter) {
          const newLesson: CourseLesson = {
            title: `Lesson ${chapter.lessons.length + 1}`,
            attachedFileUrls: [],
            content: "",
            description: "",
            durationMinutes: 0,
            orderIndex: chapter.lessons.length,
            attachments: [],
            video: undefined,
          };
          chapter.lessons.push(newLesson);
          state.isDirty = true;
        }
      }),

    updateLesson: (chapterId, lessonId, updates) =>
      set((state) => {
        const lesson = state.chapters[chapterId]?.lessons[lessonId];
        if (lesson) {
          Object.assign(lesson, updates);
          state.isDirty = true;
        }
      }),

    deleteLesson: (chapterId, lessonId) =>
      set((state) => {
        const chapter = state.chapters[chapterId];
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
        const chapter = state.chapters[chapterId];
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

    markDirty: () =>
      set((state) => {
        state.isDirty = true;
      }),

    resetStructure: () =>
      set((state) => {
        state.chapters = [];
        state.courseId = undefined;
        state.isDirty = false;
      }),

    getTotalLessons: () => {
      const state = get();
      return state.chapters.reduce(
        (total, chapter) => total + chapter.lessons.length,
        0,
      );
    },

    getTotalDuration: () => {
      const state = get();
      return state.chapters.reduce(
        (total, chapter) =>
          total +
          chapter.lessons.reduce(
            (chapterTotal, lesson) => chapterTotal + lesson.durationMinutes,
            0,
          ),
        0,
      );
    },
  })),
);
