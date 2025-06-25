import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { useGenericToggle } from "@/hooks/use-generic-toggle";
import { cn } from "@/lib/utils";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import dayjs from "dayjs";
import { Calendar, Edit3, EditIcon, Trash } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Avatar } from "./ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Skeleton } from "./ui/skeleton";
import { AuthorType } from "./utils/types";
import getInitials from "./utils/utilss";

export interface BlogResponseType {
  id: number;
  title: string;
  creationDate: string;
  modificationDate: string | null;
  author?: AuthorType;
}

interface BlogPostCardProps {
  blog: BlogResponseType;
  className?: string;
  onDelete?: () => void;
}

export function BlogCard({ ...props }: BlogPostCardProps) {
  const {
    opened: deleteOpened,
    openChange: deleteOpenChange,
    open: deleteOpen,
  } = useGenericToggle(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <BlogCardDisplay {...props} />
        </ContextMenuTrigger>
        <ContextMenuContent className="w-52">
          <ContextMenuItem inset>
            Edit
            <ContextMenuShortcut>
              <EditIcon />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem variant="destructive" onClick={deleteOpen} inset>
            <span>Delete</span>
            <ContextMenuShortcut>
              <Trash className="text-destructive" />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={deleteOpened} onOpenChange={deleteOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={props.onDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const BlogCardDisplay = ({
  blog,
  className,
}: {
  blog: BlogResponseType;
  className?: string;
}) => {
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM D, YYYY");
  };

  const getRelativeTime = (dateString: string) => {
    return dayjs(dateString).fromNow();
  };
  return (
    <Card
      className={cn(
        "w-full max-w-4xl mx-auto shadow border-0 bg-card",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="space-y-3">
          <h1 className="text-2xl font-normal leading-tight tracking-tight">
            <Link className="hover:underline" href={`/blog/${blog.id}`}>
              {blog.title}
            </Link>
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(blog.creationDate)}</span>
              <Badge variant="secondary" className="text-xs">
                {getRelativeTime(blog.creationDate)}
              </Badge>
            </div>

            {blog.modificationDate && (
              <div className="flex items-center gap-1.5">
                <Edit3 className="w-4 h-4" />
                <span>Modified {formatDate(blog.modificationDate)}</span>
                <Badge variant="secondary" className="text-xs hover:bg-blue-50">
                  {getRelativeTime(blog.modificationDate)}
                </Badge>
              </div>
            )}

            <BlogCardAuthor author={blog.author} />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

const BlogCardAuthor = ({ author }: { author?: AuthorType }) => {
  if (!author) {
    return null;
  }

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="cursor-default">By {author.name}</div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={author.profilePicture} alt={author.name} />
            <AvatarFallback className="rounded-lg">
              {getInitials(author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{author.name}</h3>
            <div>Member for {dayjs(author.creationDate).fromNow(true)}</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export const BlogCardSkeleton = ({ number }: { number: number }) => {
  return (
    <>
      {Array.from({ length: number }).map((_, index) => (
        <Skeleton
          key={index}
          className="max-w-4xl mx-auto w-full h-48 @container/card"
          data-slot="card"
        />
      ))}
    </>
  );
};
