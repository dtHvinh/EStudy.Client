"use client";

import { Card, CardContent } from "@/components/ui/card";
import RoleSelector from "./role-selector";
import StatusFilter from "./status-filter";
import UserSearchBar from "./user-search-bar";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export default function UserFilters({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
}: UserFiltersProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-6">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col items-start gap-4 sm:flex-row sm:items-center">
            <UserSearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
            />
            <RoleSelector value={roleFilter} onValueChange={onRoleChange} />
            <StatusFilter value={statusFilter} onValueChange={onStatusChange} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
