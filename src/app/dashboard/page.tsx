import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import MainLayout from "@/components/layouts/MainLayout";
import data from "./data.json";

export default function Page() {
  return (
    <MainLayout>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </MainLayout>
  );
}
