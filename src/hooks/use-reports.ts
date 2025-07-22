import api from "@/components/utils/requestUtils";
import PagedResponse from "@/components/utils/types";
import useSWR from "swr";

export interface Report {
  id: number;
  reporterName: string;
  reporterEmail: string;

  targetType: string;
  targetId: number;
  targetTitle: string;

  reason: string;
  description: string;
  status: string;
  creationDate: string;
}

export interface UseReportHookProps {
  pageSize?: number;
  page?: number;
}

export default function useReports({ pageSize, page }: UseReportHookProps) {
  const getKey = () => {
    const params = new URLSearchParams();
    if (pageSize) params.append("pageSize", String(pageSize));
    if (page) params.append("page", String(page));
    return `/api/reports?${params.toString()}`;
  };

  const {
    data: pageResponse,
    isLoading,
    error,
    mutate,
  } = useSWR<PagedResponse<Report>>(getKey, api.get);

  return {
    reports: pageResponse?.items || [],
    totalCount: pageResponse?.totalCount || 0,
    totalPages: pageResponse?.totalPages || 0,
    isLoading,
    error,
    refetch: () => mutate(),
  };
}
