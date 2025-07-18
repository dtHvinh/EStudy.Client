import api from "@/components/utils/requestUtils";
import { Role } from "@/types/admin";
import useSWR from "swr";

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
