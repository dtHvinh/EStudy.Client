import { useState } from "react";

export function useUserFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("0");
  const [statusFilter, setStatusFilter] = useState("all");

  return {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
  };
}
