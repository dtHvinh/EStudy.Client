import api from "@/components/utils/requestUtils";
import useSWRInfinite from "swr/infinite";

export type GetMyCourseType = {
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
  isReadOnly?: boolean;
  creationDate: string;
};

export default function useGetMyCourse() {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null; // No more
    return `/api/courses/mine?page=${pageIndex + 1}&pageSize=10`;
  };

  const {
    data: courses,
    error,
    isLoading,
    setSize,
  } = useSWRInfinite<GetMyCourseType[]>(getKey, api.get, {
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
