"use client";

import {
  AlertTriangle,
  Ban,
  Edit,
  Eye,
  MessageSquare,
  MoreHorizontal,
  UserMinus,
} from "lucide-react";
import { useState } from "react";

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
import { AdminGetUserResponse } from "@/hooks/use-admin-user-management";
import dayjs from "dayjs";
import TextContent from "../content/text-content";
import getInitials from "../utils/utilss";
import UserDetailsDialog from "./user-details-dialog";

interface UserTableProps {
  users: AdminGetUserResponse[];
  isLoading?: boolean;
}

export default function UserTable({
  users,
  isLoading = false,
}: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<AdminGetUserResponse | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Suspended":
        return "secondary";
      case "Banned":
        return "destructive";
      case "Inactive":
        return "outline";
      default:
        return "outline";
    }
  };

  const handleViewDetails = (user: AdminGetUserResponse) => {
    setSelectedUser(user);
    setDialogOpen(true);
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
                      <TableCell>Active</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">{user.warningCount}</span>
                          {user.warningCount > 2 && (
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {dayjs(user.creationDate).fromNow(true)}
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
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(user)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Warning
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Ban className="mr-2 h-4 w-4" />
                              Ban User
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

      {selectedUser && (
        <UserDetailsDialog
          user={selectedUser}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
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
