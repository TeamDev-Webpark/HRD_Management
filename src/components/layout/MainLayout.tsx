"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLayout } from "@/context/LayoutContext";
import { ROLE_HOME_ROUTE } from "@/data/mock/layout";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const EMPLOYEE_ALLOWED_ROUTES = ["/ess", "/lms", "/login"];
const ADMIN_ONLY_ROUTES = ["/roles", "/settings", "/hrm-reference"];

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed, role } = useLayout();

  const isUnauthorized =
    pathname !== "/login" &&
    pathname !== "/ui-kit" &&
    ((role === "employee" && !EMPLOYEE_ALLOWED_ROUTES.includes(pathname)) ||
      (role === "manager" && ADMIN_ONLY_ROUTES.includes(pathname)));

  useEffect(() => {
    if (isUnauthorized) {
      router.replace(ROLE_HOME_ROUTE[role]);
    }
  }, [isUnauthorized, role, router]);

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
          <div className="w-full">
            {isUnauthorized ? (
              <div className="rounded-2xl border border-[#EEF2F6] bg-white p-8 text-center text-sm text-[#64748B]">
                กำลังนำทางไปยังหน้าหลักตามสิทธิ์การใช้งานของคุณ...
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
