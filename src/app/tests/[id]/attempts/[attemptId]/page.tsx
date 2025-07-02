"use client";

import MainLayout from "@/components/layouts/MainLayout";
import NavigateBack from "@/components/navigate-back";
import { TestResultsPage } from "@/components/test-taking/test-results-page";
import useGetTest from "@/hooks/use-get-test";
import useTestAttemptDetails from "@/hooks/use-test-attempt-details";
import { use } from "react";

export default function ({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const { id, attemptId } = use(params);
  const { test } = useGetTest(id);
  const { attempt } = useTestAttemptDetails(id, attemptId);

  return (
    test &&
    attempt && (
      <MainLayout>
        <div className="container mx-auto max-w-6xl space-y-5">
          <div>
            <NavigateBack fallbackUrl={`/tests/${id}`} />
          </div>
          <TestResultsPage
            testData={test}
            userAnswers={attempt.answerSelections}
            timeSpent={attempt.timeSpent}
          />
        </div>
      </MainLayout>
    )
  );
}
