import DashboardLayout from "@/components/layout/DashboardLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studius | Dashboard",
  description: "Your personalized learning dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
