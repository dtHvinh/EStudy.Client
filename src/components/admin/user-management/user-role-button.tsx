import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import api from "@/components/utils/requestUtils";
import { ButtonVariant } from "@/components/utils/types";
import {
  AdminGetUserResponse,
  UserRoleObject,
} from "@/hooks/use-admin-user-management";
import useRoles from "@/hooks/use-roles";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function UserRoleButton({
  user,
  children,
  onRoleChange,
}: {
  user: AdminGetUserResponse;
  children: React.ReactNode;
  onRoleChange?: () => void;
}) {
  const { roles } = useRoles();

  const [currentRoles, setCurrentRoles] = useState(user.roles);
  const [selectableRoles, setSelectableRoles] = useState<UserRoleObject[]>(
    roles.filter((r) => !currentRoles.some((cr) => cr.id === r.id)),
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSaveChanges = async () => {
    startTransition(async () => {
      try {
        await api.put(`/api/admin/users/${user.id}/roles`, {
          roleIds: currentRoles.map((r) => r.id),
        });
        toast.success("User roles updated successfully");
        onRoleChange?.();
      } catch (error) {
        console.error("Error saving user roles:", error);
        toast.error("Failed to update user roles");
      }
      setIsDirty(false);
    });
  };

  const handleRoleChange = (role: UserRoleObject) => {
    setIsDirty(true);
    setCurrentRoles((prev) =>
      prev.some((r) => r.id === role.id)
        ? prev.filter((r) => r.id !== role.id)
        : [...prev, role],
    );
    setSelectableRoles((prev) =>
      prev.some((r) => r.id === role.id)
        ? prev.filter((r) => r.id !== role.id)
        : [...prev, role],
    );
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="min-h-[250px]">
        <DialogHeader>
          <DialogTitle>Edit {user.name}`s roles</DialogTitle>
          <div className="grid grid-cols-12">
            <div className="col-span-6">
              <Label className="mb-5 text-sm font-medium">Current Roles</Label>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                {currentRoles.map((r) => (
                  <RoleButton
                    key={r.id}
                    role={r}
                    onClick={handleRoleChange}
                    variant={"default"}
                  />
                ))}
              </div>
            </div>
            <div className="col-span-6">
              <Label className="mb-5 text-sm font-medium">
                Available Roles
              </Label>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                {selectableRoles.map((r) => (
                  <RoleButton key={r.id} role={r} onClick={handleRoleChange} />
                ))}
              </div>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-auto flex justify-end">
          <Button disabled={!isDirty || isPending} onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const RoleButton = ({
  role,
  onClick,
  variant = "outline",
}: {
  role: UserRoleObject;
  variant?: ButtonVariant;
  onClick: (role: UserRoleObject) => void;
}) => {
  return (
    <Button className="text-sm" variant={variant} onClick={() => onClick(role)}>
      {role.name}
    </Button>
  );
};
