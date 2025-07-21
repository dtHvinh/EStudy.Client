import api from "@/components/utils/requestUtils";
import useSWR from "swr";

export interface GetCourseStructureResponse {
  courseId: number;
  isPublished: boolean;
  chapters: GetCourseStructureChapterResponse[];
}

export interface GetCourseStructureChapterResponse {
  id: number;
  title: string;
  description?: string;
  orderIndex: number;
  isPublished: boolean;
  lessons: GetCourseStructureLessonResponse[];
  quizzes: GetCourseStructureQuizResponse[];
}

export interface GetCourseStructureQuizResponse {
  id?: number;
  title: string;
  description?: string;
  orderIndex: number;
  questions: GetCourseStructureQuizQuestionResponse[];
}

export interface GetCourseStructureQuizQuestionResponse {
  id?: number;
  text: string;
  options: GetCourseStructureQuizQuestionOptionResponse[];
}

export interface GetCourseStructureQuizQuestionOptionResponse {
  id?: number;
  text: string;
  isCorrect: boolean;
}

export interface GetCourseStructureLessonResponse {
  id: number;
  title: string;
  attachedFileUrls: string[];
  content: string;
  estimatedMinutes: number;
  description?: string;
  durationMinutes: number;
  orderIndex: number;
  transcriptUrl?: string;
  videoUrl?: string;
}

export default function useGetCourseStructure(id: string | number) {
  const { data, isLoading, error, mutate } = useSWR<GetCourseStructureResponse>(
    `/api/courses/${id}/structure`,
    api.get,
    {
      revalidateOnFocus: false,
    },
  );

  return {
    courseStructure: data,
    isLoading,
    error,
    mutate,
  };
}
