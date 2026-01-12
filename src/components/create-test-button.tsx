import { Button } from "@/components/ui/button";
import RelativeLink from "@/components/relative-link";
import { IconPlus } from "@tabler/icons-react";

export const CreateTestButton = () => {
  return (
    <Button variant={"ghost"}>
      <RelativeLink className="flex items-center gap-1" href={"builder"}>
        <IconPlus /> Test
      </RelativeLink>
    </Button>
  );
};
