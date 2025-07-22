import api from "@/components/utils/requestUtils";
import { toast } from "sonner";
import useSWR from "swr";

export interface GetCourseToLearnResponse {
  studentCount: number;
  averageRating: number;
  isRated: boolean;
  title: string;
  chapters: GetCourseToLearnChapterResponse[];
}

export interface GetCourseToLearnLessonNote {
  content: string;
}

export interface GetCourseToLearnChapterResponse {
  id: number;
  title: string;
  description?: string;
  orderIndex: number;
  isPublished: boolean;
  totalMinutes: number;
  lessons: GetCourseToLearnLessonResponse[];
  quizzes: GetCourseToLearnQuizResponse[];
}
export interface GetCourseToLearnQuizResponse {
  id: number;
  title: string;
  description?: string;
  orderIndex: number;
  isCompleted: boolean;
  questions: GetCourseToLearnQuizQuestionResponse[];
}

export interface GetCourseToLearnQuizQuestionResponse {
  id: number;
  text: string;
  orderIndex: number;
  options: GetCourseToLearnQuizQuestionOptionResponse[];
}

export interface GetCourseToLearnQuizQuestionOptionResponse {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface GetCourseToLearnLessonResponse {
  id: number;
  title: string;
  attachedFileUrls: string[];
  content: string;
  description?: string;
  durationMinutes: number;
  orderIndex: number;
  note?: GetCourseToLearnLessonNote;
  transcriptUrl?: string;
  videoUrl?: string;
  isCompleted: boolean;
}

export default function useLearnCourse(courseId: string | number) {
  const { data, isLoading, error, mutate } = useSWR<GetCourseToLearnResponse>(
    `/api/courses/${courseId}/learn`,
    api.get,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  );

  const getNextLesson = (currentLessonId: number) => {
    if (!data) return undefined;
    const allLessons = data.chapters.flatMap((chapter) => chapter.lessons);
    const currentIndex = allLessons.findIndex(
      (lesson) => lesson.id === currentLessonId,
    );
    return allLessons[currentIndex + 1];
  };

  const takeNote = async (lessonId: number, content: string) => {
    try {
      await api.post(`/api/courses/lessons/${lessonId}/note`, {
        content,
      });

      mutate((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          chapters: prevData.chapters.map((chapter) => ({
            ...chapter,
            lessons: chapter.lessons.map((lesson) => {
              if (lesson.id === lessonId)
                return { ...lesson, note: { content } };
              return lesson;
            }),
          })),
        };
      }, false);
      toast.success("Note saved successfully");
    } catch (error) {
      console.error("Failed to save note:", error);
      toast.error("Failed to save note");
    }
  };

  const rateCourse = async (rating: number, review: string) => {
    try {
      await api.post(`/api/courses/${courseId}/ratings`, {
        value: rating,
        review,
      });
      toast.success("Course rated successfully");
    } catch (error) {
      console.error("Failed to rate course:", error);
      toast.error("Failed to rate course");
    }
  };

  const markLessonAsCompleted = async (lessonId: number) => {
    try {
      await api.post(`/api/courses/lessons/${lessonId}/completed`, {});
      mutate((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          chapters: prevData.chapters.map((chapter) => ({
            ...chapter,
            lessons: chapter.lessons.map((lesson) => {
              if (lesson.id === lessonId)
                return { ...lesson, isCompleted: true };
              return lesson;
            }),
          })),
        };
      }, false);
    } catch (error) {
      console.error("Failed to mark lesson as completed:", error);
    }
  };

  const markQuizAsCompleted = async (quizId: number) => {
    try {
      await api.post(`/api/courses/quizzes/${quizId}/completed`, {});
      mutate((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          chapters: prevData.chapters.map((chapter) => ({
            ...chapter,
            quizzes: chapter.quizzes.map((quiz) => {
              if (quiz.id === quizId) return { ...quiz, isCompleted: true };
              return quiz;
            }),
          })),
        };
      }, false);
    } catch (error) {
      console.error("Failed to mark quiz as completed:", error);
    }
  };

  return {
    course: data,
    isLoading,
    error,
    getNextLesson,
    takeNote,
    rateCourse,
    markLessonAsCompleted,
    markQuizAsCompleted,
  };
}
