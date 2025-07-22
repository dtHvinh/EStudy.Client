import { Loader2Icon } from "lucide-react";

export default function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex h-full items-center justify-center space-x-2">
      <Loader2Icon className="animate-spin" />
      <div>{text}</div>
    </div>
  );
}
