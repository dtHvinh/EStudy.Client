import CourseStructure from "@/components/course-builder/course-structure";
import MainLayout from "@/components/layouts/MainLayout";

export default function Page() {
  return (
    <MainLayout>
      <div className="container mx-auto max-w-6xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course Structure</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your course stiructure, including modules,
              lessons, and resources.
            </p>
          </div>
        </div>

        <div>
          <CourseStructure />
        </div>
      </div>
    </MainLayout>
  );
}
