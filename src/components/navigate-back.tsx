import { cn } from "@/lib/utils";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { Button } from "./ui/button";

interface NavigateBackProps {
  className?: string;
  fallbackUrl?: string;
  label?: string;
}

const NavigateBack = ({
  className,
  fallbackUrl,
  label = "Back",
  ...props
}: NavigateBackProps & React.ComponentProps<"button">) => {
  const router = useRouter();

  const handleBack = () => {
    if (fallbackUrl) {
      router.push(fallbackUrl);
      return;
    }

    if (typeof window !== "undefined") {
      try {
        const referrer = document.referrer;
        const currentDomain = window.location.origin;

        if (referrer && referrer.startsWith(currentDomain)) {
          router.back();
          return;
        }

        if (window.history.length > 1) {
          const canGoBack =
            window.history.state !== null || window.history.length > 2;
          if (canGoBack) {
            router.back();
            return;
          }
        }
      } catch (error) {
        console.warn(
          "NavigateBack: Error checking history, using fallback",
          error,
        );
      }
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleBack}
      {...props}
      className={cn("border-0", className)}
    >
      <IconChevronLeft /> {label}
    </Button>
  );
};

export default memo(NavigateBack);
