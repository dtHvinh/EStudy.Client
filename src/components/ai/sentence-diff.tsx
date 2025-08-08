import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import { diffWords } from "diff";
import { MessageSquareDiff } from "lucide-react";

interface SentenceDiffProps {
  original: string;
  modified: string;
}

export function SentenceDiff({ original, modified }: SentenceDiffProps) {
  const diff = diffWords(original, modified);

  return (
    <div>
      <Separator className="my-4" />
      <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
        <MessageSquareDiff className="h-4 w-4 text-blue-500" />
        Sentence Comparison
      </h4>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-800 dark:bg-blue-950/20">
        {diff.map((part, index) => (
          <span
            key={index}
            className={clsx("rounded-sm px-1", {
              "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100":
                part.added,
              "bg-red-200 text-red-900 line-through dark:bg-red-800 dark:text-red-100":
                part.removed,
              "text-gray-800 dark:text-gray-100": !part.added && !part.removed,
            })}
          >
            {part.value}
          </span>
        ))}
      </div>
    </div>
  );
}
