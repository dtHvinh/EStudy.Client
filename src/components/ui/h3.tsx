import { cn } from "@/lib/utils";

export default function H3({
  className,
  children,
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}
