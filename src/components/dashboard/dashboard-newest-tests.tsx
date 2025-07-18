import useTests from "@/hooks/use-tests";
import Link from "next/link";
import TestCard from "../test-card";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import H3 from "../ui/h3";

export default function DashboardNewestTests() {
  const { tests, scrollNext, isTestLoading, getTestError } = useTests({
    pageSize: 6,
  });

  return (
    <Card className="border-0">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>
            <H3>Latest tests</H3>
          </CardTitle>
          <CardDescription>Practice your knowledge</CardDescription>
        </div>
        <div>
          <Button variant="outline" asChild>
            <Link href={"tests"}>See more</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {tests.map((item) => (
            <TestCard key={item.id} {...item} />
          ))}
          {tests.length === 0 && (
            <div className="col-span-full">
              There are no tests available in the library.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
