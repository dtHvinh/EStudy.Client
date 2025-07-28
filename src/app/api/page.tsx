"use client";

import MainLayout from "@/components/layouts/MainLayout";
import { API_BASE_URL } from "@/components/utils/requestUtils";
import { ApiReferenceReact } from "@scalar/api-reference-react";

import "@scalar/api-reference-react/style.css";

export default function Page() {
  return (
    <MainLayout childDefaultPadding={false}>
      <div>
        <ApiReferenceReact
          configuration={{
            url: `${API_BASE_URL}/openapi/v1.json`,
          }}
        />
      </div>
    </MainLayout>
  );
}
