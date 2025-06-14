import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import MainLayout from "@/components/layouts/MainLayout";
import Head from "next/head";
import data from "./data.json";

export default function Page() {
  return (
    <MainLayout>
      <Head>
        <title>EStudy Dashboard</title>
        <meta
          name="description"
          content="Learn and grow your English with EStudy"
        />
      </Head>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </MainLayout>
  );
}
