"use client";

import { Search } from "lucide-react";
import { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";

interface UserSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function UserSearchBar({
  searchTerm,
  onSearchChange,
  placeholder = "Search users...",
  debounceMs = 300,
}: UserSearchBarProps) {
  const debouncedSearch = useDebouncedCallback(
    useCallback(
      (value: string) => {
        onSearchChange(value);
      },
      [onSearchChange],
    ),
    debounceMs,
  );

  return (
    <div className="relative max-w-sm flex-1">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
      <Input
        placeholder={placeholder}
        defaultValue={searchTerm}
        onChange={(e) => debouncedSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
