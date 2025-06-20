import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write Blog - EStudy",
  description: "Learn and grow your english with EStudy",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
