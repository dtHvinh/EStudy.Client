"use client";

import { useState } from "react";

import { useUserFilters } from "@/hooks/use-users";
import PaginationControls from "./pagination-controls";
import UserFilters from "./user-filters";
import UserStats from "./user-stats";
import UserTable from "./user-table";

export default function UserManagement() {
  // User pagination state
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userItemsPerPage, setUserItemsPerPage] = useState(10);

  // Use the custom hook for user management
  const {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
  } = useUserFilters();

  // Pagination for users
  const userTotalPages = Math.ceil(filteredUsers.length / userItemsPerPage);
  const userStartIndex = (userCurrentPage - 1) * userItemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    userStartIndex,
    userStartIndex + userItemsPerPage,
  );

  const goToUserPage = (page: number) => {
    setUserCurrentPage(Math.max(1, Math.min(page, userTotalPages)));
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold">Error loading users</h2>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <UserStats users={filteredUsers} />
      </div>

      {/* User Filters */}
      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Users Table */}
      <UserTable users={paginatedUsers} isLoading={isLoading} />

      <PaginationControls
        currentPage={userCurrentPage}
        totalPages={userTotalPages}
        onPageChange={goToUserPage}
        startIndex={userStartIndex}
        itemsPerPage={userItemsPerPage}
        totalItems={filteredUsers.length}
        itemName="users"
      />
    </div>
  );
}
