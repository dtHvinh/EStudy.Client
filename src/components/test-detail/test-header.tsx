"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Star } from "lucide-react";
import RelativeLink from "../relative-link";

interface TestHeaderProps {
  testId: string | number;
  title: string;
  description?: string;
  isFeatured?: boolean;
}

export function TestHeader({
  testId,
  title,
  description,
  isFeatured,
}: TestHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            {isFeatured && (
              <Badge variant="outline" className="text-xs">
                <Star className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>

          <h1 className="mb-4 text-3xl leading-tight font-bold lg:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Button className="flex items-center gap-2" size="lg">
            <RelativeLink className="flex items-center gap-2" href="practice">
              <Play className="h-4 w-4" />
              Start practice
            </RelativeLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
