import { FlashCardSetResponseType } from "@/hooks/useMyFlashCardSet";
import { IconTrendingUp } from "@tabler/icons-react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import ButtonIcon from "./button-icon";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function FlashCardSet({ ...props }: FlashCardSetResponseType) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
          {props.title}
        </CardTitle>
        <CardDescription>{props.description}</CardDescription>
        <CardAction>
          <ButtonIcon
            icon={<Star />}
            tooltip={"Add to favorite"}
            onClick={() => toast.success("ee")}
          />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this month <IconTrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground">
          Visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
