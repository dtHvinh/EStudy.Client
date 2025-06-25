"use client";

import { Roles, useUserRole } from "@/hooks/use-user-role";
import { HTMLAttributes } from "react";

export default function RoleBaseComponent({
  requireRoles,
  fallback = null,
  ...props
}: {
  requireRoles: Roles | Roles[];
  fallback?: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  const { roles, isRoleLoading } = useUserRole();

  if (!isRoleLoading && roles) {
    const requiredRoles = Array.isArray(requireRoles)
      ? requireRoles
      : [requireRoles];
    const hasRequiredRole = requiredRoles.some((role) => roles.includes(role));
    if (!hasRequiredRole) return fallback;
  }

  return <div {...props} />;
}
