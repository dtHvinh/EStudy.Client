"use client";

import { Badge } from "@/components/ui/badge";
import { User } from "@/types/admin";

interface UserStatsProps {
  users: User[];
}

export default function UserStats({ users }: UserStatsProps) {
  const bannedCount = users.filter((u) => u.status === "Banned").length;
  const suspendedCount = users.filter((u) => u.status === "Suspended").length;

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Badge variant="destructive">{bannedCount} Banned</Badge>
      <Badge variant="secondary">{suspendedCount} Suspended</Badge>
    </div>
  );
}
