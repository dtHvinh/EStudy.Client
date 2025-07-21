import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { CourseDetails } from "./use-create-course-details";

export interface CourseChapter {
  id?: number;
  title: string;
  description?: string;
  orderIndex: number;
  isPublished: boolean;

  lessons: CourseLesson[];
  quizzes: CourseQuiz[];
}

export interface CourseQuiz {
  id?: number;
  title: string;
  description?: string;
  orderIndex: number;
  questions: CourseQuizQuestion[];
}

export interface CourseQuizOption {
  id?: number;
  text: string;
  isCorrect: boolean;
}

export interface CourseQuizQuestion {
  id?: number;
  text: string;
  options: CourseQuizOption[];
}

export interface CourseLesson {
  id?: number;
  title: string;
  attachedFileUrls: string[];
  content: string;
  description?: string;
  durationMinutes: number;
  orderIndex: number;
  transcriptUrl?: string;
  videoUrl?: string;
}

export interface CourseStructureStore {
  courseId?: number;
  isPublished?: boolean;
  chapters: CourseChapter[];
  isLoading: boolean;
  isDirty: boolean;

  title: string;
  description: string;
  imageUrl?: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  isFree: boolean;
  prerequisites?: string;
  learningObjectives?: string;
  language: string;
  estimatedDurationHours: number;

  publishCourse: () => void;

  // course details
  setDetails: (courseDetails: CourseDetails) => void;
  updateDetails: (updates: Partial<CourseDetails>) => void;
  getDetails: () => CourseDetails;

  // File upload actions
  setAttachmentUrls: (
    chapterId: number,
    lessonId: number,
    paths: string[],
  ) => void;
  deleteAttachment: (chapterId: number, lessonId: number, path: string) => void;
  setVideoUrl: (chapterId: number, lessonId: number, path: string) => void;
  setTranscriptUrl: (chapterId: number, lessonId: number, path: string) => void;
  deleteVideo: (chapterId: number, lessonId: number) => void;
  clearAttachments: (chapterId: number, lessonId: number) => void;
  deleteTranscript: (chapterId: number, lessonId: number) => void;

  // Course structure actions
  setCourseId: (id: number) => void;
  setChapters: (chapters: CourseChapter[]) => void;

  // Chapter actions
  getChapters: () => CourseChapter[];
  addChapter: () => void;
  updateChapter: (chapterId: number, updates: Partial<CourseChapter>) => void;
  deleteChapter: (chapterId: number) => void;
  reorderChapters: (startIndex: number, endIndex: number) => void;
  getChapterLessonLength: (chapterIndex: number) => number;
  getChapterQuizLength: (chapterIndex: number) => number;
  getChapterDescription: (chapterIndex: number) => string;
  getChapterIsPublished: (chapterIndex: number) => boolean;
  getChapterLessons: (chapterIndex: number) => CourseLesson[];
  getChapterQuizes: (chapterIndex: number) => CourseQuiz[];
  getChapterTitle: (chapterIndex: number) => string;

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

  // Quiz actions
  addQuiz: (chapterId: number) => void;
  updateQuiz: (
    chapterId: number,
    quizId: number,
    updates: Partial<CourseQuiz>,
  ) => void;
  deleteQuiz: (chapterId: number, quizId: number) => void;
  reorderQuizes: (
    chapterId: number,
    startIndex: number,
    endIndex: number,
  ) => void;

