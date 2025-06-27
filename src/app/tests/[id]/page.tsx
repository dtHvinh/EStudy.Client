import MainLayout from "@/components/layouts/MainLayout";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <MainLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Test Page</h1>
          <p className="text-muted-foreground mt-2">
            This is a placeholder for the test details page. ${id} is the test
            ID.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
