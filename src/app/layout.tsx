import FloatingToolboxProvider from "@/components/contexts/FloatingToolboxContext";
import { ToasterProvider } from "@/components/contexts/ToasterContext";
import { ThemeProvider } from "@/components/theme-toggle";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Metadata } from "next";
import { EB_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
      <body
        className={`${best.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FloatingToolboxProvider>
          <GoogleOAuthProvider clientId={process.env.CLIENT_ID || ""}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ToasterProvider>{children}</ToasterProvider>
            </ThemeProvider>
          </GoogleOAuthProvider>
        </FloatingToolboxProvider>
      </body>
    </html>
  );
}
