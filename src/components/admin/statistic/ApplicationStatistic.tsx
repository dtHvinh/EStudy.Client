import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/h3";
import { useState } from "react";
import CourseRevenue from "./course-statistic/CourseRevenue";
import GenericStatistic from "./Statistic";
import { UserAmountStatistic } from "./user-statistic/UserAmountStatistic";

export default function ApplicationStatistic() {
  const [monthRange, setMonthRange] = useState(30);
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Statistic</h2>
      <p className="pb-5 text-gray-600">
        View application usage statistics and insights
      </p>
      <GenericStatistic />

      <div className="gap-4 [&>*]:mt-5">
        <div>
          <div className="flex items-center gap-5">
            <H3>Main Statistic</H3>

            <div className="flex items-center gap-2">
              <Button variant={"outline"} onClick={() => setMonthRange(6)}>
                6 months
              </Button>
              <Button variant={"outline"} onClick={() => setMonthRange(12)}>
                12 months
              </Button>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <UserAmountStatistic monthRange={monthRange} />
            <CourseRevenue monthRange={monthRange} />
          </div>
        </div>
      </div>
    </div>
  );
}
