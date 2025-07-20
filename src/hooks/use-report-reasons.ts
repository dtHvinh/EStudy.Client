import api from "@/components/utils/requestUtils";
import useSWR from "swr";

export default function useReportReasons() {
  const {
    data: reportReasons,
    error,
    isLoading,
  } = useSWR<{ id: number; title: string; description: string }[]>(
    "/api/report-reasons",
    api.get,
  );

  return {
    reportReasons,
    isLoading,
    error,
  };
}
