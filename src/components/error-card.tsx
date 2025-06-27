"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  Home,
  Mail,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";

interface ErrorCardProps {
  title?: string;
  message?: string;
  type?: "network" | "server" | "auth" | "generic";
  onRetry?: () => void;
  onGoHome?: () => void;
  onContactSupport?: () => void;
  retryLoading?: boolean;
  className?: string;
}

export function ErrorCard({
  title,
  message,
  type = "generic",
  onRetry,
  onGoHome,
  onContactSupport,
  retryLoading = false,
  className = "",
}: ErrorCardProps) {
  const getErrorConfig = () => {
    switch (type) {
      case "network":
        return {
          icon: <WifiOff className="h-12 w-12 text-red-500" />,
          defaultTitle: "Connection Problem",
          defaultMessage:
            "Unable to connect to our servers. Please check your internet connection and try again.",
          showRetry: true,
        };
      case "server":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-orange-500" />,
          defaultTitle: "Server Error",
          defaultMessage:
            "We're experiencing technical difficulties. Our team has been notified and is working to resolve this issue.",
          showRetry: true,
        };
      case "auth":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-yellow-500" />,
          defaultTitle: "Authentication Required",
          defaultMessage:
            "Your session has expired. Please log in again to continue accessing your profile.",
          showRetry: false,
        };
      default:
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          defaultTitle: "Something Went Wrong",
          defaultMessage:
            "We encountered an unexpected error while loading your profile data. Please try again.",
          showRetry: true,
        };
    }
  };

  const config = getErrorConfig();
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <div
      className={`bg-background flex items-center justify-center p-4 ${className}`}
    >
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="pb-4 text-center">
          <div className="mb-4 flex justify-center">{config.icon}</div>
          <CardTitle className="text-foreground text-xl font-semibold">
            {displayTitle}
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            {displayMessage}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {type === "network" && (
            <Alert>
              <Wifi className="h-4 w-4" />
              <AlertDescription>
                Make sure you're connected to the internet and try refreshing
                the page.
              </AlertDescription>
            </Alert>
          )}

          {type === "server" && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                If this problem persists, please contact our support team for
                assistance.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            {config.showRetry && onRetry && (
              <Button
                onClick={onRetry}
                disabled={retryLoading}
                className="flex-1"
              >
                {retryLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </>
                )}
              </Button>
            )}

            {onGoHome && (
              <Button variant="outline" onClick={onGoHome} className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            )}
          </div>

          {onContactSupport && (
            <Button
              variant="ghost"
              onClick={onContactSupport}
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Specific error components for common scenarios
export function ProfileLoadError({
  onRetry,
  retryLoading,
}: {
  onRetry: () => void;
  retryLoading?: boolean;
}) {
  return (
    <ErrorCard
      title="Failed to Load Profile"
      message="We couldn't retrieve your profile information. This might be due to a temporary connection issue."
      type="network"
      onRetry={onRetry}
      retryLoading={retryLoading}
      onContactSupport={() =>
        window.open("mailto:support@yourapp.com", "_blank")
      }
    />
  );
}

export function ServerError({
  onRetry,
  onGoHome,
}: {
  onRetry?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <ErrorCard
      title="Server Temporarily Unavailable"
      message="Our servers are currently experiencing high traffic. Please try again in a few moments."
      type="server"
      onRetry={onRetry}
      onGoHome={onGoHome}
      onContactSupport={() =>
        window.open("mailto:support@yourapp.com", "_blank")
      }
    />
  );
}

export function AuthenticationError({ onGoHome }: { onGoHome?: () => void }) {
  return (
    <ErrorCard
      title="Session Expired"
      message="For your security, your session has expired. Please log in again to access your profile."
      type="auth"
      onGoHome={onGoHome}
    />
  );
}
