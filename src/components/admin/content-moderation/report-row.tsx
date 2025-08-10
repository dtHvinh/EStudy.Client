import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Report, useReportActions } from "@/hooks/use-reports";
import { capitalize } from "@/lib/string-utils";
import { IconSearch } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import {
  BookOpen,
  CheckCircle,
  ExternalLink,
  FileText,
  HelpCircle,
  MessageSquare,
  MoreHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "outline";
    case "UnderReview":
      return "default";
    case "Resolved":
      return "secondary";
    case "Rejected":
      return "destructive";
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
export default function ReportRow({
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
    <TableRow key={report.id}>
      <TableCell>
        <div className="flex items-start space-x-3">
          <div className="mt-1 flex-shrink-0">
            {getContentIcon(report.targetType)}
          </div>
          <div>
            <ReportTargetLink
              className="text-sm font-medium"
              targetTitle={report.targetTitle}
              targetType={report.targetType}
              targetId={report.targetId}
            />
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={resolveReport}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Resolved
            </DropdownMenuItem>
            <DropdownMenuItem onClick={reviewReport}>
              <IconSearch className="mr-2 h-4 w-4" />
              Reviewing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={rejectReport}>
              <X className="mr-2 h-4 w-4" />
              Reject
            </DropdownMenuItem>
            <DropdownMenuLabel>User</DropdownMenuLabel>
            <DropdownMenuItem onClick={warnUser}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Warn User
            </DropdownMenuItem>
            {/*<DropdownMenuSeparator />
             <DropdownMenuItem className="hover:bg-destructive/10 text-destructive">
              <Trash2 className="text-destructive mr-2 h-4 w-4" />
              <p className="text-destructive">Delete report</p>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

const ReportTargetLink = ({
  targetType,
  targetId,
  targetTitle,
  className,
}: {
  targetType: string;
  targetId: string | number;
  targetTitle: string;
  className?: string;
}) => {
  const defaultClass =
    "hover:text-blue-600 hover:underline flex items-center gap-1 ";

  switch (targetType) {
    case "blog":
      return (
        <Link
          href={`/blogs/${targetId}`}
          className={cn(className, defaultClass)}
        >
          {targetTitle} <ExternalLink className="inline h-3 w-3" />
        </Link>
      );
    case "course":
      return (
        <Link
          href={`/courses/${targetId}/learn`}
          className={cn(className, defaultClass)}
        >
          {targetTitle} <ExternalLink className="inline h-3 w-3" />
        </Link>
      );
    default:
      return <p className={className}>{targetTitle}</p>;
  }
};
