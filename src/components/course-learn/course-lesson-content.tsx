import { GetCourseToLearnLessonResponse } from "@/hooks/use-learn-course";
import useStorageV2 from "@/hooks/use-storage-v2";
import { FileText } from "lucide-react";
import HTMLContent from "../html-content";
import { Badge } from "../ui/badge";
import H3 from "../ui/h3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import VideoPlayer from "../video/video-player";
import CourseLessonNote from "./course-lesson-note";
import CourseRatings from "./course-rating";

export type CourseLessonContentEventProps = {
  onLessonCompleted?: (lessonId: number) => void;
  onCourseRated?: (rating: number, review: string) => void;
};

export default function CourseLessonContent({
  lesson,
  courseId,
  onLessonCompleted,
  onNoteSaved,
  onCourseRated,
}: {
  lesson?: GetCourseToLearnLessonResponse;
  courseId: string;
  onNoteSaved?: (lessonId: number, content: string) => void;
} & CourseLessonContentEventProps) {
  const { getFileUrl } = useStorageV2();

  return (
    <div>
      {/* Video/Content Player */}
      {lesson && (
        <div className="relative overflow-hidden bg-black">
          {lesson.videoUrl ? (
            <VideoPlayer
              src={getFileUrl(lesson.videoUrl)}
              transcriptSrc={
                lesson.transcriptUrl && getFileUrl(lesson.transcriptUrl)
              }
              width="100%"
              height="100%"
              controls={true}
              onEnded={() => {
                onLessonCompleted?.(lesson.id);
              }}
            />
          ) : (
            <div className="bg-muted flex h-full items-center justify-center">
              <div className="p-8 text-center">
                <FileText className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h2 className="mb-2 text-2xl font-bold">{lesson.title}</h2>
                <Badge variant="secondary">Text Lesson</Badge>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Tabs */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Tabs defaultValue="overview">
            <TabsList className="mx-auto w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                {lesson && (
                  <div className="space-y-4">
                    <H3 className="font-bold">{lesson.title}</H3>
                    {lesson.description && (
                      <div>
                        <h2 className="mb-5 text-xl font-semibold">
                          Description
                        </h2>
                        <HTMLContent content={lesson.description} />
                      </div>
                    )}
                    {lesson.content && (
                      <div className="prose max-w-none">
                        <h2 className="text-xl font-semibold">Lecture</h2>
                        <HTMLContent content={lesson.content} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              {lesson && (
                <CourseLessonNote lesson={lesson} onNoteSaved={onNoteSaved} />
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <CourseRatings
                courseId={courseId}
                onCourseRated={onCourseRated}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
