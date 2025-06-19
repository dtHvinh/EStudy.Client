import { useGenericToggle } from "@/hooks/use-generic-toggle";
import {
  EditFlashCardSetParamType,
  FlashCardSetResponseType,
} from "@/hooks/useMyFlashCardSet";
import {
  IconPlayerPlay,
  IconSettings,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import ButtonIcon from "./button-icon";
import EditFlashCardSetForm from "./edit-flash-card-set-form";
import RelativeLink from "./relative-link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { calcPercentage } from "./utils/utilss";

export type FlashCardSetMode = "select" | "default";

export interface FlashCardSetProps extends FlashCardSetResponseType {
  onAddToFavorite: () => void;
  onRemoveFromFavorite: () => void;
  onDelete: () => void;
  onEdit: (data: EditFlashCardSetParamType) => Promise<boolean>;
}

export default function FlashCardSet({
  onAddToFavorite,
  onRemoveFromFavorite,
  onEdit,
  onDelete,
  ...props
}: FlashCardSetProps) {
  const { opened: editOpened, open: openEdit, openChange } = useGenericToggle();
  const {
    opened: deleteOpend,
    open: openDelete,
    openChange: openDeleteChange,
  } = useGenericToggle();

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <FlashCardSetDisplay
            {...props}
            onAddToFavorite={onAddToFavorite}
            onRemoveFromFavorite={onRemoveFromFavorite}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </ContextMenuTrigger>
        <ContextMenuContent className="w-52">
          <ContextMenuItem onClick={openEdit} inset>
            Edit
            <ContextMenuShortcut>
              <IconSettings />
            </ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem
            inset
            className="hover:bg-destructive/10 focus:bg-destructive/10"
            onClick={openDelete}
          >
            <span className="text-destructive">Delete</span>
            <ContextMenuShortcut>
              <IconTrash className="text-destructive" />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Forms and dialog section */}
      <EditFlashCardSetForm
        opened={editOpened}
        onOpenChange={openChange}
        onSubmit={onEdit}
        defaultValues={props}
      />

      <DeleteFlashCardSetAlert
        opened={deleteOpend}
        onOpenChange={openDeleteChange}
        onDelete={onDelete}
        title={props.title}
      />
    </>
  );
}

function FlashCardSetDisplay({ ...props }: FlashCardSetProps) {
  return (
    <Card className="@container/card hover:bg-accent/35 transition-colors">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl gap-2">
          <RelativeLink className="hover:underline" href={`${props.id}`}>
            {props.title}
          </RelativeLink>
        </CardTitle>
        <FlashCardSetDescription description={props.description} />
        <CardAction className="gap-2 grid grid-cols-2">
          {props.isFavorite ? (
            <ButtonIcon
              icon={<IconStarFilled />}
              tooltip={"Remove from favorite"}
              onClick={props.onRemoveFromFavorite}
              variant={"outline"}
            />
          ) : (
            <ButtonIcon
              icon={<IconStar />}
              tooltip={"Add to favorite"}
              onClick={props.onAddToFavorite}
              variant={"outline"}
            />
          )}
          <RelativeLink href={`${props.id}/study`}>
            <ButtonIcon icon={<IconPlayerPlay />} tooltip={"Start learning"} />
          </RelativeLink>
        </CardAction>
      </CardHeader>
      <FlashCardSetFooter {...props} />
    </Card>
  );
}

function FlashCardSetDescription({
  description,
}: {
  description: string | undefined;
}) {
  return (
    <Tooltip>
      <CardDescription>
        {!description ? (
          <span className="italic">No description</span>
        ) : (
          <TooltipTrigger className="text-left line-clamp-2">
            {description}
          </TooltipTrigger>
        )}
      </CardDescription>
      <TooltipContent>
        <span className="text-sm">{description}</span>
      </TooltipContent>
    </Tooltip>
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
            {lastAccess
              ? `Last access: ${dayjs(lastAccess).fromNow()}`
              : "Never accessed"}
          </span>
        </div>
      </div>
      <div className="w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <Progress value={calcPercentage(progress, cardCount)} />
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-sm">
              {progress} / {cardCount} cards completed
            </span>
          </TooltipContent>
        </Tooltip>
      </div>
    </CardFooter>
  );
}

function DeleteFlashCardSetAlert({
  onDelete,
  title,
  opened,
  onOpenChange,
}: {
  onDelete: () => void;
  title: string;
  opened: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={opened} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete <span className="italic">"{title}"</span> ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            flash card set.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Let me think!</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
