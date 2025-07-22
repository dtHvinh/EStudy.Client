import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Report } from "@/hooks/use-reports";
import { capitalize } from "@/lib/string-utils";
import { IconSearch } from "@tabler/icons-react";

import dayjs from "dayjs";
import {
  BookOpen,
  CheckCircle,
  FileText,
  HelpCircle,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  X,
} from "lucide-react";
import ReportDetailsButton from "./report-details-button";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "destructive";
    case "UnderReview":
      return "default";
    case "Resolved":
      return "secondary";
    case "Rejected":
      return "outline";
    default:
      return "outline";
  }
};

const getContentIcon = (type: string) => {
  switch (type) {
    case "Lesson":
      return <BookOpen className="h-4 w-4" />;
    case "Quiz":
      return <HelpCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};
export default function ReportRow({ report }: { report: Report }) {
  return (
    <TableRow key={report.id}>
      <TableCell>
        <div className="flex items-start space-x-3">
          <div className="mt-1 flex-shrink-0">
            {getContentIcon(report.targetType)}
          </div>
          <div>
            <div className="text-sm font-medium">{report.targetTitle}</div>
            <div className="text-xs text-gray-500">
              {capitalize(report.targetType)} by&nbsp;
              {report.reporterName}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="text-sm font-medium">{report.reporterName}</div>
          <div className="text-xs text-gray-500">{report.reporterEmail}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{report.reason}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusColor(report.status)}>{report.status}</Badge>
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {dayjs(report.creationDate).fromNow()}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ReportDetailsButton report={report} />
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Resolved
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconSearch className="mr-2 h-4 w-4" />
              Reviewing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <X className="mr-2 h-4 w-4" />
              Reject
            </DropdownMenuItem>
            <DropdownMenuLabel>User</DropdownMenuLabel>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              Warn User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-destructive/10 text-destructive">
              <Trash2 className="text-destructive mr-2 h-4 w-4" />
              <p className="text-destructive">Delete report</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
