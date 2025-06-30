"use client";

import MainLayout from "@/components/layouts/MainLayout";
import { TestTakingPage } from "@/components/test-taking/test-taking-page";
import useGetTest from "@/hooks/use-get-test";
import { TestTakingType, UserAnswer } from "@/hooks/use-test-taking";
import { use } from "react";

// Mock data matching your C# structure
const mockTestData: TestTakingType = {
  id: 1,
  title: "Advanced JavaScript Fundamentals",
  description: "A comprehensive test covering advanced JavaScript concepts",
  duration: 120, // 90 minutes
  passingScore: 70,
  sectionCount: 3,
  questionCount: 6,
  attemptCount: 1247,
  sections: [
    {
      id: 1,
      title: "Variables and Data Types",
      description: "Understanding primitive and reference types",
      questions: [
        {
          id: 1,
          type: "multiple-choice",
          text: "Which of the following is NOT a primitive data type in JavaScript?",
          points: 2,
          answers: [
            { id: 1, text: "string", isCorrect: false },
            { id: 2, text: "number", isCorrect: false },
            { id: 3, text: "object", isCorrect: true },
            { id: 4, text: "boolean", isCorrect: false },
          ],
        },
        {
          id: 2,
          type: "single-choice",
          text: "JavaScript is a statically typed language.",
          points: 1,
          answers: [
            { id: 5, text: "True", isCorrect: false },
            { id: 6, text: "False", isCorrect: true },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Functions and Closures",
      description: "Function declarations, expressions, and closures",
      questions: [
        {
          id: 3,
          type: "multiple-choice",
          text: "What will be the output of the following code?\n\nfunction outer() {\n  let x = 10;\n  return function inner() {\n    console.log(x);\n  }\n}\nconst fn = outer();\nfn();",
          points: 3,
          answers: [
            { id: 7, text: "undefined", isCorrect: false },
            { id: 8, text: "10", isCorrect: true },
            { id: 9, text: "Error", isCorrect: false },
            { id: 10, text: "null", isCorrect: false },
          ],
        },
        // {
        //   id: 4,
        //   type: "short-answer",
        //   text: "Explain what a closure is in JavaScript and provide a simple example.",
        //   points: 5,
        //   answers: [],
        // },
      ],
    },
    {
      id: 3,
      title: "Asynchronous Programming",
      description: "Promises, async/await, and event loop",
      questions: [
        {
          id: 5,
          type: "multiple-choice",
          text: "Which method is used to handle rejected promises?",
          points: 2,
          answers: [
            { id: 11, text: ".then()", isCorrect: false },
            { id: 12, text: ".catch()", isCorrect: true },
            { id: 13, text: ".finally()", isCorrect: false },
            { id: 14, text: ".resolve()", isCorrect: false },
          ],
        },
        {
          id: 6,
          type: "single-choice",
          text: "The async/await syntax makes asynchronous code look more like synchronous code.",
          points: 1,
          answers: [
            { id: 15, text: "True", isCorrect: true },
            { id: 16, text: "False", isCorrect: false },
          ],
        },
      ],
    },
  ],
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { test } = useGetTest(id);

  const handleSubmit = (answers: UserAnswer[]) => {
    console.log("Test submitted with answers:", answers);
    // Here you would typically send the answers to your API
    alert(`Test submitted! You answered ${answers.length} questions.`);
  };

  return (
    <MainLayout>
      {test && <TestTakingPage testData={test} onSubmit={handleSubmit} />}
    </MainLayout>
  );
}
