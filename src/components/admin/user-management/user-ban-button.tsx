import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/components/utils/requestUtils";
import { Ban } from "lucide-react";
import { useState, useTransition } from "react";

export default function UserBanButton({
  userId,
  onBanSuccess,
}: {
  userId: string | number;
  onBanSuccess?: () => void;
}) {
  const [days, setDays] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleBanUser = async () => {
    if (!days || parseInt(days) <= 0) return;

    startTransition(async () => {
      try {
        await api.post(`/api/admin/users/${userId}/ban`, { days });
        onBanSuccess?.();
      } catch (error) {
        console.error("Failed to ban user:", error);
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2">
        <Ban className="text-destructive mr-2 h-4 w-4" />
        Ban User
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            Specify the number of days to ban this user. The user will not be
            able to access the platform during this period.
          </DialogDescription>
        </DialogHeader>

        <div className="">
          <div className="">
            <Label htmlFor="days" className="text-right">
              Select Ban Duration (in days)
            </Label>
            <div className="mt-2 flex items-center gap-5">
              <Button
                variant={parseInt(days) === 1 ? "default" : "outline"}
                onClick={() => setDays("1")}
              >
                1
              </Button>
              <Button
                variant={parseInt(days) === 7 ? "default" : "outline"}
                onClick={() => setDays("7")}
              >
                7
              </Button>
              <Button
                variant={parseInt(days) === 30 ? "default" : "outline"}
                onClick={() => setDays("30")}
              >
                30
              </Button>
              or
              <Input
                id="days"
                type="number"
                min="1"
                placeholder="Enter number of days"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="col-span-3"
              />
              Days
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            onClick={handleBanUser}
            disabled={!days || parseInt(days) <= 0 || isPending}
          >
            {isPending ? "Banning..." : "Ban User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
