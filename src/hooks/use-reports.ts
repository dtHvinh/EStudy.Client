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
  filterProps?: {
    status?: string;
    reasonId?: string;
  };
}

export default function useReports({
  pageSize,
  page,
  filterProps,
}: UseReportHookProps) {
  const getKey = () => {
    const params = new URLSearchParams();
    if (pageSize) params.append("pageSize", String(pageSize));
    if (page) params.append("page", String(page));
    if (filterProps) {
      Object.entries(filterProps).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
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

export function useReportActions({
  onActionSuccess,
  reportId,
}: {
  onActionSuccess?: (action: string) => void;
  reportId: number;
}) {
  //The action ("Resolved", "Rejected", "UnderReview", ...) is in capital letters
  // to match the backend conversion logic.
  const resolveReport = async () => {
    await api.put(`/api/reports/${reportId}?action=Resolved`, {});
    onActionSuccess?.("Resolved");
  };

  const rejectReport = async () => {
    await api.put(`/api/reports/${reportId}?action=Rejected`, {});
    onActionSuccess?.("Rejected");
  };

  const reviewReport = async () => {
    await api.put(`/api/reports/${reportId}?action=UnderReview`, {});
    onActionSuccess?.("UnderReview");
  };

  const warnUser = async () => {
    await api.put(`/api/reports/${reportId}?action=warn-user`, {});
    onActionSuccess?.("WarnedUser");
  };

  return {
    rejectReport,
    resolveReport,
    warnUser,
    reviewReport,
  };
}
