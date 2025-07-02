import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useMyTestAttempts, { TestAttempt } from "@/hooks/use-my-test-attempts";
import { IconList, IconStarsFilled } from "@tabler/icons-react";
import dayjs from "dayjs";
import { Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function TestAttempts({ testId }: { testId: string | number }) {
  const { attempts, isLoading, error } = useMyTestAttempts({
    testId,
    pageSize: 3,
  });

  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getBestAttempt = (attempts: TestAttempt[]) => {
    return attempts.reduce((best, current) =>
      current.earnedPoints > best.earnedPoints ? current : best,
    );
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive text-center">
            Failed to load test attempts. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">My Attempts</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/tests/${testId}/attempts`}>
                <Button size="sm" variant="ghost">
                  <IconList />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              View all your attempts for this test
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground text-xs">
          Show yours top <span className="font-bold">3</span> best attempts and
          scores
        </p>
      </CardHeader>
      <CardContent className="px-2">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded border p-2"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        ) : !attempts || attempts.length === 0 ? (
          <div className="py-6 text-center">
            <Trophy className="text-muted-foreground/50 mx-auto h-8 w-8" />
            <p className="text-muted-foreground mt-2 text-sm">
              No attempts yet.
            </p>
            <p className="text-muted-foreground text-xs">
              Take the test to see your results here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((attempt) => {
              const isBestAttempt = attempt.id === getBestAttempt(attempts).id;

              return (
                <div
                  key={attempt.id}
                  className={`relative rounded-lg border p-2 transition-colors ${
                    isBestAttempt
                      ? "border-green-200 bg-green-50"
                      : "bg-background"
                  }`}
                >
                  {isBestAttempt && attempts.length > 1 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-4 border-green-200 bg-green-100 px-1 text-xs text-green-800"
                    >
                      <Trophy className="mr-0.5 h-2 w-2" />
                      Best
                    </Badge>
                  )}

                  <Link href={`/tests/${testId}/attempts/${attempt.id}`}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="truncate">
                        {dayjs(attempt.submitDate).format(
                          "MMM DD, YYYY, HH:mm",
                        )}
                        <span className="text-muted-foreground text-sm">
                          {" "}
                          ({dayjs(attempt.submitDate).fromNow()})
                        </span>
                      </span>
                    </div>

                    <div className="text-muted-foreground grid grid-cols-2 gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        <span className="truncate">
                          Duration: {formatTimeSpent(attempt.timeSpent)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <IconStarsFilled className="h-2.5 w-2.5" />
                        Points: {attempt.earnedPoints} pts
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
