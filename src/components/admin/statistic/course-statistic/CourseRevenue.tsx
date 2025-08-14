import api from "@/components/utils/requestUtils";
import useSWR from "swr";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
};

export default function CourseRevenue({ monthRange }: { monthRange: number }) {
  const {
    data: chartData,
    isLoading,
    error,
  } = useSWR<
    {
      month: string;
      revenue: number;
    }[]
  >(`/api/admin/course-revenue/${monthRange}/month`, api.get);

  function getTrend() {
    if (!chartData || chartData.length < 2) {
      return { trend: "no data", change: 0 };
    }

    const last = chartData[chartData.length - 1];
    const prev = chartData[chartData.length - 2];

    const diff = last.revenue - prev.revenue;
    const percentChange = prev.revenue === 0 ? 0 : (diff / prev.revenue) * 100;

    return {
      trend: diff > 0 ? "up" : diff < 0 ? "down" : "no change",
      change: percentChange,
    };
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Course Revenue</CardTitle>
          <CardDescription>
            Showing total revenue for the last {monthRange} months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="revenue"
                type="linear"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Trending {getTrend().trend} by {getTrend().change.toFixed(2)}% this
            month{" "}
            {getTrend().change > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total course revenues for the last 6 months
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
