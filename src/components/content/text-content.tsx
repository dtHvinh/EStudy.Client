import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function TextContent({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <p>{text}</p>
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}
