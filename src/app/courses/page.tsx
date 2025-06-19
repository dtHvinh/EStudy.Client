import MainLayout from "@/components/layouts/MainLayout";

export default function Page() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Courses Page</h1>
        <p className="text-gray-600">This is the courses page.</p>
      </div>
    </MainLayout>
  );
}
