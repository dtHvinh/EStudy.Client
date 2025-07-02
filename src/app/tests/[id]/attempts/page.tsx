"use client";

import MainLayout from "@/components/layouts/MainLayout";
import NavigateBack from "@/components/navigate-back";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useMyTestAttempts from "@/hooks/use-my-test-attempts";
import dayjs from "dayjs";
import { AlertCircle, Clock, Loader2, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { ref, inView } = useInView();
  const router = useRouter();
  const { attempts, isLoading, error, scrollNext } = useMyTestAttempts({
    testId: id,
    pageSize: 10,
  });
  useEffect(() => {
    if (inView) {
      scrollNext();
    }
  }, [inView]);

  const formatTime = (seconds: number): string => {
    const duration = dayjs.duration(seconds, "seconds");
    const minutes = Math.floor(duration.asMinutes());
    const remainingSeconds = duration.seconds();
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string): string => {
    return dayjs(dateString).format("MMM D, YYYY, h:mm A");
  };

  const getRelativeTime = (dateString: string): string => {
    return dayjs(dateString).fromNow();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="mx-auto w-full max-w-6xl p-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">Loading test attempts...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl p-6">
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="text-destructive mb-4 h-12 w-12" />
            <h3 className="text-destructive mb-2 text-lg font-semibold">
              Error Loading Test Attempts
            </h3>
            <p className="text-muted-foreground text-center">
              {error.message ||
                "Something went wrong while loading your test attempts."}
            </p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
        <NavigateBack label="Back to Test" fallbackUrl={`/tests/${id}`} />
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Test Attempts</h1>
            <p className="text-muted-foreground">
              View and manage your test attempt history{" "}
              {attempts?.length ? `(${attempts.length} attempts)` : ""}
            </p>
          </div>
        </div>

        {attempts && attempts.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Test Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">
                        <div className="flex items-center gap-2">No.</div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          Time Spent
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          Points Earned
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          Submit Date
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attempts.map((attempt, index) => (
                      <TableRow key={attempt.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="text-muted-foreground h-4 w-4" />
                            <span className="font-medium">
                              {formatTime(attempt.timeSpent)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={"outline"}>
                            {attempt.earnedPoints} pts
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {formatDate(attempt.submitDate)}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {getRelativeTime(attempt.submitDate)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              router.push(
                                `/tests/${id}/attempts/${attempt.id}`,
                              );
                            }}
                          >
                            View Attempt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow ref={ref} />
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                No test attempts yet
              </h3>
              <p className="text-muted-foreground text-center">
                Your test attempts will appear here once you start taking tests.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
