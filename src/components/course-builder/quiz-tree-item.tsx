"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useEditCourseStructure,
  type CourseQuiz,
} from "@/hooks/use-edit-course-structure";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  HelpCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useShallow } from "zustand/react/shallow";

interface QuizTreeItemProps {
  quiz: CourseQuiz;
  chapterIndex: number;
  quizIndex: number;
  isExpanded?: boolean;
  onToggle?: () => void;
  dragHandleProps?: any;
}

export function QuizTreeItem({
  quiz,
  chapterIndex,
  quizIndex,
  isExpanded = false,
  onToggle,
  dragHandleProps,
}: QuizTreeItemProps) {
  const {
    updateQuiz,
    deleteQuiz,
    addQuizQuestion,
    updateQuizQuestion,
    deleteQuizQuestion,
  } = useEditCourseStructure(
    useShallow((state) => ({
      updateQuiz: state.updateQuiz,
      deleteQuiz: state.deleteQuiz,
      addQuizQuestion: state.addQuizQuestion,
      updateQuizQuestion: state.updateQuizQuestion,
      deleteQuizQuestion: state.deleteQuizQuestion,
    })),
  );

  const debouncedUpdateTitle = useDebouncedCallback((value: string) => {
    updateQuiz(chapterIndex, quizIndex, { title: value });
  }, 500);

  const debouncedUpdateDescription = useDebouncedCallback((value: string) => {
    updateQuiz(chapterIndex, quizIndex, { description: value });
  }, 500);

  const debouncedUpdateQuestion = useDebouncedCallback(
    (questionIndex: number, field: string, value: string) => {
      updateQuizQuestion(chapterIndex, quizIndex, questionIndex, {
        [field]: value,
      });
    },
    500,
  );

  const updateQuestionOption = (
    questionIndex: number,
    optionIndex: number,
    text: string,
  ) => {
    const question = quiz.questions[questionIndex];
    const newOptions = [...question.options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], text };
    updateQuizQuestion(chapterIndex, quizIndex, questionIndex, {
      options: newOptions,
    });
  };

  const toggleCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    const question = quiz.questions[questionIndex];
    const newOptions = question.options.map((option, index) => ({
      ...option,
      isCorrect: index === optionIndex,
    }));
    updateQuizQuestion(chapterIndex, quizIndex, questionIndex, {
      options: newOptions,
    });
  };

  const addQuestionOption = (questionIndex: number) => {
    const question = quiz.questions[questionIndex];
    const newOptions = [...question.options, { text: "", isCorrect: false }];
    updateQuizQuestion(chapterIndex, quizIndex, questionIndex, {
      options: newOptions,
    });
  };

  const removeQuestionOption = (questionIndex: number, optionIndex: number) => {
    const question = quiz.questions[questionIndex];
    if (question.options.length <= 2) return; // Minimum 2 options required

    const newOptions = question.options.filter(
      (_, index) => index !== optionIndex,
    );
    updateQuizQuestion(chapterIndex, quizIndex, questionIndex, {
      options: newOptions,
    });
  };

  return (
    <div className="group">
      <div className="hover:bg-muted/30 flex items-start gap-2 rounded-lg py-2 transition-colors">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            {...dragHandleProps}
            className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          >
            <GripVertical className="text-muted-foreground h-4 w-4" />
          </div>

          <Collapsible
            open={isExpanded}
            onOpenChange={onToggle}
            className="flex-1"
          >
            <div className="flex flex-1 items-center gap-2">
              <CollapsibleTrigger className="hover:bg-muted/50 -ml-1 flex items-center gap-2 rounded-md p-1">
                {isExpanded ? (
                  <ChevronDown className="text-muted-foreground h-4 w-4" />
                ) : (
                  <ChevronRight className="text-muted-foreground h-4 w-4" />
                )}
              </CollapsibleTrigger>

              <div className="flex min-w-0 flex-1 items-center gap-2">
                <HelpCircle className="h-4 w-4 flex-shrink-0 text-blue-600" />
                <div className="min-w-0 flex-1">
                  <Input
                    defaultValue={quiz.title}
                    onChange={(e) => debouncedUpdateTitle(e.target.value)}
                    placeholder="Quiz title"
                    spellCheck="false"
                    className="border-none bg-transparent p-0 text-sm font-medium focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-muted-foreground bg-muted rounded-full px-2 py-1 text-xs">
                  {quiz.questions.length} question
                  {quiz.questions.length !== 1 ? "s" : ""}
                </span>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this quiz and all its
                        questions. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteQuiz(chapterIndex, quizIndex)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <CollapsibleContent>
              <div className="border-muted mt-3 ml-6 space-y-4 border-l-2 pl-4">
                {/* Quiz Description */}
                <div>
                  <Label
                    htmlFor={`quiz-description-${quizIndex}`}
                    className="text-xs"
                  >
                    Description
                  </Label>
                  <Textarea
                    id={`quiz-description-${quizIndex}`}
                    defaultValue={quiz.description}
                    onChange={(e) => debouncedUpdateDescription(e.target.value)}
                    placeholder="Describe what this quiz covers"
                    rows={2}
                    className="text-sm"
                  />
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {quiz.questions.map((question, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="space-y-3 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          Question {questionIndex + 1}
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            deleteQuizQuestion(
                              chapterIndex,
                              quizIndex,
                              questionIndex,
                            )
                          }
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <Input
                        defaultValue={question.text}
                        onChange={(e) =>
                          debouncedUpdateQuestion(
                            questionIndex,
                            "text",
                            e.target.value,
                          )
                        }
                        placeholder="Enter your question"
                        className="text-sm"
                      />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Answer Options</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addQuestionOption(questionIndex)}
                            className="text-muted-foreground hover:text-foreground h-6 text-xs"
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Add Option
                          </Button>
                        </div>

                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="radio"
                              name={`question-${chapterIndex}-${quizIndex}-${questionIndex}`}
                              checked={option.isCorrect}
                              onChange={() =>
                                toggleCorrectAnswer(questionIndex, optionIndex)
                              }
                              className="text-primary"
                            />
                            <Input
                              defaultValue={option.text}
                              onChange={(e) =>
                                updateQuestionOption(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value,
                                )
                              }
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1 text-sm"
                            />
                            {question.options.length > 2 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeQuestionOption(
                                    questionIndex,
                                    optionIndex,
                                  )
                                }
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="ghost"
                    onClick={() => addQuizQuestion(chapterIndex, quizIndex)}
                    className="text-muted-foreground hover:text-foreground h-8 w-full justify-start text-xs"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add Question
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
