import api from "@/components/utils/requestUtils";
import useSWR from "swr";

export type GetCourseDetailsType = {
  id: number;
  title: string;
  description: string;
  creationDate: string;
  modificationDate: string;
  imageUrl?: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  isFree: boolean;
  isPublished: boolean;
  prerequisites?: string;
  learningObjectives?: string;
  language: string;
  estimatedDurationHours: number;

  studentCount: number;
  ratingCount: number;
  averageRating: number;

  instructor?: InstructorDataResponse;
};
export interface InstructorDataResponse {
  id: number;
  fullName: string;
  profilePicture?: string;
  bio?: string;

  averageRating: number;
  ratingCount: number;
  courseCount: number;
  studentCount: number;
}

export default function useCourseDetails(courseId: string | number) {
  const {
    data: course,
    isLoading,
    error,
  } = useSWR<GetCourseDetailsType>(`/api/courses/${courseId}`, api.get, {
    revalidateOnFocus: false,
  });

  return {
    course,
    isLoading,
    error,
  };
}
