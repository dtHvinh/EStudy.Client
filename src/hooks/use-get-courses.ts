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
  isEnrolled?: boolean;
};

export default function useGetCourses({ query }: { query?: string } = {}) {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/courses?page=${pageIndex + 1}&pageSize=10&query=${query || ""}`;
  };

  const { data, error, isLoading, setSize } = useSWRInfinite<GetCourseType[]>(
    getKey,
    api.get,
  );
  const scrollNext = () => {
    setSize((prevSize) => prevSize + 1);
  };

  return {
    courses: data ? data.flat() : [],
    isLoading,
    error,
    scrollNext,
  };
}
