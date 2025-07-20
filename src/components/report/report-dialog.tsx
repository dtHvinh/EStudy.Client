"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useReportReasons from "@/hooks/use-report-reasons";

// Define the interface for the report type
export interface ReportType {
  type: string;
  targetId?: string;
  reason: string;
  description: string;
}

// Define the form schema with validation
const reportFormSchema = z.object({
  type: z.string({
    required_error: "Please select a report type",
  }),
  targetId: z.string().optional(),
  reason: z.string().nonempty({
    message: "Please select a reason for reporting",
  }),
  description: z.string().nonempty({
    message: "Please provide a description of the issue",
  }),
});

interface ReportDialogProps {
  onSubmit: (data: ReportType) => void;
  initialTargetId?: string;
  initialType?: string;
  opened: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<ReportType>;
}

export function ReportDialog({
  onSubmit,
  initialTargetId,
  initialType,
  opened,
  onOpenChange,
}: ReportDialogProps) {
  // Define form with react-hook-form and zod validation
  const form = useForm<ReportType>({
    resolver: zodResolver(reportFormSchema),
    values: {
      type: initialType || "",
      targetId: initialTargetId,
      reason: "",
      description: "",
    },
  });
  const { reportReasons } = useReportReasons();

  function handleSubmit(data: ReportType) {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={opened} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Report</DialogTitle>
          <DialogDescription>
            Report inappropriate content or behavior. All reports are reviewed
            by our moderation team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Reasons</SelectLabel>
                          {reportReasons &&
                            reportReasons.map((reason) => (
                              <SelectItem
                                key={reason.id}
                                value={reason.id.toString()}
                              >
                                {reason.title}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    A short explanation of why you're reporting this content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Provide more details about the issue"
                      className="resize-none"
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide any additional details that might help our
                    moderation team
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Report</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
