"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { stripePromise } from "@/lib/stripe";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  HelpCircle,
  Loader2,
  RefreshCw,
  Shield,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const STATUS_CONTENT_MAP = {
  succeeded: {
    text: "Payment Successful",
    description: "Your payment has been processed successfully.",
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    badgeVariant: "default" as const,
    icon: CheckCircle,
  },
  processing: {
    text: "Payment Processing",
    description:
      "Your payment is being processed. This may take a few moments.",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeVariant: "secondary" as const,
    icon: Loader2,
  },
  requires_action: {
    text: "Action Required",
    description:
      "Your payment requires additional verification or action from you.",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeVariant: "outline" as const,
    icon: AlertTriangle,
  },
  requires_payment_method: {
    text: "Payment Failed",
    description:
      "Your payment method was declined. Please try a different payment method.",
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    badgeVariant: "destructive" as const,
    icon: XCircle,
  },
  requires_confirmation: {
    text: "Confirmation Needed",
    description: "Please confirm your payment to complete the transaction.",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    badgeVariant: "secondary" as const,
    icon: Shield,
  },
  requires_capture: {
    text: "Payment Authorized",
    description: "Payment has been authorized and is ready for capture.",
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    badgeVariant: "outline" as const,
    icon: Clock,
  },
  canceled: {
    text: "Payment Canceled",
    description: "The payment was canceled before completion.",
    iconColor: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    badgeVariant: "secondary" as const,
    icon: Ban,
  },
  partially_funded: {
    text: "Partially Funded",
    description: "Payment was partially successful. Some funds may be pending.",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    badgeVariant: "outline" as const,
    icon: CreditCard,
  },
  default: {
    text: "Unknown Status",
    description:
      "Something unexpected occurred. Please contact support if this persists.",
    iconColor: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    badgeVariant: "secondary" as const,
    icon: HelpCircle,
  },
};

export default function CompletePage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutCompleteComponent />
    </Elements>
  );
}

const CheckoutCompleteComponent = () => {
  const stripe = useStripe();
  const [status, setStatus] = useState<keyof typeof STATUS_CONTENT_MAP>();
  const [intentId, setIntentId] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const [currency, setCurrency] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) {
      setLoading(false);
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        setLoading(false);
        return;
      }

      console.log(paymentIntent);
      setStatus(paymentIntent.status as keyof typeof STATUS_CONTENT_MAP);
      setIntentId(paymentIntent.id);
      setAmount(paymentIntent.amount);
      setCurrency(paymentIntent.currency);
      setLoading(false);
    });
  }, [stripe]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-muted-foreground text-sm">
                Loading payment status...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = status
    ? STATUS_CONTENT_MAP[status]
    : STATUS_CONTENT_MAP.default;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Status Card */}
        <Card className={`${statusInfo.borderColor} border-2`}>
          <CardHeader className={`${statusInfo.bgColor} rounded-t-lg`}>
            <div className="flex items-center space-x-4">
              <div className={`rounded-full bg-white p-3 shadow-sm`}>
                <StatusIcon
                  className={`h-8 w-8 ${statusInfo.iconColor} ${status === "processing" ? "animate-spin" : ""}`}
                />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {statusInfo.text}
                </CardTitle>
                <CardDescription className="mt-1 text-gray-700">
                  {statusInfo.description}
                </CardDescription>
              </div>
              <Badge variant={statusInfo.badgeVariant} className="text-sm">
                {status || "unknown"}
              </Badge>
            </div>
          </CardHeader>

          {(intentId || amount) && (
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Details
                </h3>

                <Table>
                  <TableBody>
                    {intentId && (
                      <TableRow>
                        <TableCell className="font-medium text-gray-600">
                          Payment ID
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {intentId}
                        </TableCell>
                      </TableRow>
                    )}
                    {status && (
                      <TableRow>
                        <TableCell className="font-medium text-gray-600">
                          Status
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusInfo.badgeVariant}>
                            {status.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )}
                    {amount && currency && (
                      <TableRow>
                        <TableCell className="font-medium text-gray-600">
                          Amount
                        </TableCell>
                        <TableCell className="font-semibold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: currency.toUpperCase(),
                          }).format(amount / 100)}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell className="font-medium text-gray-600">
                        Processed At
                      </TableCell>
                      <TableCell>{new Date().toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              {intentId && (
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  asChild
                >
                  <a
                    href={`https://dashboard.stripe.com/payments/${intentId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View in Stripe Dashboard
                  </a>
                </Button>
              )}

              <Button className="flex-1" asChild>
                {status === "succeeded" ? (
                  <Link href="/dashboard" className="flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    Back to App
                  </Link>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        {status !== "succeeded" && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <HelpCircle className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <h4 className="font-semibold text-amber-900">Need Help?</h4>
                  <p className="mt-1 text-sm text-amber-800">
                    If you're experiencing issues with your payment, please
                    contact our support team or try using a different payment
                    method.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
