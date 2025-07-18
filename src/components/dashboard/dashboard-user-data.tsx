import { UserInfoResponseType } from "@/hooks/use-user-info";
import { IconStar } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import DataErrorAlert from "../data-error-alert";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";

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
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                Member for {dayjs(user.creationDate).fromNow(true)}
              </Badge>
            </div>
          </div>
          {!user.isOnBoarded && (
            <Link
              href="/onboarding/"
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
