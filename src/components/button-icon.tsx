import { Button } from "./ui/button";

export default function ButtonIcon({
  className,
  children,
  icon,
  ...props
}: {
  icon: React.ReactNode;
} & React.ComponentProps<"button">) {
  return (
    <Button variant="secondary" size="icon" className="size-8" {...props}>
      {icon}
    </Button>
  );
}
