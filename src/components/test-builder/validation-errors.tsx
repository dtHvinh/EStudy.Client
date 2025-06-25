"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ValidationErrorsProps {
  errors: string[];
  show: boolean;
}

export function ValidationErrors({ errors, show }: ValidationErrorsProps) {
  if (!show || errors.length === 0) return null;

  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-1">
          <p className="font-medium">
            Please fix the following issues before publishing:
          </p>
          <ul className="list-inside list-disc space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
}
