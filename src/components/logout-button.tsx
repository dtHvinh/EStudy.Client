import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IconDoorExit } from "@tabler/icons-react";
import ButtonIcon from "./button-icon";
import { useAuth } from "./contexts/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <ButtonIcon
          variant={"outline"}
          asChild
          icon={<IconDoorExit />}
          tooltip={"Leave"}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to leave?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will need to log in again to
            access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Later</AlertDialogCancel>
          <AlertDialogAction onClick={logout}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
