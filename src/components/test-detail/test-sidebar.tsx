"use client";

import { RelatedTests } from "./related-tests";
import { TestOverview } from "./test-overview";
import { TestPrerequisites } from "./test-prerequisites";

export function TestSidebar() {
  return (
    <div className="space-y-6">
      <TestOverview />
      <TestPrerequisites />
      <RelatedTests />
    </div>
  );
}
