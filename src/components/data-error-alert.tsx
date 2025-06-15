import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function DataErrorAlert({
  title,
  description,
  onReload,
  ...props
}: {
  title?: string;
  description?: string;
  onReload?: () => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Alert className="border-red-300" variant="destructive" {...props}>
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
