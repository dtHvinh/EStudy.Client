import { UserInfoResponseType } from "@/hooks/use-user-info";
import { IconCancel, IconCheck, IconEdit, IconStar } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import DataErrorAlert from "../data-error-alert";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import api from "../utils/requestUtils";
import getInitials from "../utils/utilss";

export default function DashboardUserData({
  user,
}: {
  user: UserInfoResponseType | undefined;
}) {
  if (!user) {
    return <DataErrorAlert title="User data not found" />;
  }

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback className="text-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <UserName user={user} />
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                Member for {dayjs(user.creationDate).fromNow(true)}
              </Badge>
            </div>
          </div>
          {!user.isOnBoarded && (
            <Link
              href="/onboarding"
              className={buttonVariants({ variant: "outline" })}
            >
              <IconStar className="text-muted-foreground" />
              On board
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

const UserName = ({ user }: { user: UserInfoResponseType | undefined }) => {
  const [userName, setUserName] = useState(user?.name);
  const [isDirty, setIsDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async () => {
    if (!isDirty) {
      setIsEditing(false);
      return;
    }

    if (userName?.trim().length === 0) {
      toast.error("Name cannot be empty");
      return;
    }

    await api.put(`/api/user/me`, {
      name: userName,
    });

    setIsDirty(false);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{userName}</h1>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => setIsEditing(true)}
        >
          <IconEdit className="h-4 w-4" />
        </Button>
      </div>
    );
  } else {
    return (
      <div className="flex gap-1">
        <Input
          value={userName}
          autoFocus
          spellCheck={false}
          onChange={(e) => {
            setUserName(e.target.value);
            setIsDirty(true);
          }}
        />
        <div className="flex items-center gap-1">
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => setIsEditing(false)}
          >
            <IconCancel className="h-4 w-4" />
          </Button>
          <Button size={"icon"} variant={"ghost"} onClick={handleUpdate}>
            <IconCheck className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
};
