import api from "@/components/utils/requestUtils";
import { PriceFilterValues } from "@/types/course-price-constants";
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

export default function useGetCourses({
  query,
  price,
}: {
  query?: string;
  price?: PriceFilterValues;
}) {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    const params = new URLSearchParams({
      page: (pageIndex + 1).toString(),
      pageSize: "10",
    });

    if (query) params.append("query", query);
    if (price) params.append("price", price.toString());

    return `/api/courses?${params.toString()}`;
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
