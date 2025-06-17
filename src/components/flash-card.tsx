import {
  EditFlashCardRequestType,
  FlashCardResponseType,
} from "@/hooks/use-set-cards";

import { useGenericToggle } from "@/hooks/use-generic-toggle";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { IconVolume } from "@tabler/icons-react";
import { Pen, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import ButtonIcon from "./button-icon";
import EditCardForm from "./edit-card-form";
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
import { Badge } from "./ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { speakUK, speakUS } from "./utils/utilss";

/**
 * TODO:
 * - Add mobile button for view the full card
 */

export default function FlashCard({
  className,
  onDelete,
  onEdit,
  ...props
}: {
  onDelete: () => void;
  onEdit: (
    data: EditFlashCardRequestType,
    form: UseFormReturn<typeof data>
  ) => Promise<boolean>;
  className?: string;
} & FlashCardResponseType) {
  const {
    opened: deleteOpened,
    openChange: deleteOpenChange,
    open: deleteOpen,
  } = useGenericToggle(false);

  const {
    opened: editOpened,
    openChange: editOpenChange,
    open: editOpen,
  } = useGenericToggle(false);

  return (
    <>
      <FlashCardContextMenu
        onDeleteClick={deleteOpen}
        onEditClick={editOpen}
        className={className}
        {...props}
      />

      <DeleteCardAlert
        term={props.term}
        opened={deleteOpened}
        onOpenChange={deleteOpenChange}
        onDelete={onDelete}
      />

      <EditCardForm
        opened={editOpened}
        onOpenChange={editOpenChange}
        defaultValues={props}
        onSubmit={onEdit}
      />
    </>
  );
}

const FlashCardContextMenu = ({
  className,
  onDeleteClick,
  onEditClick,
  ...props
}: {
  onEditClick: () => void;
  onDeleteClick: () => void;
  className?: string;
} & FlashCardResponseType) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="max-w-sm">
        <FlashCardDisplay className={className} {...props} />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem onClick={onEditClick} inset>
          Edit
          <ContextMenuShortcut>
            <Pen />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            <ContextMenuItem onClick={onDeleteClick} variant="destructive">
              Delete
              <ContextMenuShortcut>
                <Trash className="text-destructive" />
              </ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const FlashCardDisplay = ({
  className,
  ...props
}: {
  isFold?: boolean;
  className?: string;
} & FlashCardResponseType) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center justify-between gap-3 border-[.5px] p-3 rounded-lg bg-card hover:bg-muted/50 transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md">
          <h3 className="text-xl font-bold text-foreground leading-tight truncate">
            {props.term}
          </h3>
          {props.partOfSpeech && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              {props.partOfSpeech}
            </Badge>
          )}
          <div className="flex overflow-hidden">
            <ButtonIcon
              tooltip={"US Voice"}
              className="border-0"
              icon={<IconVolume />}
              onClick={() => speakUS(props.term)}
            />
            <ButtonIcon
              tooltip={"UK Voice"}
              className="border-0"
              icon={<IconVolume />}
              onClick={() => speakUK(props.term)}
            />
          </div>
        </div>
      </HoverCardTrigger>

      <HoverCardContent sideOffset={10} className="w-96 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-foreground leading-tight">
            {props.term}
          </h3>
          {props.partOfSpeech && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              {props.partOfSpeech}
            </Badge>
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {props.definition}
        </p>

        {props.example && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Examples:</h4>
            <div className="bg-muted/50 p-3 border-l-4 border-primary/20">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {props.example
                  .split("\n")
                  .filter((line) => line.trim())
                  .map((line, index) => (
                    <FlashCardExample key={index} line={line} />
                  ))}
              </ul>
            </div>
          </div>
        )}

        {props.note && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-md p-3">
            <div className="flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                💡
              </span>
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                  Note
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {props.note}
                </p>
              </div>
            </div>
          </div>
        )}

        {props.imageUrl && (
          <AspectRatio
            ratio={16 / 9}
            className="overflow-hidden rounded-lg border"
          >
            <img
              src={props.imageUrl || "/placeholder.svg"}
              alt={props.term}
              className="object-cover w-full h-full transition-transform duration-200"
            />
          </AspectRatio>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

const DeleteCardAlert = ({
  opened,
  onOpenChange,
  onDelete,
  term,
}: {
  term: string;
  opened: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}) => {
  return (
    <AlertDialog open={opened} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete&nbsp;
            <span className="font-bold">"{term}"</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Not now</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const FlashCardExample = ({ ...props }: { line: string }) => {
  return (
    <li className="flex items-center gap-2">
      <span className="text-primary/60 mt-1.5 text-xs">•</span>
      <span className="flex-1">{props.line.trim()}</span>
      <span className="text-primary/60 mt-1.5 text-xs">
        &nbsp;
        <ButtonIcon
          tooltip={"UK Voice"}
          className="border-0 p-0"
          icon={<IconVolume />}
          onClick={() => speakUK(props.line)}
        />
      </span>
    </li>
  );
};
