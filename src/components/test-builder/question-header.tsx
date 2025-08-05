"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  Circle,
  Copy,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { QuestionUpdateHandler } from "./types";

interface QuestionHeaderProps {
  questionIndex: number;
  questionType: "single-choice" | "multiple-choice";
  points: number;
  sectionId: string;
  questionId: string;
  onUpdateQuestion: QuestionUpdateHandler;
  onDeleteQuestion: (sectionId: string, questionId: string) => void;
  onDuplicateQuestion: (sectionId: string, questionId: string) => void;
}

export function QuestionHeader({
  questionIndex,
  questionType,
  points,
  sectionId,
  questionId,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
}: QuestionHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="flex items-center gap-1">
          {questionType === "single-choice" ? (
            <Circle className="h-4 w-4 text-blue-500" />
          ) : (
            <CheckSquare className="h-4 w-4 text-green-500" />
          )}
          Q{questionIndex + 1}
        </Badge>
        <Select
          value={questionType}
          onValueChange={(value) =>
            onUpdateQuestion(sectionId, questionId, "type", value)
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single-choice">
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-blue-500" />
                Single Choice
              </div>
            </SelectItem>
            <SelectItem value="multiple-choice">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-green-500" />
                Multiple Choice
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <Badge
          variant={questionType === "single-choice" ? "default" : "secondary"}
          className={cn(
            "text-white",
            questionType === "single-choice" ? "bg-blue-500" : "bg-green-500",
          )}
        >
          {questionType === "single-choice"
            ? "Single Choice"
            : "Multiple Choice"}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Label className="text-xs">Points:</Label>
          <Input
            clearable={false}
            type="number"
            className="h-8 w-16"
            value={points}
            min="1"
            onChange={(e) =>
              onUpdateQuestion(
                sectionId,
                questionId,
                "points",
                Math.max(1, Number.parseInt(e.target.value) || 1),
              )
            }
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => onDuplicateQuestion(sectionId, questionId)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate Question
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteQuestion(sectionId, questionId)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Question
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
