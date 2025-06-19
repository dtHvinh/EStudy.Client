"use client";

import { ProfileSkeleton } from "@/components/dashboard-skeleton";
import DataErrorAlert from "@/components/data-error-alert";
import { ErrorCard } from "@/components/error-card";
import { FlashCardSetSkeleton } from "@/components/flash-card-set";
import { FlashCardSetV2 } from "@/components/flash-card-set-v2";
import MainLayout from "@/components/layouts/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserInfoResponseType, useUserInfo } from "@/hooks/use-user-info";
import useMyFlashCardSet from "@/hooks/useMyFlashCardSet";
import { IconDots, IconStar } from "@tabler/icons-react";
import dayjs from "dayjs";
import {
  BookOpen,
  Brain,
  Clock,
  FlameIcon as Fire,
  GraduationCap,
  Play,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mockUserData = {
  totalFlashcards: 1247,
  masteredFlashcards: 892,
  studyStreak: 23,
  weeklyStudyTime: 8.5,
  coursesEnrolled: 3,
  coursesCompleted: 1,
  testAverage: 87,
  recentActivity: [
    {
      type: "flashcard",
      description: "Completed Business English set",
      time: "2 hours ago",
      score: 95,
    },
    {
      type: "course",
      description: "Finished Grammar Fundamentals lesson",
      time: "1 day ago",
      score: 88,
    },
    {
      type: "test",
      description: "Vocabulary Quiz - Advanced",
      time: "2 days ago",
      score: 92,
    },
    {
      type: "flashcard",
      description: "Studied Phrasal Verbs set",
      time: "3 days ago",
      score: 78,
    },
  ],
  courses: [
    { id: 1, name: "Grammar Fundamentals", progress: 100, status: "completed" },
    {
      id: 2,
      name: "Business Communication",
      progress: 65,
      status: "in-progress",
    },
    { id: 3, name: "Advanced Writing", progress: 20, status: "in-progress" },
  ],
};

export default function UserProfilePage() {
  const [userData, setUserData] = useState(mockUserData);
  const { user, isUserLoading, getUserError, reload } = useUserInfo();
  const masteryPercentage = Math.round(
    (userData.masteredFlashcards / userData.totalFlashcards) * 100
  );
  const courseCompletionRate = Math.round(
    (userData.coursesCompleted / userData.coursesEnrolled) * 100
  );

  // In a real app, you'd fetch data from your API here
  useEffect(() => {
    // fetch('/api/me').then(res => res.json()).then(setUserData)
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "flashcard":
        return <Brain className="h-4 w-4" />;
      case "course":
        return <BookOpen className="h-4 w-4" />;
      case "test":
        return <Target className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  if (isUserLoading) {
    return (
      <MainLayout>
        <ProfileSkeleton />
      </MainLayout>
    );
  }

  if (getUserError) {
    return (
      <MainLayout>
        <ErrorCard message="Something went wrong" onRetry={reload} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <UserData user={user} />

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Fire className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {userData.studyStreak}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Day Streak
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {userData.weeklyStudyTime}h
                      </p>
                      <p className="text-sm text-muted-foreground">This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{masteryPercentage}%</p>
                      <p className="text-sm text-muted-foreground">Mastery</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {userData.testAverage}%
                      </p>
                      <p className="text-sm text-muted-foreground">Test Avg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Flashcard Progress
                  </CardTitle>
                  <CardDescription>
                    {userData.masteredFlashcards} of {userData.totalFlashcards}{" "}
                    cards mastered
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Mastery</span>
                      <span>{masteryPercentage}%</span>
                    </div>
                    <Progress value={masteryPercentage} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Cards</p>
                      <p className="font-semibold">
                        {userData.totalFlashcards}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mastered</p>
                      <p className="font-semibold">
                        {userData.masteredFlashcards}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Course Progress
                  </CardTitle>
                  <CardDescription>
                    {userData.coursesCompleted} of {userData.coursesEnrolled}{" "}
                    courses completed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span>{courseCompletionRate}%</span>
                    </div>
                    <Progress value={courseCompletionRate} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Enrolled</p>
                      <p className="font-semibold">
                        {userData.coursesEnrolled}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Completed</p>
                      <p className="font-semibold">
                        {userData.coursesCompleted}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.recentActivity
                    .slice(0, 4)
                    .map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {activity.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={getScoreColor(activity.score)}
                        >
                          {activity.score}%
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flashcards" className="space-y-6">
            <UserFlashCards />
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Courses</h2>
              <Button>
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Courses
              </Button>
            </div>

            <div className="space-y-4">
              {userData.courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {course.name}
                          </h3>
                          <Badge
                            variant={
                              course.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {course.status === "completed"
                              ? "Completed"
                              : "In Progress"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </div>
                      <Button className="ml-4">
                        {course.status === "completed" ? "Review" : "Continue"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-2xl font-bold">Learning Activity</h2>

            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>
                  Your learning activity over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                    >
                      <div className="flex-shrink-0 p-2 rounded-full bg-muted">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${getScoreColor(
                            activity.score
                          )}`}
                        >
                          {activity.score}%
                        </p>
                        <p className="text-sm text-muted-foreground">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function UserData({ user }: { user: UserInfoResponseType | undefined }) {
  if (!user) {
    return <DataErrorAlert title="User data not found" />;
  }

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline">
                Member for {dayjs(user.creationDate).fromNow()}
              </Badge>
            </div>
          </div>
          {!user.isOnBoarded && (
            <Link
              href="/onboarding/"
              className={buttonVariants({ variant: "outline" })}
            >
              <IconStar className="text-muted-foreground" />
              On board
            </Link>
          )}
          <Button className="w-full md:w-auto">
            <Play className="h-4 w-4 mr-2" />
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
}

function UserFlashCards() {
  const { sets, isSetLoading, getSetError, refresh } = useMyFlashCardSet({
    page: 1,
    pageSize: 4,
  });

  const router = useRouter();

  const goToFlashCardSetPage = () => {
    router.push("/sets");
    return true;
  };

  if (isSetLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FlashCardSetSkeleton number={3} />
      </div>
    );
  }

  if (getSetError) {
    return (
      <DataErrorAlert
        onReload={refresh}
        title="Failed to load flashcard sets"
      />
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Flashcard Sets</h2>
        <Button variant={"outline"} onClick={goToFlashCardSetPage}>
          <IconDots />
          See more
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sets.map((set) => (
          <FlashCardSetV2 {...set} key={set.id} />
        ))}
      </div>
    </>
  );
}
