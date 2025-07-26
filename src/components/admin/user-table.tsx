"use client";

import {
  AlertTriangle,
  Ban,
  Edit,
  MessageSquare,
  MessageSquareOff,
  MoreHorizontal,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AdminGetUserResponse,
  useAdminUserActions,
} from "@/hooks/use-admin-user-management";
import { preventDialogClose } from "@/lib/functions";
import dayjs from "dayjs";
import { toast } from "sonner";
import TextContent from "../content/text-content";
import api from "../utils/requestUtils";
import getInitials from "../utils/utilss";
import UserBanButton from "./user-management/user-ban-button";
import UserRoleButton from "./user-management/user-role-button";

interface UserTableProps {
  users: AdminGetUserResponse[];
  isLoading?: boolean;
  onDataChange?: () => void;
}

export default function UserTable({
  users,
  isLoading = false,
  onDataChange,
}: UserTableProps) {
  const { warningUser, clearWarnings } = useAdminUserActions(onDataChange);

  const unbanUser = async (userId: string | number) => {
    try {
      await api.post(`/api/admin/users/${userId}/unban`, {});
      onDataChange?.();
      toast.success("User unbanned successfully");
    } catch (error) {
      console.error("Failed to unban user:", error);
      toast.error("Failed to unban user");
    }
  };

  return (
    <>
      <Card>
        <CardContent className="px-5">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">User</TableHead>
                  <TableHead className="w-[250px]">Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Warnings</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <Skeleton />
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profilePicture} />
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            {user.email && (
                              <div className="text-sm text-gray-500">
                                <TextContent text={user.email} />
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="space-x-2 overflow-x-auto">
                        {user.roles.map((role) => (
                          <Badge
                            className="no-selectable"
                            key={role.id}
                            variant={
                              role.name === "Admin"
                                ? "default"
                                : role.name === "Moderator"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {role.name}
                          </Badge>
                        ))}
                      </TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">{user.warningCount}</span>
                          {user.warningCount > 2 && (
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {dayjs(user.creationDate).format("MMM DD, YYYY")}&nbsp;
                        ({dayjs(user.creationDate).fromNow(true)})
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={preventDialogClose}>
                              <UserRoleButton
                                onRoleChange={onDataChange}
                                user={user}
                              >
                                <div className="flex items-center">
                                  <Edit className="mr-4 h-4 w-4" />
                                  Edit Role
                                </div>
                              </UserRoleButton>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => warningUser(user.id)}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Warning
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => clearWarnings(user.id)}
                            >
                              <MessageSquareOff className="mr-2 h-4 w-4" />
                              Clear Warnings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={preventDialogClose}
                              className="hover:bg-destructive/10 text-red-600"
                            >
                              {!(user.status === "Banned") ? (
                                <UserBanButton
                                  userId={user.id}
                                  onBanSuccess={onDataChange}
                                />
                              ) : (
                                <button
                                  className="flex items-center gap-2"
                                  onClick={() => unbanUser(user.id)}
                                >
                                  <Ban className="text-destructive mr-2 h-4 w-4" />
                                  Unban User
                                </button>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function Skeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="h-3 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
      </TableCell>
    </TableRow>
  ));
}
