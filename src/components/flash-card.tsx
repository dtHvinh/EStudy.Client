import {
  EditFlashCardRequestType,
  FlashCardResponseType,
} from "@/hooks/use-set-cards";

import { useGenericToggle } from "@/hooks/use-generic-toggle";
import { IconVolume } from "@tabler/icons-react";
import { Pen, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import ButtonIcon from "./button-icon";
import EditCardForm from "./edit-card-form";
import FlashCardDetail from "./flash-card-detail";
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
  className?: string;
} & FlashCardResponseType) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center justify-between gap-3 border-[.5px] p-3 rounded-lg bg-card hover:bg-muted/50 transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md">
          <h3 className="text-xl text-foreground leading-tight truncate">
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
        <FlashCardDetail {...props} />
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
