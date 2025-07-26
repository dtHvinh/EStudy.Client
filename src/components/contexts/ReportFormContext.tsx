import { createContext, useCallback, useContext, useState } from "react";

import { toast } from "sonner";
import { ReportDialog } from "../report/report-dialog";
import api from "../utils/requestUtils";

export interface ReportType {
  type?: string;
  targetId?: string;
  reasonId?: string;
  description?: string;
}

export interface ReportFormContextType {
  isDialogOpen: boolean;

  openReport: (options?: { type?: string; targetId?: string }) => void;
  closeReport: () => void;
  submitReport: (data: ReportType) => Promise<void>;
}

const ReportFormContext = createContext<ReportFormContextType | undefined>(
  undefined,
);

export function ReportFormContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [type, setType] = useState<string>();
  const [targetId, setTargetId] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openReport = useCallback(
    (options?: { type?: string; targetId?: string }) => {
      setType(options?.type);
      setTargetId(options?.targetId);
      setIsDialogOpen(true);
    },
    [],
  );

  const closeReport = useCallback(() => {
    setType(undefined);
    setTargetId(undefined);
    setIsDialogOpen(false);
  }, []);

  const submitReport = useCallback(
    async (data: ReportType) => {
      try {
        await api.post("/api/reports", data);
        closeReport();
        toast.success("Report submitted successfully");
      } catch (error) {
        console.error("Error submitting report:", error);
        toast.error("You already submitted a report for this content");
      }
    },
    [closeReport],
  );

  return (
    <ReportFormContext.Provider
      value={{
        isDialogOpen,
        openReport,
        closeReport,
        submitReport,
      }}
    >
      {children}
      <ReportDialog
        opened={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={submitReport}
        initialTargetId={targetId}
        initialType={type}
      />
    </ReportFormContext.Provider>
  );
}

export function useReportForm() {
  const context = useContext(ReportFormContext);
  if (context === undefined) {
    throw new Error(
      "useReportForm must be used within a ReportFormContextProvider",
    );
  }
  return context;
}
