"use client";

import { Button } from "@/components/ui/button";
import { Download, Save, Settings, Upload } from "lucide-react";
import type React from "react";

interface TestHeaderProps {
  isTestValid: boolean;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function TestHeader({
  isTestValid,
  onImport,
  onExport,
  onSaveDraft,
  onPublish,
}: TestHeaderProps) {
  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create Test</h1>
            <p className="text-muted-foreground">
              Design and customize your test with multiple sections and
              questions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
              id="import-test"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("import-test")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={onSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button size="sm" onClick={onPublish} disabled={!isTestValid}>
              <Settings className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
