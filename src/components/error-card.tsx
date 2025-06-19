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
      className={`min-h-screen flex items-center justify-center p-4 bg-background ${className}`}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">{config.icon}</div>
          <CardTitle className="text-xl font-semibold text-foreground">
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

          <div className="flex flex-col sm:flex-row gap-3">
            {config.showRetry && onRetry && (
              <Button
                onClick={onRetry}
                disabled={retryLoading}
                className="flex-1"
              >
                {retryLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
            )}

            {onGoHome && (
              <Button variant="outline" onClick={onGoHome} className="flex-1">
                <Home className="h-4 w-4 mr-2" />
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
              <Mail className="h-4 w-4 mr-2" />
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
