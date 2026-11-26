"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useLayout } from "@/context/LayoutContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { sidebarCollapsed } = useLayout();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1E293B]">
      <Sidebar />
      <div
        className={`flex min-h-screen flex-col transition-[padding-left] duration-200 ease-in-out ${
          sidebarCollapsed ? "lg:pl-[82px]" : "lg:pl-[256px]"
        }`}
      >
        <Topbar />
        <main className="flex-1 px-4 py-4 sm:px-6">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
