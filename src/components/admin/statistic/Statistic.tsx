import { Card } from "@/components/ui/card";
import api from "@/components/utils/requestUtils";
import { IconPaperclip, IconWriting } from "@tabler/icons-react";
import useSWR from "swr";

export default function GenericStatistic() {
  const { data, isLoading, error } = useSWR<{
    totalUsers: number;
    totalCourses: number;
    totalBlogs: number;
    totalTests: number;
  }>("/api/admin/generic-statistics", api.get);
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      {data && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Total Users
              </p>
              <p className="text-3xl font-bold">{data.totalUsers}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </Card>
      )}

      {data && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Courses
              </p>
              <p className="text-3xl font-bold">{data.totalCourses}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
        </Card>
      )}

      {data && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Blogs</p>
              <p className="text-3xl font-bold">{data.totalBlogs}</p>
            </div>
            <div className="rounded-full bg-gray-100 p-3">
              <IconPaperclip className="dark:text-black" />
            </div>
          </div>
        </Card>
      )}

      {data && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Tests</p>
              <p className="text-3xl font-bold">{data.totalTests}</p>
            </div>
            <div className="rounded-full bg-gray-100 p-3">
              <IconWriting className="dark:text-black" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
