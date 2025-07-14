"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OnboardingBannerProps {
  className?: string;
}

export default function OnboardingBanner({ className }: OnboardingBannerProps) {
  return (
    <div
      className={`flex min-h-[60vh] flex-col items-center justify-center px-4 text-center ${className || ""}`}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-foreground text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
          Onboard with us before continuing
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md text-lg md:text-xl">
          Complete your onboarding process to unlock all features and get
          started with your learning journey.
        </p>
        <div className="pt-4">
          <Link href="/onboarding">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
