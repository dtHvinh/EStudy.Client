"use client";

import { Ban, Edit, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types/admin";

interface UserDetailsDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about the user account
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <Badge variant={getUserStatusColor(user.status)} className="mt-1">
                {user.status}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Role</Label>
              <p className="text-sm text-gray-600">{user.role}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Level</Label>
              <p className="text-sm text-gray-600">{user.level}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Join Date</Label>
              <p className="text-sm text-gray-600">{user.joinDate}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Last Active</Label>
              <p className="text-sm text-gray-600">{user.lastActive}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Content Created</Label>
              <p className="text-sm text-gray-600">{user.contentCount} items</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Reports Against</Label>
              <p className="text-sm text-gray-600">
                {user.reportsCount} reports
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Role
          </Button>
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Warning
          </Button>
          <Button variant="destructive">
            <Ban className="mr-2 h-4 w-4" />
            Ban User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
