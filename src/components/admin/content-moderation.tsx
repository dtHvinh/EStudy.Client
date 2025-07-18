"use client";

import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  FileText,
  HelpCircle,
  MessageSquare,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mock_reportedContent } from "@/utils/mock-utils";

export default function ContentModeration() {
  // Content moderation state
  const [contentSearchTerm, setContentSearchTerm] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contentCurrentPage, setContentCurrentPage] = useState(1);
  const [contentItemsPerPage, setContentItemsPerPage] = useState(10);

  // Filter reported content
  const filteredContent = mock_reportedContent.filter((content) => {
    const matchesSearch =
      content.contentTitle
        .toLowerCase()
        .includes(contentSearchTerm.toLowerCase()) ||
      content.reportedBy
        .toLowerCase()
        .includes(contentSearchTerm.toLowerCase()) ||
      content.reason.toLowerCase().includes(contentSearchTerm.toLowerCase());
    const matchesType =
      contentTypeFilter === "all" || content.contentType === contentTypeFilter;
    const matchesSeverity =
      severityFilter === "all" || content.severity === severityFilter;
    const matchesStatus =
      statusFilter === "all" || content.status === statusFilter;
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  // Pagination for content
  const contentTotalPages = Math.ceil(
    filteredContent.length / contentItemsPerPage,
  );
  const contentStartIndex = (contentCurrentPage - 1) * contentItemsPerPage;
  const paginatedContent = filteredContent.slice(
    contentStartIndex,
    contentStartIndex + contentItemsPerPage,
  );

  const goToContentPage = (page: number) => {
    setContentCurrentPage(Math.max(1, Math.min(page, contentTotalPages)));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive";
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "destructive";
      case "Under Review":
        return "default";
      case "Resolved":
        return "secondary";
      case "Dismissed":
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
      case "Vocabulary":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
    startIndex,
    itemsPerPage,
    totalItems,
    itemName,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    startIndex: number;
    itemsPerPage: number;
    totalItems: number;
    itemName: string;
  }) => (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}{" "}
            {itemName}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reported Content</h2>
          <p className="text-gray-600">Review and moderate reported content</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Badge variant="destructive" className="flex items-center">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {
              filteredContent.filter((c) => c.severity === "Critical").length
            }{" "}
            Critical
          </Badge>
          <Badge variant="default">
            {filteredContent.filter((c) => c.severity === "High").length} High
            Priority
          </Badge>
        </div>
      </div>

      {/* Content Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={contentSearchTerm}
                  onChange={(e) => setContentSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={contentTypeFilter}
                onValueChange={setContentTypeFilter}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Lesson">Lessons</SelectItem>
                  <SelectItem value="Quiz">Quizzes</SelectItem>
                  <SelectItem value="Vocabulary">Vocabulary</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show:</span>
              <Select
                value={contentItemsPerPage.toString()}
                onValueChange={(value) => {
                  setContentItemsPerPage(Number(value));
                  setContentCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Reports Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Content</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContent.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell>
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 flex-shrink-0">
                          {getContentIcon(content.contentType)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {content.contentTitle}
                          </div>
                          <div className="text-xs text-gray-500">
                            {content.contentType} by {content.contentAuthor}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">
                          {content.reportedBy}
                        </div>
                        <div className="text-xs text-gray-500">
                          {content.reporterEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{content.reason}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(content.severity)}>
                        {content.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(content.status)}>
                        {content.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {content.reportDate}
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Review Details
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Content Report Details
                                </DialogTitle>
                                <DialogDescription>
                                  Review the reported content and take
                                  appropriate action
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Content Title
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                      {content.contentTitle}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Content Type
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                      {content.contentType}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Reported By
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                      {content.reportedBy}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Report Date
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                      {content.reportDate}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Reason
                                  </Label>
                                  <p className="text-sm text-gray-600">
                                    {content.reason}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Description
                                  </Label>
                                  <p className="text-sm text-gray-600">
                                    {content.description}
                                  </p>
                                </div>
                              </div>
                              <DialogFooter className="flex gap-2">
                                <Button variant="outline">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Resolved
                                </Button>
                                <Button variant="outline">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Warn User
                                </Button>
                                <Button variant="destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Content
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Warn User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Content
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <PaginationControls
        currentPage={contentCurrentPage}
        totalPages={contentTotalPages}
        onPageChange={goToContentPage}
        startIndex={contentStartIndex}
        itemsPerPage={contentItemsPerPage}
        totalItems={filteredContent.length}
        itemName="reports"
      />
    </div>
  );
}
