"use client";

import { ErrorCard } from "@/components/error-card";
import MainLayout from "@/components/layouts/MainLayout";
import NavigateBack from "@/components/navigate-back";
import {
  RelatedTests,
  TestComments,
  TestHeader,
  TestSections,
  TestStatsGrid,
} from "@/components/test-detail";
import useTestDetail from "@/hooks/use-test-details";
import { use, useEffect } from "react";
import { toast } from "sonner";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {
    details,
    isTestLoading,
    getTestError,
    sendComment,
    deleteComment,
    loadMoreComments,
  } = useTestDetail(id);

  useEffect(() => {
    if (isTestLoading) {
      toast.loading("Loading test details...", {
        id: "test-loading",
      });
    } else {
      toast.dismiss("test-loading");
    }
  }, [isTestLoading]);

  if (!isTestLoading && getTestError) {
    return (
      <MainLayout>
        <ErrorCard
          title="Failed to load test details"
          message="Please try again later."
        />
      </MainLayout>
    );
  }

  return (
    details && (
      <MainLayout>
        <div className="container mx-auto max-w-6xl space-y-5 px-4">
          {/* Header Section */}
          <NavigateBack />
          <TestHeader
            testId={details.id}
            title={details.title}
            description={details.description}
          />

          {/* Stats Grid */}
          <TestStatsGrid
            duration={details.duration}
            questionCount={details.questionCount}
            attemptCount={details.attemptCount}
            commentCount={details.commentCount}
          />

          <div className="space-y-8">
            {/* Main Content */}
            <div className="space-y-8">
              {/* Test Sections */}
              <TestSections
                sections={details.sections}
                sectionCount={details.sectionCount}
              />

              {/* Comments Section */}
              <TestComments
                onScrollToBottom={loadMoreComments}
                onSendComment={sendComment}
                onDeleteComment={deleteComment}
                comments={details.comments}
                commentCount={details.commentCount}
              />

              {/* <TestSidebar /> */}
            </div>
          </div>

          <RelatedTests testId={details.id} />
        </div>
      </MainLayout>
    )
  );
}
