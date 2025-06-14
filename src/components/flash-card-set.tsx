import { FlashCardSetResponseType } from "@/hooks/useMyFlashCardSet";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import ButtonIcon from "./button-icon";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";

export interface FlashCardSetProps {
  onAddToFavorite: () => void;
  onRemoveFromFavorite: () => void;
}

export default function FlashCardSet({
  onAddToFavorite,
  onRemoveFromFavorite,
  ...props
}: FlashCardSetResponseType & FlashCardSetProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
          {props.title}
        </CardTitle>
        <CardDescription>
          {!props.description ? (
            <span className="italic">No description</span>
          ) : (
            props.description
          )}
        </CardDescription>
        <CardAction>
          {props.isFavorite ? (
            <ButtonIcon
              icon={<IconStarFilled />}
              tooltip={"Remove from favorite"}
              onClick={onRemoveFromFavorite}
            />
          ) : (
            <ButtonIcon
              icon={<IconStar />}
              tooltip={"Add to favorite"}
              onClick={onAddToFavorite}
            />
          )}
        </CardAction>
      </CardHeader>
      <FlashCardSetFooter {...props} />
    </Card>
  );
}

function FlashCardSetFooter({
  cardCount,
  lastAccess,
  progress,
}: {
  cardCount: number;
  lastAccess: string | null;
  progress: number;
}) {
  return (
    <CardFooter className="flex-col items-start gap-1.5 text-sm mt-auto">
      <div className="w-full font-medium">
        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {cardCount} cards
          </span>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            {lastAccess ? `Last access: ${lastAccess}` : "Never accessed"}
          </span>
        </div>
      </div>
      <div className="w-full">
        <Progress value={progress} />
      </div>
    </CardFooter>
  );
}

export function FlashCardSetSkeleton({
  number = 1,
}: {
  number?: number;
  gridCols?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  return Array.from({ length: number }).map((_, index) => (
    <Skeleton
      key={index}
      className="w-full h-48 @container/card"
      data-slot="card"
    />
  ));
}
