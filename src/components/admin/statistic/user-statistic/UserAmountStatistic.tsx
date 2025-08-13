"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import api from "@/components/utils/requestUtils";
import useSWR from "swr";

export const description = "A simple area chart";

const chartConfig = {
  user: {
    label: "User",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function UserAmountStatistic({ monthRange }: { monthRange: number }) {
  const {
    data: chartData,
    isLoading,
    error,
  } = useSWR<{ month: string; user: number }[]>(
    `/api/admin/user-statistics/${monthRange}/month`,
    api.get,
  );

  function getTrend() {
    if (!chartData || chartData.length < 2) {
      return { trend: "no data", change: 0 };
    }

    const last = chartData[chartData.length - 1];
    const prev = chartData[chartData.length - 2];

    const diff = last.user - prev.user;
    const percentChange = prev.user === 0 ? 0 : (diff / prev.user) * 100;

    return {
      trend: diff > 0 ? "up" : diff < 0 ? "down" : "no change",
      change: percentChange,
    };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Amount</CardTitle>
        <CardDescription>
          Showing total new users for the last {monthRange} months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
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
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="user"
              type="natural"
              fill="var(--color-user)"
              fillOpacity={0.4}
              stroke="var(--color-user)"
            />
          </AreaChart>
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
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
