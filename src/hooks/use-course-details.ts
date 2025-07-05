import api from "@/components/utils/requestUtils";
import useSWR from "swr";
import { GetCourseType } from "./use-get-course";

type GetCourseDetailsType = GetCourseType;

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
