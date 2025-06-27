import { GetTestResponseType } from "@/hooks/use-tests";
import { cn } from "@/lib/utils";
import { Clock, MessageCircle, Users } from "lucide-react";
import RelativeLink from "./relative-link";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function TestCard({
  className,
  ...props
}: { className?: string } & GetTestResponseType) {
  return (
    <Card
      className={cn("transition-all duration-200 hover:shadow-md", className)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{props.title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {props.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          {props.sectionCount} sections | {props.questionCount} questions
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-b py-3">
          <div className="text-center">
            <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium">{props.duration}m</div>
            <div className="text-muted-foreground truncate text-xs">
              Duration
            </div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <Users className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium">
              {props.attemptCount.toLocaleString("en")}
            </div>
            <div className="text-muted-foreground truncate text-xs">
              Attempts
            </div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium">
              {props.commentCount.toLocaleString("en")}
            </div>
            <div className="text-muted-foreground truncate text-xs">
              Comments
            </div>
          </div>
        </div>

        {/* Action Button */}
        {/* <Button className="w-full" size="sm">
          <Play className="mr-2 h-4 w-4" />
          {isCompleted ? "Retake Test" : "Start Test"}
        </Button> */}
      </CardContent>
      <CardAction className="w-full px-5">
        <RelativeLink href={`${props.id}`}>
          <Button variant={"outline"} className="w-full">
            Details
          </Button>
        </RelativeLink>
      </CardAction>
    </Card>
  );
}
