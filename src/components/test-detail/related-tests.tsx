"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import DataErrorAlert from "../data-error-alert";
import api from "../utils/requestUtils";

interface RelatedTest {
  id: string;
  title: string;
  questionCount: number;
  duration: number;
  description?: string;
}

export function RelatedTests({ testId }: { testId?: string | number }) {
  const {
    data: relatedTestsData,
    isLoading,
    error,
  } = useSWR<RelatedTest[]>(`/api/tests/${testId}/related?size=3`, api.get);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related Tests</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {relatedTestsData?.map((test) => (
          <div
            key={test.id}
            className="hover:bg-muted/50 cursor-pointer rounded-lg border p-4 transition-colors"
          >
            <h4 className="mb-1 font-medium">{test.title}</h4>
            <p className="text-muted-foreground line-clamp-1 text-sm">
              {test.description || "No description available"}
            </p>
            <p className="text-muted-foreground">
              {test.questionCount} questions • {test.duration} min
            </p>
          </div>
        ))}
        {isLoading && <p className="text-muted-foreground">Loading...</p>}
        {error && <DataErrorAlert title="Failed to load related tests" />}
        {relatedTestsData?.length === 0 && !isLoading && !error && (
          <p className="text-muted-foreground">No related tests found</p>
        )}
      </CardContent>
    </Card>
  );
}
