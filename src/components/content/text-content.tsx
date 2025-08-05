import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function TextContent({
  text,
  ...props
}: { text: string } & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <p {...props}>{text}</p>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}
