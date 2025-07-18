"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusOption } from "@/types/admin";

interface StatusFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const statusOptions: StatusOption[] = [
  { value: "all", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Suspended", label: "Suspended" },
  { value: "Banned", label: "Banned" },
];

export default function StatusFilter({
  value,
  onValueChange,
  className = "w-40",
}: StatusFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
