import { useMemo, useState } from "react";
import useSWR from "swr";

import { User } from "@/types/admin";
import { mock_allUsers } from "@/utils/mock-utils";

// Mock fetcher function - replace with your actual API call
const fetchUsers = async (): Promise<User[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mock_allUsers);
    }, 500);
  });
};

export function useUsers() {
  const {
    data: users,
    error,
    isLoading,
    mutate,
  } = useSWR<User[]>("/api/users", fetchUsers);

  return {
    users: users || [],
    isLoading,
    error,
    mutate,
  };
}

export function useUserFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");

  const { users, isLoading, error, mutate } = useUsers();

  const filteredUsers = useMemo(() => {
    if (!users.length) return [];

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  return {
    users,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    mutate,
  };
}
