"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { GetMyCourseType } from "@/hooks/use-get-my-course";
import { useStorage } from "@/hooks/use-storage";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Globe,
  GraduationCap,
  Users,
} from "lucide-react";
import { useState } from "react";
import RelativeLink from "../relative-link";

interface CourseCardProps {
  course: GetMyCourseType;
  onEnroll?: (courseId: number) => void;
  onViewDetails?: (courseId: number) => void;
  showActions?: boolean;
  compact?: boolean;
  isReadonly?: boolean;
}

export function CourseCard({
  course,
  onEnroll,
  onViewDetails,
  showActions = true,
  compact = false,
  isReadonly = false,
}: CourseCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { getFilePath } = useStorage();

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}min`;
    }
    return hours === 1 ? "1 hour" : `${hours} hours`;
  };

  const formatPrerequisites = (prerequisites?: string) => {
    if (!prerequisites) return [];
    return prerequisites.split("\n").filter((item) => item.trim());
  };

  const formatObjectives = (objectives?: string) => {
    if (!objectives) return [];
    return objectives.split("\n").filter((item) => item.trim());
  };

  return (
    <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={
              course.imageUrl
                ? getFilePath(course.imageUrl)
                : "https://picsum.photos/seed/picsum/352/192"
            }
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={getDifficultyColor(course.difficultyLevel)}>
              <GraduationCap className="mr-1 h-3 w-3" />
              {course.difficultyLevel}
            </Badge>
            {!course.isPublished && <Badge variant="secondary">Draft</Badge>}
          </div>
          <div className="absolute top-3 right-3">
            {course.isFree ? (
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                Free
              </Badge>
            ) : (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                <DollarSign className="mr-1 h-3 w-3" />${course.price}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="group-hover:text-primary line-clamp-2 text-lg font-semibold transition-colors">
              {course.title}
            </h3>
            <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">
              {course.description}
            </p>
          </div>

          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(course.estimatedDurationHours)}
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              {course.language}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">{course.studentsCount} enrolled</span>
            </div>
          </div>

          {!compact &&
            (formatPrerequisites(course.prerequisites).length > 0 ||
              formatObjectives(course.learningObjectives).length > 0) && (
              <Collapsible open={showDetails} onOpenChange={setShowDetails}>
                <CollapsibleTrigger className="hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors">
                  {showDetails ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  Course Details
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-3">
                  {formatPrerequisites(course.prerequisites).length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium">
                        Prerequisites
                      </h4>
                      <ul className="text-muted-foreground space-y-1 text-sm">
                        {formatPrerequisites(course.prerequisites).map(
                          (prereq, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="bg-muted-foreground mt-2 h-1 w-1 flex-shrink-0 rounded-full" />
                              {prereq}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {formatObjectives(course.learningObjectives).length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium">
                        Learning Objectives
                      </h4>
                      <ul className="text-muted-foreground space-y-1 text-sm">
                        {formatObjectives(course.learningObjectives).map(
                          (objective, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="bg-muted-foreground mt-2 h-1 w-1 flex-shrink-0 rounded-full" />
                              {objective}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}
        </div>
      </CardContent>

      {showActions && (
        <>
          <Separator />
          <CardFooter className="px-5 pt-0">
            <div className="flex w-full gap-2">
              {onViewDetails ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails?.(course.id!)}
                  className="flex-1"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="flex-1">
                  <RelativeLink
                    href={`${course.id}`}
                    className="items-centercourse.id flex"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Details
                  </RelativeLink>
                </Button>
              )}
              {isReadonly ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => onEnroll?.(course.id!)}
                    className="flex-1"
                    disabled={!course.isPublished}
                  >
                    {course.isFree ? "Enroll Free" : "Enroll Now"}
                  </Button>
                </>
              ) : (
                <Button size={"sm"} asChild>
                  <RelativeLink href={`/builder/${course.id}/structure`}>
                    Edit Course
                  </RelativeLink>
                </Button>
              )}
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
