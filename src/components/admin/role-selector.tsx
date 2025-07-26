"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRoles from "@/hooks/use-roles";

interface RoleSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

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
          <SelectItem value="0">All Roles</SelectItem>
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
        <SelectItem key={99} value={"0"}>
          All
        </SelectItem>
        {roles?.map((role) => (
          <SelectItem key={role.id} value={role.id}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
