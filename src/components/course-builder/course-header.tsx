import { useEditCourseStructure } from "@/hooks/use-edit-course-structure";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { BookOpen, ChevronDown, Minus } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

export default function CourseHeader() {
  const {
    title,
    description,
    difficultyLevel,
    price,
    isPublished,
    isFree,
    language,
    estimatedDurationHours,
    prerequisites,
    learningObjectives,
    imageUrl,
    updateDetails,
  } = useEditCourseStructure();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      className="mb-6 flex flex-col border-b pb-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="text-primary h-6 w-6" />
          <h2 className="text-2xl font-semibold">Course Details</h2>
        </div>
        <div>
          <CollapsibleTrigger>
            {isOpen ? <Minus /> : <ChevronDown />}
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input
              spellCheck={false}
              id="title"
              value={title}
              onChange={(e) => updateDetails({ title: e.target.value })}
              placeholder="Enter course title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              spellCheck={false}
              id="description"
              value={description}
              onChange={(e) => updateDetails({ description: e.target.value })}
              placeholder="Describe your course"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={difficultyLevel}
                onValueChange={(
                  value: "Beginner" | "Intermediate" | "Advanced",
                ) => updateDetails({ difficultyLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={language}
                onChange={(e) => updateDetails({ language: e.target.value })}
                placeholder="English"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Estimated Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                value={estimatedDurationHours}
                onChange={(e) =>
                  updateDetails({
                    estimatedDurationHours:
                      Number.parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) =>
                  updateDetails({
                    price: Number.parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                step="0.01"
                disabled={isFree}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="free"
              checked={isFree}
              onCheckedChange={(checked) =>
                updateDetails({
                  isFree: checked,
                  price: checked ? 0 : price,
                })
              }
            />
            <Label htmlFor="free">Free Course</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={isPublished}
              onCheckedChange={(checked) =>
                updateDetails({ isPublished: checked })
              }
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="prerequisites">Prerequisites (one per line)</Label>
            <Textarea
              spellCheck={false}
              id="prerequisites"
              value={prerequisites || ""}
              onChange={(e) => updateDetails({ prerequisites: e.target.value })}
              placeholder="Basic programming knowledge&#10;Familiarity with web development"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="objectives">
              Learning Objectives (one per line)
            </Label>
            <Textarea
              spellCheck={false}
              id="objectives"
              value={learningObjectives || ""}
              onChange={(e) =>
                updateDetails({ learningObjectives: e.target.value })
              }
              placeholder="Build a complete web application&#10;Understand modern frameworks"
              rows={3}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
