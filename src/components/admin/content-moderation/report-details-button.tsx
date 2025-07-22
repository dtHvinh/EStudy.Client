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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Report, useReportActions } from "@/hooks/use-reports";
import { capitalize } from "@/lib/string-utils";
import { IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs";
import { CheckCircle, Eye, MessageSquare, X } from "lucide-react";

export default function ReportDetailsButton({
  report,
  onReportProcessSuccess,
}: {
  report: Report;
  onReportProcessSuccess?: () => void;
}) {
  const { rejectReport, resolveReport, reviewReport, warnUser } =
    useReportActions({
      reportId: report.id,
      onActionSuccess: onReportProcessSuccess,
    });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Prevent closing the dropdown menu causing the dialog to close */}
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Eye className="mr-2 h-4 w-4" />
          Review Details
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>
            Review the reported report and take appropriate action
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Report Title</Label>
              <p className="text-sm text-gray-600">{report.targetTitle}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Report Type</Label>
              <p className="text-sm text-gray-600">
                {capitalize(report.targetType)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Reported By</Label>
              <p className="text-sm text-gray-600">{report.reporterName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Report Date</Label>
              <p className="text-sm text-gray-600">
                {dayjs(report.creationDate).fromNow()}
              </p>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Reason</Label>
            <p className="text-sm text-gray-600">{report.reason}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Description</Label>
            <p className="text-sm text-gray-600">{report.description}</p>
          </div>
        </div>
        <DialogFooter className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={resolveReport}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark Resolved
          </Button>
          <Button variant="outline" onClick={reviewReport}>
            <IconSearch className="mr-2 h-4 w-4" />
            Reviewing
          </Button>
          <Button variant="outline" onClick={rejectReport}>
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button variant="outline" onClick={warnUser}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Warn User
          </Button>
          {/* <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete report
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
