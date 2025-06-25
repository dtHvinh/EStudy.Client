"use client";

import type React from "react";

import MainLayout from "@/components/layouts/MainLayout";
import { TestHeader } from "@/components/test-builder/test-header";
import { TestInformation } from "@/components/test-builder/test-information";
import { TestPreview } from "@/components/test-builder/test-preview";
import { TestSections } from "@/components/test-builder/test-sections";
import { TestSettings } from "@/components/test-builder/test-settings";
import { TestStats } from "@/components/test-builder/test-stats";
import { ValidationErrors } from "@/components/test-builder/validation-errors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateTest } from "@/hooks/use-create-test";
import { useState } from "react";

export default function CreateTestPage() {
  const {
    test,
    settings,
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
    updateSettings,
    getTotalQuestions,
    getTotalPoints,
    getAverageTimePerQuestion,
    getSectionStats,
    validateTest,
    isTestValid,
    exportTest,
    importTest,
  } = useCreateTest();

  const [activeTab, setActiveTab] = useState("builder");
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const handleSaveDraft = () => {
    const testData = exportTest();
    // Here you would typically save to your backend
    console.log("Saving draft:", testData);

    // For demo purposes, save to localStorage
    localStorage.setItem("test-draft", JSON.stringify(testData));
    alert("Draft saved successfully!");
  };

  const handlePublish = () => {
    const errors = validateTest();
    if (errors.length > 0) {
      setShowValidationErrors(true);
      return;
    }

    const testData = exportTest();
    // Here you would typically publish to your backend
    console.log("Publishing test:", testData);
    alert("Test published successfully!");
  };

  const handleExport = () => {
    const testData = exportTest();
    const blob = new Blob([JSON.stringify(testData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${test.title || "test"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const success = importTest(data);
        if (success) {
          alert("Test imported successfully!");
        } else {
          alert("Failed to import test. Please check the file format.");
        }
      } catch (error) {
        alert("Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  const validationErrors = validateTest();

  return (
    <MainLayout>
      <TestHeader
        isTestValid={isTestValid()}
        onImport={handleImport}
        onExport={handleExport}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />

      <div className="container mx-auto px-4 py-6">
        <ValidationErrors
          errors={validationErrors}
          show={showValidationErrors}
        />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="builder">Test Builder</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <TestInformation
              title={test.title}
              description={test.description}
              duration={test.duration}
              onUpdateTitle={(title) => updateTest("title", title)}
              onUpdateDescription={(description) =>
                updateTest("description", description)
              }
              onUpdateDuration={(duration) => updateTest("duration", duration)}
            />{" "}
            <TestStats
              sectionsCount={test.sections.length}
              totalQuestions={getTotalQuestions()}
              totalPoints={getTotalPoints()}
              duration={test.duration}
              averageTimePerQuestion={getAverageTimePerQuestion()}
            />
            <TestSections
              sections={test.sections}
              onResetTest={resetTest}
              onAddSection={addSection}
              onUpdateSection={updateSection as any}
              onDeleteSection={deleteSection}
              onDuplicateSection={duplicateSection}
              onToggleSection={toggleSection}
              onAddQuestion={addQuestion as any}
              onUpdateQuestion={updateQuestion as any}
              onDeleteQuestion={deleteQuestion}
              onDuplicateQuestion={duplicateQuestion}
              onUpdateAnswer={updateAnswer as any}
              onSetCorrectAnswer={setCorrectAnswer}
              onAddAnswerOption={addAnswerOption}
              onRemoveAnswerOption={removeAnswerOption}
              getSectionStats={getSectionStats}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <TestSettings
              passingScore={test.passingScore}
              maxAttempts={settings.maxAttempts}
              shuffleQuestions={settings.shuffleQuestions}
              showResultsImmediately={settings.showResultsImmediately}
              onUpdatePassingScore={(score) =>
                updateTest("passingScore", score)
              }
              onUpdateMaxAttempts={(attempts) =>
                updateSettings("maxAttempts", attempts)
              }
              onUpdateShuffleQuestions={(shuffle) =>
                updateSettings("shuffleQuestions", shuffle)
              }
              onUpdateShowResultsImmediately={(show) =>
                updateSettings("showResultsImmediately", show)
              }
            />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <TestPreview
              title={test.title}
              description={test.description}
              duration={test.duration}
              sections={test.sections}
              getTotalQuestions={getTotalQuestions}
              getTotalPoints={getTotalPoints}
              getAverageTimePerQuestion={getAverageTimePerQuestion}
              getSectionStats={getSectionStats}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
