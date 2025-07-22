"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
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
import useReports from "@/hooks/use-reports";
import PaginationControls from "../pagination-controls";
import ReportRow from "./report-row";

export default function ContentModeration() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [contentCurrentPage, setContentCurrentPage] = useState(1);
  const [contentItemsPerPage, setContentItemsPerPage] = useState(10);

  const { reports, totalCount, totalPages, refetch } = useReports({
    page: contentCurrentPage,
    pageSize: contentItemsPerPage,
    filterProps: { status: statusFilter },
  });

  const contentStartIndex = (contentCurrentPage - 1) * contentItemsPerPage;

  const goToContentPage = (page: number) => {
    setContentCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reported Content</h2>
          <p className="text-gray-600">Review and moderate reported content</p>
        </div>
      </div>

      {/* Content Filters */}
      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-col items-start gap-4 sm:flex-row sm:items-center">
              Status:
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="UnderReview">Under Review</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
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
        <CardContent className="px-5">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Content</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((content) => (
                  <ReportRow
                    key={content.id}
                    report={content}
                    onReportProcessSuccess={refetch}
                  />
                ))}
                {reports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-5 text-center">
                      No reports found or matching the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <PaginationControls
        currentPage={contentCurrentPage}
        totalPages={totalPages}
        onPageChange={goToContentPage}
        startIndex={contentStartIndex}
        itemsPerPage={contentItemsPerPage}
        totalItems={totalCount}
        itemName="reports"
      />
    </div>
  );
}
