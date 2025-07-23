"use client";

import MainLayout from "@/components/layouts/MainLayout";
import Loading from "@/components/loading";
import NavigateBack from "@/components/navigate-back";
import TestCard from "@/components/test-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import H3 from "@/components/ui/h3";
import api from "@/components/utils/requestUtils";
import { IconFileText } from "@tabler/icons-react";
import { use, useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export interface GetCollectionContentResponse {
  id: string;
  name: string;
  description?: string;
  tests: GetCollectionContentTestResponse[];
}

export interface GetCollectionContentTestResponse {
  id: string;
  title: string;
  description: string;
  duration: number;
  authorName: string;

  sectionCount: number;
  attemptCount: number;
  commentCount: number;
  questionCount: number;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error } = useSWR<GetCollectionContentResponse>(
    `/api/tests/test-collections/${id}`,
    api.get,
  );

  useEffect(() => {
    if (isLoading) {
      toast.message(<Loading text="Loading Collection" />, { id: "eeeee" });
    } else {
      toast.dismiss("eeeee");
    }
  }, [isLoading]);

  return (
    <MainLayout>
      <div className="container mx-auto px-8">
        {error && (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="space-y-2">
                <p className="font-medium text-red-500">
                  Failed to load collection
                </p>
                <p className="text-muted-foreground text-sm">
                  Please try again later or check your connection.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {data && !isLoading && (
          <div className="space-y-6">
            {/* Collection Header */}
            <NavigateBack fallbackUrl={`/test-collections`} />
            <div className="space-y-2">
              <H3>{data.name}</H3>
              {data.description && (
                <p className="text-muted-foreground text-lg">
                  {data.description}
                </p>
              )}
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <IconFileText className="h-3 w-3" />
                  {data.tests.length} Test{data.tests.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>

            {/* Tests Grid */}
            {data.tests.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {data.tests.map((test) => (
                  <TestCard key={test.id} {...test} />
                ))}
              </div>
            ) : (
              <Card className="border-0">
                <CardContent className="pt-6 text-center">
                  <IconFileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">
                    No tests in this collection yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
