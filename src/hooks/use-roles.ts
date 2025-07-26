import api from "@/components/utils/requestUtils";
import useSWR from "swr";

export type Role = {
  id: string;
  name: string;
};

export default function useRoles() {
  const {
    data: roles,
    error,
    isLoading,
  } = useSWR<Role[]>("/api/roles", api.get);

  return {
    roles: roles || [],
    isLoading,
    error,
  };
}
