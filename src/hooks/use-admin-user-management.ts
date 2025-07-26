import api from "@/components/utils/requestUtils";
import PagedResponse from "@/components/utils/types";
import useSWR from "swr";

export interface AdminGetUserResponse {
  id: number;
  name: string;
  roles: UserRoleObject[];
  warningCount: number;
  creationDate: string;
  email: string;
  profilePicture: string;
  status: string;
}

export interface UserRoleObject {
  id: number | string;
  name: string;
}

export interface UserQueryParams {
  [key: string]: string | number | boolean | undefined;
}

export default function useAdminUserManagement(query: UserQueryParams) {
  const getKey = () => {
    const params: Record<string, string> = {};
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        params[key] = String(value);
      }
    });

    return `/api/admin/users?${new URLSearchParams(params).toString()}`;
  };

  const { data, isLoading, error, mutate } = useSWR<
    PagedResponse<AdminGetUserResponse>
  >(getKey, api.get);

  return {
    users: data?.items || [],
    isLoading,
    error,
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    refetch: () => mutate(),
  };
}

export function useAdminUserActions(callback?: () => void) {
  const warningUser = async (userId: number) => {
    try {
      await api.post(`/api/admin/users/${userId}/warnings/increment`, {});
      callback?.();
      return true;
    } catch (error) {
      console.error("Error warning user:", error);
      return false;
    }
  };

  const clearWarnings = async (userId: number) => {
    try {
      await api.post(`/api/admin/users/${userId}/warnings/clear`, {});
      callback?.();
      return true;
    } catch (error) {
      console.error("Error clearing warnings:", error);
      return false;
    }
  };

  return { warningUser, clearWarnings };
}