  // Quiz question actions
  addQuizQuestion: (chapterId: number, quizId: number) => void;
  updateQuizQuestion: (
    chapterId: number,
    quizId: number,
    questionId: number,
    updates: Partial<CourseQuizQuestion>,
  ) => void;
  deleteQuizQuestion: (
    chapterId: number,
    quizId: number,
    questionId: number,
  ) => void;
  reorderQuizQuestions: (
    chapterId: number,
    quizId: number,
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
  getTotalQuizes: () => number;
  getTotalDuration: () => number;
}

export const useEditCourseStructure = create<CourseStructureStore>()(
  immer((set, get) => ({
    courseId: undefined,
    chapters: [],
    isLoading: false,
    isDirty: false,
    pendingUploadFiles: {},
    isPublished: false,

    title: "",
    description: "",
    difficultyLevel: "Beginner",
    price: 0,
    isFree: true,
    language: "English",
    estimatedDurationHours: 0,
    prerequisites: "",
    learningObjectives: "",
    imageUrl: undefined,

    setDetails: (courseDetails) =>
      set((state) => {
        state.title = courseDetails.title;
        state.description = courseDetails.description;
        state.imageUrl = courseDetails.imageUrl;
        state.difficultyLevel = courseDetails.difficultyLevel;
        state.price = courseDetails.price;
        state.isFree = courseDetails.isFree;
        state.prerequisites = courseDetails.prerequisites;
        state.learningObjectives = courseDetails.learningObjectives;
        state.language = courseDetails.language;
        state.estimatedDurationHours = courseDetails.estimatedDurationHours;
      }),

    getDetails: () => {
      const state = get();
      return {
        title: state.title,
        description: state.description,
        imageUrl: state.imageUrl,
        difficultyLevel: state.difficultyLevel,
        price: state.price,
        isFree: state.isFree,
        prerequisites: state.prerequisites,
        learningObjectives: state.learningObjectives,
        language: state.language,
        estimatedDurationHours: state.estimatedDurationHours,
      } as CourseDetails;
    },

    updateDetails: (updates: Partial<CourseDetails>) =>
      set((state) => {
        Object.assign(state, updates);
        state.isDirty = true;
      }),

    publishCourse: () =>
      set((state) => {
        state.isPublished = true;
        state.isDirty = true;
      }),

    setCourseId: (id) =>
      set((state) => {
        state.courseId = id;
      }),

    setAttachmentUrls(chapterId, lessonId, paths) {
      set((state) => {
        const chapter = state.chapters.find((_, i) => i === chapterId);
        if (chapter) {
          const lesson = chapter.lessons.find((_, i) => i === lessonId);
          if (lesson) {
            lesson.attachedFileUrls = paths;
            state.isDirty = true;
          }
        }
      });
    },
    deleteAttachment(chapterId, lessonId, path) {
      set((state) => {
        const chapter = state.chapters.find((_, i) => i === chapterId);
        if (chapter) {
          const lesson = chapter.lessons.find((_, i) => i === lessonId);
          if (lesson) {
            lesson.attachedFileUrls = lesson.attachedFileUrls.filter(
              (url) => url !== path,
            );
            state.isDirty = true;
          }
        }
      });
    },

    clearAttachments(chapterId, lessonId) {
      set((state) => {
        const chapter = state.chapters.find((_, i) => i === chapterId);
        if (chapter) {
          const lesson = chapter.lessons.find((_, i) => i === lessonId);
          if (lesson) {
            lesson.attachedFileUrls = [];
            state.isDirty = true;
          }
        }
      });
    },

    setVideoUrl(chapterId, lessonId, path) {
      set((state) => {
        const chapter = state.chapters.find((_, i) => i === chapterId);
        if (chapter) {
          const lesson = chapter.lessons.find((_, i) => i === lessonId);
          if (lesson) {
            lesson.videoUrl = path;
            state.isDirty = true;
          }
        }
      });
    },

    setTranscriptUrl(chapterId, lessonId, path) {
      set((state) => {
        const chapter = state.chapters.find((_, i) => i === chapterId);
        if (chapter) {
          const lesson = chapter.lessons.find((_, i) => i === lessonId);
          if (lesson) {
            lesson.transcriptUrl = path;
            state.isDirty = true;
          }
        }
      });
    },

    deleteVideo(chapterId, lessonId) {
      set((state) => {
        const chapter = state.chapters.find((_, i) => i === chapterId);
        if (chapter) {
          const lesson = chapter.lessons.find((_, i) => i === lessonId);
          if (lesson) {
            lesson.videoUrl = undefined;
            state.isDirty = true;
          }
        }
      });
    },

    deleteTranscript(chapterId, lessonId) {
      set((state) => {
        const chapter = state.chapters.find((_, i) => i === chapterId);
        if (chapter) {
          const lesson = chapter.lessons.find((_, i) => i === lessonId);
          if (lesson) {
            lesson.transcriptUrl = undefined;
            state.isDirty = true;
          }
        }
      });
    },

    getChapters() {
      const state = get();
      return state.chapters;
    },

    getChapterLessonLength: (chapterIndex) => {
      const state = get();
      return state.chapters[chapterIndex]?.lessons.length || 0;
    },

    getChapterQuizLength: (chapterIndex) => {
      const state = get();
      return state.chapters[chapterIndex]?.quizzes.length || 0;
    },

    getChapterDescription: (chapterIndex) => {
      const state = get();
      return state.chapters[chapterIndex].description || "";
    },

    getChapterIsPublished: (chapterIndex) => {
      const state = get();
      return state.chapters[chapterIndex].isPublished || false;
    },

    getChapterTitle: (chapterIndex) => {
      const state = get();
      return (
        state.chapters[chapterIndex].title || `Chapter ${chapterIndex + 1}`
      );
    },

    getChapterLessons: (chapterIndex) => {
      const state = get();
      return state.chapters[chapterIndex].lessons || [];
    },

    getChapterQuizes: (chapterIndex) => {
      const state = get();
      return state.chapters[chapterIndex].quizzes || [];
    },

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
          quizzes: [],
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

    // Quiz actions
    addQuiz: (chapterId) =>
      set((state) => {
        const chapter = state.chapters[chapterId];
        if (chapter) {
          const newQuiz: CourseQuiz = {
            title: `Quiz ${chapter.quizzes.length + 1}`,
            description: "",
            orderIndex: chapter.quizzes.length,
            questions: [],
          };
          chapter.quizzes.push(newQuiz);
          state.isDirty = true;
        }
      }),

    updateQuiz: (chapterId, quizId, updates) =>
      set((state) => {
        const quiz = state.chapters[chapterId]?.quizzes[quizId];
        if (quiz) {
          Object.assign(quiz, updates);
          state.isDirty = true;
        }
      }),

    deleteQuiz: (chapterId, quizId) =>
      set((state) => {
        const chapter = state.chapters[chapterId];
        if (chapter) {
          chapter.quizzes.splice(quizId, 1);
          // Reorder remaining quizes
          chapter.quizzes.forEach((quiz, index) => {
            quiz.orderIndex = index;
          });
          state.isDirty = true;
        }
      }),

    reorderQuizes: (chapterId, startIndex, endIndex) =>
      set((state) => {
        const chapter = state.chapters[chapterId];
        if (chapter) {
          const [removed] = chapter.quizzes.splice(startIndex, 1);
          chapter.quizzes.splice(endIndex, 0, removed);
          // Update order indices
          chapter.quizzes.forEach((quiz, index) => {
            quiz.orderIndex = index;
          });
          state.isDirty = true;
        }
      }),

    // Quiz question actions
    addQuizQuestion: (chapterId, quizId) =>
      set((state) => {
        const quiz = state.chapters[chapterId]?.quizzes[quizId];
        if (quiz) {
          const newQuestion: CourseQuizQuestion = {
            text: "",
            options: [
              { text: "", isCorrect: true },
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
            ],
          };
          quiz.questions.push(newQuestion);
          state.isDirty = true;
        }
      }),

    updateQuizQuestion: (chapterId, quizId, questionId, updates) =>
      set((state) => {
        const question =
          state.chapters[chapterId]?.quizzes[quizId]?.questions[questionId];
        if (question) {
          Object.assign(question, updates);
          state.isDirty = true;
        }
      }),

    deleteQuizQuestion: (chapterId, quizId, questionId) =>
      set((state) => {
        const quiz = state.chapters[chapterId]?.quizzes[quizId];
        if (quiz) {
          quiz.questions.splice(questionId, 1);
          state.isDirty = true;
        }
      }),

    reorderQuizQuestions: (chapterId, quizId, startIndex, endIndex) =>
      set((state) => {
        const quiz = state.chapters[chapterId]?.quizzes[quizId];
        if (quiz) {
          const [removed] = quiz.questions.splice(startIndex, 1);
          quiz.questions.splice(endIndex, 0, removed);
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

    getTotalQuizes: () => {
      const state = get();
      return state.chapters.reduce(
        (total, chapter) => total + chapter.quizzes.length,
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
