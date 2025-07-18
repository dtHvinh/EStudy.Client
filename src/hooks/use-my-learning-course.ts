import api from "@/components/utils/requestUtils";
import useSWRInfinite from "swr/infinite";

export interface GetEnrolledCourseResponse {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  completionPercentage: number;
}

export default function useMyLearningCourse() {
  const {
    data: course,
    isLoading,
    setSize,
  } = useSWRInfinite<GetEnrolledCourseResponse[]>(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null; // reached the end
      return `/api/courses/enrolled?page=${pageIndex + 1}&pageSize=10`; // API endpoint for fetching blogs
    },
    api.get,
  );

  const scrollNext = () => {
    setSize((size) => size + 1);
  };

  return { courses: course ? course.flat() : [], isLoading, scrollNext };
}
