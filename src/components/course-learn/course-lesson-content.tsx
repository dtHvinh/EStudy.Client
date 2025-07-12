import { GetCourseToLearnLessonResponse } from "@/hooks/use-get-course-to-learn";
import { useStorage } from "@/hooks/use-storage";
import { Download, FileText, Star } from "lucide-react";
import HTMLContent from "../html-content";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import VideoPlayer from "../video/video-player";
export default function CourseLessonContent({
  lesson,
}: {
  lesson?: GetCourseToLearnLessonResponse;
}) {
  const { getFileUrl } = useStorage();

  return (
    <div className="col-span-8">
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
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                {lesson && (
                  <div>
                    <h2 className="mb-4 text-2xl font-bold">{lesson.title}</h2>
                    <div className="prose max-w-none">
                      <HTMLContent content={lesson.content} />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add your notes for this lesson..."
                    className="min-h-[200px]"
                  />
                  <Button className="mt-4">Save Notes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Downloadable Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  {lesson && lesson.attachedFileUrls.length > 0 ? (
                    <div className="space-y-3">
                      {lesson.attachedFileUrls.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="text-muted-foreground h-5 w-5" />
                            <div className="truncate">
                              {resource.split("/").pop() || resource}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground py-8 text-center">
                      No downloadable resources available for this lesson.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Forum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 space-y-4">
                    <Textarea placeholder="Ask a question or share your thoughts..." />
                    <Button>Post Comment</Button>
                  </div>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <p className="text-muted-foreground py-8 text-center">
                      No discussions yet. Be the first to start a conversation!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center">
                    <Star className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <p className="text-muted-foreground">
                      Reviews will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
