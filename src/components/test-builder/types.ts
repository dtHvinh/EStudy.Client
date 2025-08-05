export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: "single-choice" | "multiple-choice";
  text: string;
  points: number;
  answers: Answer[];
  explanation?: string;
  audioUrl?: string;
}

export interface QuestionUpdateHandler {
  (
    sectionId: string,
    questionId: string,
    field: keyof Question,
    value: any,
  ): void;
}

export interface AnswerUpdateHandler {
  (
    sectionId: string,
    questionId: string,
    answerId: string,
    field: keyof Answer,
    value: string,
  ): void;
}
