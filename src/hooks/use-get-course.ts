import api from "@/components/utils/requestUtils";
import useSWRInfinite from "swr/infinite";

export type GetCourseType = {
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
  studentsCount: number;
};

export default function useGetCourse() {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null; // No more
    return `/api/courses/mine?page=${pageIndex + 1}&pageSize=10`;
  };

  const {
    data: courses,
    error,
    isLoading,
    setSize,
  } = useSWRInfinite<GetCourseType[]>(getKey, api.get, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    courses: courses ? courses.flat() : [],
    isLoading,
    error,
    scrollNext: () => setSize((size) => size + 1),
  };
}
