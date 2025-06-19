"use client";

import type React from "react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  className?: string;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  title,
  description,
  className,
}: OnboardingLayoutProps) {
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className={cn("w-full max-w-2xl space-y-8", className)}>
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progressValue)}% complete</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        {/* Content */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
