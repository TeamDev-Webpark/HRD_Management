"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Award,
  BarChart3,
  Building2,
  ChevronDown,
  ChevronUp,
  Compass,
  GraduationCap,
  Layers,
  LayoutDashboard,
  MonitorPlay,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCircle2,
  Users,
  X,
} from "lucide-react";
import { useLayout } from "@/context/LayoutContext";
import { ACTIVE_SIDEBAR_MENUS, ROLE_HOME_ROUTE } from "@/data/mock/layout";
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
        ? "text-[#60A5FA]"
        : "text-slate-400 group-hover:text-white"
  }`;
  if (icon === "performance") return <Target className={cls} />;
  if (icon === "training") return <GraduationCap className={cls} />;
  if (icon === "lms") return <MonitorPlay className={cls} />;
  if (icon === "competency") return <Layers className={cls} />;
  if (icon === "idp") return <TrendingUp className={cls} />;
  if (icon === "career") return <Compass className={cls} />;
  if (icon === "talent") return <Award className={cls} />;
  if (icon === "reports") return <BarChart3 className={cls} />;
  if (icon === "roles") return <ShieldCheck className={cls} />;
  if (icon === "ess") return <UserCircle2 className={cls} />;
  if (icon === "mss") return <Users className={cls} />;
  if (icon === "hrm") return <Building2 className={cls} />;
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
  const { role } = useLayout();

  const visibleMenus = ACTIVE_SIDEBAR_MENUS.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  const [expandedId, setExpandedId] = useState<string | null>(() => {
    const matched = ACTIVE_SIDEBAR_MENUS.find(
      (item) => item.children?.length && pathname === item.href
    );
    return matched?.id ?? null;
  });

  useEffect(() => {
    const matched = ACTIVE_SIDEBAR_MENUS.find(
      (item) => item.children?.length && pathname === item.href
    );
    setExpandedId(matched?.id ?? null);
  }, [pathname]);

  const toggleGroup = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const sections = visibleMenus.reduce<
    { sectionName: string; items: SidebarMenuItem[] }[]
  >((acc, item) => {
    const name = item.section ?? "เมนูหลัก";
    const existing = acc.find((s) => s.sectionName === name);
    if (existing) {
      existing.items.push(item);
    } else {
      acc.push({ sectionName: name, items: [item] });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-5">
      {sections.map((sec, secIdx) => (
        <div key={sec.sectionName}>
          {!collapsed ? (
            <div className="mb-2 flex items-center gap-2 px-3">
              <span className="text-[11px] font-semibold tracking-wider text-[#22D3EE]">
                {sec.sectionName}
              </span>
              <span className="h-px flex-1 bg-[#22D3EE]/25" aria-hidden="true" />
            </div>
          ) : (
            secIdx > 0 && <div className="mx-2 my-2 h-px bg-slate-800" aria-hidden="true" />
          )}

          <ul className="space-y-1">
            {sec.items.map((item) => {
              const allowedChildren = item.children?.filter(
                (sub) => !sub.roles || sub.roles.includes(role)
              );
              const hasChildren = Boolean(allowedChildren && allowedChildren.length > 1);
              const singleHref =
                allowedChildren && allowedChildren.length === 1
                  ? allowedChildren[0].href
                  : item.href;
              const isCurrentRoute =
                pathname === item.href || (item.href === "/dashboard" && pathname === "/");
              const isExpanded = expandedId === item.id;

              if (hasChildren && !collapsed) {
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.id)}
                      className={`group flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] transition-all ${
                        isCurrentRoute
                          ? "bg-slate-800/90 font-semibold text-white ring-1 ring-slate-700/80"
                          : "font-normal text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <MenuIcon icon={item.icon} active={false} softActive={isCurrentRoute} />
                        <span className="truncate">{item.label}</span>
                      </span>
                {isExpanded ? (
                  <ChevronUp
                    className={`h-4 w-4 shrink-0 ${
                      isCurrentRoute ? "text-[#60A5FA]" : "text-slate-400"
                    }`}
                  />
                ) : (
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 ${
                      isCurrentRoute ? "text-[#60A5FA]" : "text-slate-400"
                    }`}
                  />
                )}
              </button>

              {isExpanded && allowedChildren && (() => {
                const hasGroups = allowedChildren.some((c) => Boolean(c.group));
                const groupedSections: { groupName: string | null; items: typeof allowedChildren }[] = [];

                if (hasGroups) {
                  allowedChildren.forEach((child) => {
                    const gName = child.group ?? "อื่นๆ";
                    const existing = groupedSections.find((s) => s.groupName === gName);
                    if (existing) {
                      existing.items.push(child);
                    } else {
                      groupedSections.push({ groupName: gName, items: [child] });
                    }
                  });
                } else {
                  groupedSections.push({ groupName: null, items: allowedChildren });
                }

                const firstTabKey = allowedChildren[0]?.tabKey;

                return (
                  <div className="mb-2 mt-2 space-y-3 border-b border-slate-700/70 pb-3.5">
                    {groupedSections.map((section, secIdx) => (
                      <div key={section.groupName ?? secIdx}>
                        {section.groupName && (
                          <div className="mb-1.5 pl-4">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800/80 px-2.5 py-1 text-[11.5px] font-semibold text-slate-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#60A5FA]" />
                              {section.groupName}
                            </span>
                          </div>
                        )}
                        <div className="relative ml-6 pl-6">
                          <span
                            aria-hidden="true"
                            className="absolute bottom-3 left-[3px] top-3 w-[1.5px] bg-slate-700/80"
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
                                        ? "font-semibold text-white"
                                        : "font-normal text-slate-400 hover:text-slate-100"
                                    }`}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className={`absolute -left-[24px] h-2 w-2 rounded-full transition-all ${
                                        subActive
                                          ? "bg-[#60A5FA] ring-4 ring-[#2563EB]/30"
                                          : "bg-slate-600 group-hover:bg-slate-400"
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
                    href={singleHref}
                    title={collapsed ? `${item.label} (${item.labelEn})` : undefined}
                    onClick={() => isMobile && onNavigate()}
                    className={`group flex items-center rounded-xl py-2.5 text-[14px] transition-all ${
                      collapsed ? "justify-center px-2.5" : "gap-3 px-3.5"
                    } ${
                      isCurrentRoute
                        ? "bg-[#2563EB] font-medium text-white shadow-[0_8px_18px_-4px_rgba(37,99,235,0.5)]"
                        : "font-normal text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <MenuIcon icon={item.icon} active={isCurrentRoute} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen, role } =
    useLayout();

  const renderContent = (isMobile: boolean) => {
    const collapsed = !isMobile && sidebarCollapsed;

    return (
      <div className="flex h-full flex-col border-r border-slate-800/80 bg-[#0F172A] text-slate-100">
        {/* Brand Header */}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-slate-800/80 px-5 ${
            collapsed ? "justify-center px-3" : "justify-between"
          }`}
        >
          <Link
            href={ROLE_HOME_ROUTE[role]}
            onClick={() => isMobile && setMobileMenuOpen(false)}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-xs">
              <img
                src="/logo.png"
                alt="HRD Management Logo"
                className="h-full w-full object-contain"
              />
            </div>
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <div className="text-[16px] font-bold tracking-wide text-white">HRD</div>
                <div className="text-[13px] font-medium tracking-wide text-slate-300">
                  Management
                </div>
              </div>
            )}
          </Link>

          {isMobile ? (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="ปิดเมนู"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"
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
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <PanelLeftClose className="h-4.5 w-4.5" />
              </button>
            )
          )}
        </div>

        {/* Expand Trigger when collapsed */}
        {collapsed && (
          <div className="flex justify-center pt-3 pb-1">
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              title="ขยายแถบเมนู"
              aria-label="ขยายแถบเมนู"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <PanelLeftOpen className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

        {/* Active Navigation Items */}
        <nav aria-label="เมนูหลัก" className="hrd-scrollbar flex-1 overflow-y-auto px-4 py-3.5">
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
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
