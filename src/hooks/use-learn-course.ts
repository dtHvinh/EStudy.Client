import api from "@/components/utils/requestUtils";
import useSWR from "swr";

export interface GetCourseToLearnResponse {
  studentCount: number;
  averageRating: number;
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
  const { data, isLoading, error } = useSWR<GetCourseToLearnResponse>(
    `/api/courses/${courseId}/learn`,
    api.get,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  );

  return { course: data, isLoading, error };
}
