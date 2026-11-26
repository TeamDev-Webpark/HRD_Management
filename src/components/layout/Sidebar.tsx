"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  GraduationCap,
  LayoutDashboard,
  MonitorPlay,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  X,
} from "lucide-react";
import { useLayout } from "@/context/LayoutContext";
import { ACTIVE_SIDEBAR_MENUS } from "@/data/mock/layout";
import type { SidebarMenuItem } from "@/types/hrd";

function MenuIcon({
  icon,
  active,
  softActive = false,
}: {
  icon: SidebarMenuItem["icon"];
  active: boolean;
  softActive?: boolean;
}) {
  const cls = `h-5 w-5 shrink-0 transition-colors ${
    active
      ? "text-white"
      : softActive
        ? "text-[#2563EB]"
        : "text-[#94A3B8] group-hover:text-[#2563EB]"
  }`;
  if (icon === "training") return <GraduationCap className={cls} />;
  if (icon === "lms") return <MonitorPlay className={cls} />;
  if (icon === "settings") return <Settings className={cls} />;
  if (icon === "palette") return <Palette className={cls} />;
  return <LayoutDashboard className={cls} />;
}

function SidebarNavList({
  collapsed,
  isMobile,
  onNavigate,
}: {
  collapsed: boolean;
  isMobile: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab");

  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    "hrd-training": pathname === "/training",
    "hrd-lms": pathname === "/lms",
  });

  useEffect(() => {
    ACTIVE_SIDEBAR_MENUS.forEach((item) => {
      if (item.children?.length && pathname === item.href) {
        setExpandedIds((prev) => (prev[item.id] ? prev : { ...prev, [item.id]: true }));
      }
    });
  }, [pathname]);

  const toggleGroup = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <ul className="space-y-1.5">
      {ACTIVE_SIDEBAR_MENUS.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const isCurrentRoute =
          pathname === item.href || (item.href === "/dashboard" && pathname === "/");
        const isExpanded = Boolean(expandedIds[item.id]);

        if (hasChildren && !collapsed) {
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggleGroup(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-[15px] transition-all cursor-pointer ${
                  isCurrentRoute
                    ? "bg-[#EFF6FF] font-semibold text-[#2563EB]"
                    : "font-normal text-[#64748B] hover:bg-[#F7F9FC] hover:text-[#1E293B]"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3.5">
                  <MenuIcon icon={item.icon} active={false} softActive={isCurrentRoute} />
                  <span className="truncate">{item.label}</span>
                </span>
                {isExpanded ? (
                  <ChevronUp
                    className={`h-4 w-4 shrink-0 ${
                      isCurrentRoute ? "text-[#2563EB]" : "text-[#94A3B8]"
                    }`}
                  />
                ) : (
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 ${
                      isCurrentRoute ? "text-[#2563EB]" : "text-[#94A3B8]"
                    }`}
                  />
                )}
              </button>

              {isExpanded && item.children && (() => {
                const hasGroups = item.children.some((c) => Boolean(c.group));
                const groupedSections: { groupName: string | null; items: typeof item.children }[] = [];

                if (hasGroups) {
                  item.children.forEach((child) => {
                    const gName = child.group ?? "อื่นๆ";
                    const existing = groupedSections.find((s) => s.groupName === gName);
                    if (existing) {
                      existing.items.push(child);
                    } else {
                      groupedSections.push({ groupName: gName, items: [child] });
                    }
                  });
                } else {
                  groupedSections.push({ groupName: null, items: item.children });
                }

                const firstTabKey = item.children[0]?.tabKey;

                return (
                  <div className="mt-1.5 space-y-2.5 pb-1">
                    {groupedSections.map((section, secIdx) => (
                      <div key={section.groupName ?? secIdx}>
                        {section.groupName && (
                          <p className="mb-1 pl-5 text-[11px] font-semibold text-[#94A3B8]">
                            {section.groupName}
                          </p>
                        )}
                        <div className="relative ml-6 pl-6">
                          {/* Continuous subtle vertical timeline line */}
                          <span
                            aria-hidden="true"
                            className="absolute bottom-3 left-[3px] top-3 w-[1.5px] bg-[#E2E8F0]"
                          />
                          <ul className="space-y-0.5">
                            {section.items.map((sub) => {
                              const subActive =
                                isCurrentRoute &&
                                (activeTabParam
                                  ? activeTabParam === sub.tabKey
                                  : sub.tabKey === firstTabKey);

                              return (
                                <li key={sub.id} className="relative">
                                  <Link
                                    href={sub.href}
                                    onClick={() => isMobile && onNavigate()}
                                    className={`group flex items-center rounded-lg py-1.5 pr-3 text-[13.5px] transition-colors ${
                                      subActive
                                        ? "font-semibold text-[#2563EB]"
                                        : "font-normal text-[#64748B] hover:text-[#1E293B]"
                                    }`}
                                  >
                                    {/* Bullet dot on the vertical line */}
                                    <span
                                      aria-hidden="true"
                                      className={`absolute -left-[24px] h-2 w-2 rounded-full transition-all ${
                                        subActive
                                          ? "bg-[#2563EB] ring-4 ring-[#EFF6FF]"
                                          : "bg-[#CBD5E1] group-hover:bg-[#94A3B8]"
                                      }`}
                                    />
                                    <span className="truncate">{sub.label}</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </li>
          );
        }

        return (
          <li key={item.id}>
            <Link
              href={item.href}
              title={collapsed ? `${item.label} (${item.labelEn})` : undefined}
              onClick={() => isMobile && onNavigate()}
              className={`group flex items-center rounded-xl py-3 text-[15px] transition-all ${
                collapsed ? "justify-center px-2.5" : "gap-3.5 px-4"
              } ${
                isCurrentRoute
                  ? "bg-[#2563EB] font-medium text-white shadow-[0_8px_18px_-4px_rgba(37,99,235,0.4)]"
                  : "font-normal text-[#64748B] hover:bg-[#F7F9FC] hover:text-[#1E293B]"
              }`}
            >
              <MenuIcon icon={item.icon} active={isCurrentRoute} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } =
    useLayout();

  const renderContent = (isMobile: boolean) => {
    const collapsed = !isMobile && sidebarCollapsed;

    return (
      <div className="flex h-full flex-col border-r border-[#EEF2F6] bg-white">
        {/* Brand Header */}
        <div
          className={`flex h-16 shrink-0 items-center px-5 ${
            collapsed ? "justify-center px-3" : "justify-between"
          }`}
        >
          <Link
            href="/dashboard"
            onClick={() => isMobile && setMobileMenuOpen(false)}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-[0_6px_14px_rgba(37,99,235,0.28)]">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!collapsed && (
              <span className="truncate text-lg font-bold tracking-wide text-[#1E293B]">
                HRD<span className="font-semibold text-[#2563EB]">PRO</span>
              </span>
            )}
          </Link>

          {isMobile ? (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="ปิดเมนู"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-[#94A3B8] hover:bg-[#F7F9FC] hover:text-[#1E293B] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            !collapsed && (
              <button
                type="button"
                onClick={toggleSidebarCollapsed}
                title="ย่อแถบเมนู"
                aria-label="ย่อแถบเมนู"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F7F9FC] hover:text-[#1E293B] cursor-pointer"
              >
                <PanelLeftClose className="h-4.5 w-4.5" />
              </button>
            )
          )}
        </div>

        {/* Expand Trigger when collapsed */}
        {collapsed && (
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              title="ขยายแถบเมนู"
              aria-label="ขยายแถบเมนู"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-[#94A3B8] hover:bg-[#F7F9FC] hover:text-[#2563EB] cursor-pointer"
            >
              <PanelLeftOpen className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

        {/* Active Navigation Items */}
        <nav aria-label="เมนูหลัก" className="hrd-scrollbar flex-1 overflow-y-auto px-4 py-3">
          <Suspense fallback={null}>
            <SidebarNavList
              collapsed={collapsed}
              isMobile={isMobile}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </Suspense>
        </nav>
      </div>
    );
  };

  return (
    <>
      <aside
        className={`hidden transition-[width] duration-200 ease-in-out lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block ${
          sidebarCollapsed ? "lg:w-[82px]" : "lg:w-[256px]"
        }`}
      >
        {renderContent(false)}
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[264px] max-w-[85vw] shadow-xl">
            {renderContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
