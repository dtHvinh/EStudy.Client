"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRoles from "@/hooks/use-roles";
import { Role } from "@/types/admin";

interface RoleSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

// Mock fetcher function - replace with your actual API call
const fetchRoles = async (): Promise<Role[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "all", name: "All" },
        { id: "Student", name: "Student" },
        { id: "Teacher", name: "Teacher" },
        { id: "Admin", name: "Admin" },
        { id: "Moderator", name: "Moderator" },
      ]);
    }, 100);
  });
};

export default function RoleSelector({
  value,
  onValueChange,
  className = "w-40",
}: RoleSelectorProps) {
  const { roles, error, isLoading } = useRoles();

  if (error) {
    return (
      <Select value={value} onValueChange={onValueChange} disabled>
        <SelectTrigger className={className}>
          <SelectValue placeholder="Error loading roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={isLoading ? "Loading roles..." : "Role"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key={99} value={"All"}>
          All
        </SelectItem>
        {roles?.map((role) => (
          <SelectItem key={role.id} value={role.name}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
