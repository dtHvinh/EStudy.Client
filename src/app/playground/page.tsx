"use client";

import MainLayout from "@/components/layouts/MainLayout";

export default function Page() {
  return (
    <MainLayout>
      <div>
        <video
          controls={true}
          src={
            "http://localhost:9000/estudy/%5B0e960%5D_videores-18010-strang-part-2-version-3_360p_16_9.mp4"
          }
        />
      </div>
    </MainLayout>
  );
}
