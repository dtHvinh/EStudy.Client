"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TestDetailsComment } from "@/hooks/use-test-details";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@radix-ui/react-alert-dialog";
import { IconSend2 } from "@tabler/icons-react";
import dayjs from "dayjs";
import { MessageSquare } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import z from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import { Input } from "../ui/input";
import getInitials from "../utils/utilss";

interface TestCommentsProps {
  comments: TestDetailsComment[];
  commentCount: number;
  onSendComment?: (text: string) => void;
  onDeleteComment?: (commentId: number | string) => void;
  onScrollToBottom?: () => void;
}

export function TestComments({
  comments,
  commentCount,
  onSendComment,
  onDeleteComment,
  onScrollToBottom,
}: TestCommentsProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    console.log("TestComments inView:", inView);
    if (inView && onScrollToBottom) {
      onScrollToBottom();
    }
  }, [inView, onScrollToBottom]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Comments ({commentCount})
        </CardTitle>
        <CardDescription>
          See what other test-takers are saying about this test
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CommentInput className="mb-5" onSendComment={onSendComment} />
        <Separator className="mb-4" />
        <div className="pr-4">
          <div className="space-y-4">
            {comments.length === 0 && (
              <div className="text-muted-foreground text-center">
                No comments yet
              </div>
            )}
            <AnimatePresence>
              {comments.map((comment, index) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  showSeparator={index < comments.length - 1}
                  onDeleteComment={() => onDeleteComment?.(comment.id)}
                />
              ))}
              <div ref={ref} />
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Comment = ({
  comment,
  showSeparator,
  onDeleteComment,
}: {
  comment: TestDetailsComment;
  showSeparator: boolean;
  onDeleteComment?: () => void;
}) => {
  return (
    <motion.div exit={{ opacity: 0, x: 20 }}>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={comment.author.profilePicture || "/placeholder.svg"}
            alt={comment.author.name}
          />
          <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <p className="text-sm font-medium">{comment.author.name}</p>
            <p className="text-muted-foreground text-xs">
              {dayjs(comment.creationDate).fromNow()}
            </p>
          </div>
          <p className="text-muted-foreground md mb-2">{comment.text}</p>
        </div>
        {!comment.isReadOnly && (
          <div className="text-muted-foreground flex-shrink-0 text-xs">
            {/* <Button variant="link" size="sm" className="text-xs">
              Reply
            </Button> */}
            <DeleteButton onDeleteComment={onDeleteComment} />
          </div>
        )}
      </div>
      {showSeparator && <Separator className="my-4" />}
    </motion.div>
  );
};

const CommentInput = ({
  onSendComment,
  className,
}: {
  onSendComment?: (text: string) => void;
} & React.HTMLAttributes<HTMLFormElement>) => {
  const commentSchema = z.object({
    text: z.string().min(1, "Comment cannot be empty"),
  });

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof commentSchema>) {
    onSendComment?.(values.text);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <Input
              clearable={false}
              type="text"
              autoComplete="off"
              spellCheck="false"
              placeholder="Add a comment..."
              {...field}
              rightSection={
                <Button
                  variant={"outline"}
                  className="w-9 rounded-full shadow-md"
                  type="submit"
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                >
                  <IconSend2 />
                </Button>
              }
            />
          )}
        />
      </form>
    </Form>
  );
};

const DeleteButton = ({
  onDeleteComment,
}: {
  onDeleteComment?: () => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" size="sm" className="text-destructive text-xs">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>
          Are you sure you want to delete this comment?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. Are you sure you want to proceed?
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-5">
          <AlertDialogCancel asChild>
            <Button>Let me think!</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onDeleteComment} variant={"outline"}>
              Yes
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
