import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function DataErrorAlert({
  title,
  description,
  onReload,
}: {
  title?: string;
  description?: string;
  onReload?: () => void;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle className="flex justify-between">
        {title ?? "Error"}

        {onReload && (
          <button
            className="text-sm font-medium text-red-500 hover:underline"
            onClick={onReload}
          >
            Reload
          </button>
        )}
      </AlertTitle>
      <AlertDescription>
        <p>{description ?? "Something went wrong."}</p>
      </AlertDescription>
    </Alert>
  );
}
