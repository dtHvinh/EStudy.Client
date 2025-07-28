import { AuthProvider } from "@/components/contexts/AuthContext";
import { ToasterProvider } from "@/components/contexts/ToasterContext";
import { ThemeProvider } from "@/components/theme-toggle";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "@stripe/stripe-js";
import type { Metadata } from "next";
import { EB_Garamond, Geist, Geist_Mono } from "next/font/google";
import "regenerator-runtime/runtime";
import "./globals.css";
import "./prosemirror.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// roboto_serif
const best = EB_Garamond({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EStudy",
  description: "Learn and grow your english with EStudy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head>
      <body
        className={`${best.className} ${geistSans.className} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={process.env.CLIENT_ID || ""}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <ToasterProvider>{children}</ToasterProvider>
            </AuthProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
