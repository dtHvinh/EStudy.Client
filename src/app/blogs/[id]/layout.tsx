import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Write Blog - EStudy`,
    description: "Learn and grow your english with EStudy",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
