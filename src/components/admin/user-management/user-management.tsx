"use client";

import { useState } from "react";

import useAdminUserManagement from "@/hooks/use-admin-user-management";
import { useUserFilters } from "@/hooks/use-users";
import PaginationControls from "../pagination-controls";
import UserFilters from "../user-filters";
import UserTable from "../user-table";

export default function UserManagement() {
  const {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
  } = useUserFilters();
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userItemsPerPage, setUserItemsPerPage] = useState(10);

  const { users, isLoading, error, refetch, totalCount, totalPages } =
    useAdminUserManagement({
      page: userCurrentPage,
      pageSize: userItemsPerPage,
      name: searchTerm,
    });

  const goToUserPage = (page: number) => {
    setUserCurrentPage(Math.max(1, Math.min(page, totalPages)));
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
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
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

      <PaginationControls
        currentPage={userCurrentPage}
        totalPages={totalPages}
        onPageChange={goToUserPage}
        startIndex={(userCurrentPage - 1) * userItemsPerPage}
        itemsPerPage={userItemsPerPage}
        totalItems={totalCount}
        itemName="users"
      />

      <UserTable users={users} isLoading={isLoading} />

      <PaginationControls
        currentPage={userCurrentPage}
        totalPages={totalPages}
        onPageChange={goToUserPage}
        startIndex={(userCurrentPage - 1) * userItemsPerPage}
        itemsPerPage={userItemsPerPage}
        totalItems={totalCount}
        itemName="users"
      />
    </div>
  );
}
