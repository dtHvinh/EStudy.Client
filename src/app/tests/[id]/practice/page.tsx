"use client";

import MainLayout from "@/components/layouts/MainLayout";
import { TestResultsPage } from "@/components/test-taking/test-results-page";
import { TestTakingPage } from "@/components/test-taking/test-taking-page";
import api from "@/components/utils/requestUtils";
import useGetTest from "@/hooks/use-get-test";
import { UserAnswer } from "@/hooks/use-test-taking";
import { calculateEarnedPoints } from "@/stores/use-test-results";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { test } = useGetTest(id);
  const [tabIndex, setTabIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const router = useRouter();

  const handleSubmit = async (answers: UserAnswer[], timeSpent: number) => {
    if (!test)
      return toast.error("Test data is not available. Please try again later.");

    setUserAnswers(answers);
    setTimeSpent(timeSpent);
    setTabIndex(1);

    try {
      await api.post(`/api/tests/${id}/attempts`, {
        timeSpent,
        answerSelections: answers,
        earnedPoints: calculateEarnedPoints(test, answers),
      });
      toast.success("Your attempt has been saved recorded!");
    } catch {
      toast.error("Failed to save your test attempt. Please try again later.");
    }
  };

  return (
    <MainLayout>
      {tabIndex === 0 && test && (
        <TestTakingPage testData={test} onSubmit={handleSubmit} />
      )}
      {tabIndex === 1 && test && (
        <TestResultsPage
          testData={test}
          userAnswers={userAnswers}
          timeSpent={timeSpent}
          onBackToTests={() => router.push(`/tests/${id}`)}
          onRetakeTest={() => setTabIndex(0)}
        />
      )}
    </MainLayout>
  );
}
