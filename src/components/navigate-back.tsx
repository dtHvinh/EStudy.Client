import { cn } from "@/lib/utils";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { Button } from "./ui/button";

const NavigateBack = ({
  className,
  ...props
}: {
  className?: string;
} & React.ComponentProps<"button">) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      variant="outline"
      onClick={handleBack}
      {...props}
      className={cn("border-0", className)}
    >
      <IconChevronLeft /> Back
    </Button>
  );
};

export default memo(NavigateBack);
