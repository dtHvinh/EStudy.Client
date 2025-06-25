import api from "@/components/utils/requestUtils";
import useSWR from "swr";

export type Roles = "Admin" | "Student" | "Instructor";

export function useUserRole() {
  const {
    data: roles,
    isLoading,
    error,
  } = useSWR<Roles[]>("/api/user/my-roles", api.get);

  const canCreateTest = () => roles && roles.includes("Instructor");

  return {
    roles,
    isRoleLoading: isLoading,
    getRoleError: error,
    canCreateTest,
  };
}
