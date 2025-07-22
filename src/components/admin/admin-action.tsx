import { IconEye, IconEyeCancel, IconGavel } from "@tabler/icons-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface AdminActionProps {
  onHideContent?: () => void;
  onShowContent?: () => void;
}

export default function AdminAction({ ...props }: AdminActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          className="border-2 border-purple-500 bg-purple-200"
        >
          <IconGavel className="text-purple-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {props.onHideContent && (
          <DropdownMenuItem onClick={props.onHideContent}>
            Hide Content
            <DropdownMenuShortcut>
              <IconEyeCancel />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {props.onShowContent && (
          <DropdownMenuItem onClick={props.onShowContent}>
            Show Content
            <DropdownMenuShortcut>
              <IconEye />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
