import { createContext, useCallback, useContext, useState } from "react";

import { ReportDialog } from "../report/report-dialog";

export interface ReportType {
  type?: string;
  targetId?: string;
  reason?: string;
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

const defaultReport: ReportType = {
  type: "",
  targetId: "",
  reason: "",
  description: "",
};

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
        // TODO: Implement your actual API call here
        console.log("Submitting report:", data);

        // Example API call structure:
        // const response = await fetch('/api/reports', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });
        //
        // if (!response.ok) {
        //   throw new Error('Failed to submit report');
        // }

        // Close dialog on successful submission
        closeReport();
      } catch (error) {
        console.error("Error submitting report:", error);
        // You might want to show an error toast or handle errors differently
        throw error;
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
