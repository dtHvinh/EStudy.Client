"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCourseDetails } from "@/hooks/use-create-course-details";
import { useStorage } from "@/hooks/use-storage";
import { ImageIcon, Save, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import api from "../utils/requestUtils";

export function CourseHeader() {
  const { courseDetails, updateCourseDetails } = useCreateCourseDetails();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { uploadFile, getFileUrl } = useStorage({});
  const router = useRouter();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const imageUrl = await uploadFile(file, fileName);
      updateCourseDetails({ imageUrl: getFileUrl(imageUrl) });
      toast.success("Course image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!courseDetails.title.trim()) {
      toast.error("Course title is required");
      return;
    }
    if (!courseDetails.description.trim()) {
      toast.error("Course description is required");
      return;
    }

    setSubmitting(true);
    try {
      const { id } = await api.post<{ id: number }>(
        "/api/courses",
        courseDetails,
      );

      toast.success("Course created successfully!");
      router.push(`/courses/builder/${id}/structure`);
    } catch (error) {
      toast.error("Failed to create course");
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  spellCheck={false}
                  id="title"
                  value={courseDetails.title}
                  onChange={(e) =>
                    updateCourseDetails({ title: e.target.value })
                  }
                  placeholder="Enter course title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  spellCheck={false}
                  id="description"
                  value={courseDetails.description}
                  onChange={(e) =>
                    updateCourseDetails({ description: e.target.value })
                  }
                  placeholder="Describe your course"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={courseDetails.difficultyLevel}
                    onValueChange={(
                      value: "Beginner" | "Intermediate" | "Advanced",
                    ) => updateCourseDetails({ difficultyLevel: value })}
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
                    value={courseDetails.language}
                    onChange={(e) =>
                      updateCourseDetails({ language: e.target.value })
                    }
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
                    value={courseDetails.estimatedDurationHours}
                    onChange={(e) =>
                      updateCourseDetails({
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
                    value={courseDetails.price}
                    onChange={(e) =>
                      updateCourseDetails({
                        price: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    disabled={courseDetails.isFree}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="free"
                  checked={courseDetails.isFree}
                  onCheckedChange={(checked) =>
                    updateCourseDetails({
                      isFree: checked,
                      price: checked ? 0 : courseDetails.price,
                    })
                  }
                />
                <Label htmlFor="free">Free Course</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={courseDetails.isPublished}
                  onCheckedChange={(checked) =>
                    updateCourseDetails({ isPublished: checked })
                  }
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Course Image</Label>
                <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed p-2 text-center">
                  {courseDetails.imageUrl ? (
                    <div className="space-y-2">
                      <img
                        src={courseDetails.imageUrl || "/placeholder.svg"}
                        alt="Course"
                        className="mx-auto rounded-md object-cover"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                        disabled={uploading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="text-muted-foreground mx-auto h-12 w-12" />
                      <Button
                        variant="outline"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                        disabled={uploading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? "Uploading..." : "Upload Image"}
                      </Button>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="prerequisites">
                  Prerequisites (one per line)
                </Label>
                <Textarea
                  spellCheck={false}
                  id="prerequisites"
                  value={courseDetails.prerequisites || ""}
                  onChange={(e) =>
                    updateCourseDetails({ prerequisites: e.target.value })
                  }
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
                  value={courseDetails.learningObjectives || ""}
                  onChange={(e) =>
                    updateCourseDetails({ learningObjectives: e.target.value })
                  }
                  placeholder="Build a complete web application&#10;Understand modern frameworks"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={submitting || uploading}
          size="lg"
        >
          <Save className="mr-2 h-4 w-4" />
          {submitting ? "Creating Course..." : "Create Course & Continue"}
        </Button>
      </div>
    </div>
  );
}
