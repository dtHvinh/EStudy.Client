import MainLayout from "@/components/layouts/MainLayout";
import RelativeLink from "@/components/relative-link";
import RoleBaseComponent from "@/components/role-base-component";
import TestCard from "@/components/test-card";
import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/h3";
const a = {
  id: "1",
  title: "IELTS Simulation Listening test 1",
  duration: 45,
  attemptCount: 1247,
  commentCount: 89,
  questionCount: 40,
  sectionCount: 4,
};
export type TestResponseType = {
  id: string;
  title: string;
  duration: number;
  attemptCount: number;
  commentCount: number;
  questionCount: number;
  sectionCount: number;
};

export default function Page() {
  return (
    <MainLayout>
      <div className="space-y-4 px-4 lg:px-6">
        <div className="flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-3">
              <H3>Library</H3>
              <p>You can find everything here</p>
            </div>
            <RoleBaseComponent requireRoles={["Instructor", "Admin"]}>
              <Button variant={"outline"}>
                <RelativeLink href={"create"}>Create Test</RelativeLink>
              </Button>
            </RoleBaseComponent>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(15)].map((item, idx) => (
              <TestCard key={idx} {...a} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
