"use client";

import type React from "react";

import MainLayout from "@/components/layouts/MainLayout";
import { TestHeader } from "@/components/test-builder/test-header";
import { TestInformation } from "@/components/test-builder/test-information";
import TestPreview from "@/components/test-builder/test-preview";
import { TestSection } from "@/components/test-builder/test-section";
import TestStatistic from "@/components/test-builder/test-stats";
import { ValidationErrors } from "@/components/test-builder/validation-errors";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/components/utils/requestUtils";
import { useCreateTest } from "@/hooks/use-create-test";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateTestPage() {
  const {
    test,
    updateTest,
    resetTest,
    addSection,
    updateSection,
    deleteSection,
    duplicateSection,
    toggleSection,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    updateAnswer,
    setCorrectAnswer,
    addAnswerOption,
    removeAnswerOption,
    getTotalQuestions,
    getTotalPoints,
    getAverageTimePerQuestion,
    getSectionStats,
    validateTest,
    isTestValid,
    exportTest,
    importTest,
  } = useCreateTest();

  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const router = useRouter();
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          importTest(data);
        } catch (error) {
          console.error("Failed to import test:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const data = exportTest();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${test.title || "test"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePublish = async () => {
    if (isTestValid()) {
      try {
        await api.post("/api/tests", test);
        toast.success("Test published successfully!");
        router.push("/tests");
      } catch (error) {
        console.error("Failed to publish test:", error);
        toast.error("Failed to publish test.");
        setShowValidationErrors(true);
      }
    } else {
      toast.error("Please fix validation errors before publishing.");
      setShowValidationErrors(true);
    }
  };

  const saveLocalStorage = () => {
    localStorage.setItem("test", JSON.stringify(test));
  };

  const validationErrors = validateTest();
  const singleChoiceCount = test.sections.reduce(
    (total, section) =>
      total +
      section.questions.filter((q) => q.type === "single-choice").length,
    0,
  );
  const multipleChoiceCount = test.sections.reduce(
    (total, section) =>
      total +
      section.questions.filter((q) => q.type === "multiple-choice").length,
    0,
  );

  return (
    <MainLayout>
      {/* Header */}
      <TestHeader
        isTestValid={isTestValid()}
        onImport={handleImport}
        onExport={handleExport}
        onSaveDraft={saveLocalStorage}
        onPublish={handlePublish}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <ValidationErrors
              errors={validationErrors}
              show={showValidationErrors}
            />

            <TestInformation
              title={test.title}
              description={test.description}
              duration={test.duration}
              onUpdateTitle={(title) => updateTest("title", title)}
              onUpdateDescription={(description) =>
                updateTest("description", description)
              }
              onUpdateDuration={(duration) => updateTest("duration", duration)}
            />

            {/* Test Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Test Sections</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={resetTest}>
                    Reset All
                  </Button>
                  <Button onClick={addSection}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </div>
              </div>

              {test.sections.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground mb-4">
                      <p className="text-lg font-medium">
                        No sections created yet
                      </p>
                      <p className="text-sm">
                        Create your first section to start building your test
                      </p>
                    </div>
                    <Button onClick={addSection} size="lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Section
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {test.sections.map((section, sectionIndex) => (
                    <TestSection
                      key={section.id}
                      section={section}
                      sectionIndex={sectionIndex}
                      sectionStats={getSectionStats(section.id)}
                      onUpdateSection={updateSection}
                      onDeleteSection={deleteSection}
                      onDuplicateSection={duplicateSection}
                      onToggleSection={toggleSection}
                      onAddQuestion={addQuestion}
                      onUpdateQuestion={updateQuestion}
                      onDeleteQuestion={deleteQuestion}
                      onDuplicateQuestion={duplicateQuestion}
                      onUpdateAnswer={updateAnswer}
                      onSetCorrectAnswer={setCorrectAnswer}
                      onAddAnswerOption={addAnswerOption}
                      onRemoveAnswerOption={removeAnswerOption}
                    />
                  ))}
                  <Button className="w-full" onClick={addSection}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-1rem)] lg:overflow-y-auto lg:pr-2">
              <TestStatistic
                test={test}
                singleChoiceCount={singleChoiceCount}
                multipleChoiceCount={multipleChoiceCount}
                getTotalQuestions={getTotalQuestions}
                getTotalPoints={getTotalPoints}
                getAverageTimePerQuestion={getAverageTimePerQuestion}
              />

              {/* Test Preview */}
              <TestPreview
                test={test}
                getTotalQuestions={getTotalQuestions}
                getTotalPoints={getTotalPoints}
                getSectionStats={getSectionStats}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
