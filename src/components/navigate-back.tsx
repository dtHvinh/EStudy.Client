import { cn } from "@/lib/utils";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { Button } from "./ui/button";

interface NavigateBackProps {
  className?: string;
  /** URL to navigate to if browser back is not available or safe. Defaults to "/" */
  fallbackUrl?: string;
  /** Custom label for the button. Defaults to "Back" */
  label?: string;
}

/**
 * Smart back navigation button that handles edge cases:
 * - No browser history (direct navigation, bookmarks)
 * - External referrers (coming from other websites)
 * - Safe fallback navigation to prevent users getting stuck
 *
 * @example
 * // Basic usage with home fallback
 * <NavigateBack />
 *
 * @example
 * // With custom fallback and label
 * <NavigateBack fallbackUrl="/dashboard" label="Back to Dashboard" />
 *
 * @example
 * // In test pages, fallback to tests list
 * <NavigateBack fallbackUrl="/tests" />
 */

const NavigateBack = ({
  className,
  fallbackUrl,
  label = "Back",
  ...props
}: NavigateBackProps & React.ComponentProps<"button">) => {
  const router = useRouter();

  const handleBack = () => {
    if (fallbackUrl) router.push(fallbackUrl);

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
