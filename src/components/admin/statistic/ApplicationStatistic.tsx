import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/h3";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import CourseRevenue from "./course-statistic/CourseRevenue";
import GenericStatistic from "./Statistic";
import { UserAmountStatistic } from "./user-statistic/UserAmountStatistic";

export default function ApplicationStatistic() {
  const maxMonthRange = 36;
  const [monthRange, setMonthRange] = useState(30);
  const debounce = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMonthRange(
      Math.max(Math.min(parseInt(e.target.value), maxMonthRange), 3),
    );
  }, 500);

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
              <Label>or</Label>
              <Input
                type="number"
                defaultValue={0}
                onChange={debounce}
                className="w-20"
                max={36}
              />
              <p>months</p>
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
