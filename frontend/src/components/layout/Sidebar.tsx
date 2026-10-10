import {
  Activity,
  Bell,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  LayoutDashboard,
  SlidersHorizontal,
  Star,
} from "lucide-react";

import { SidebarNavItem } from "./SidebarNavItem";

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Markets", icon: ChartNoAxesCombined },
  { label: "Screener", icon: SlidersHorizontal },
  { label: "Watchlist", icon: Star },
  { label: "Paper Trading", icon: BriefcaseBusiness },
  { label: "Alerts", icon: Bell },
] as const;

export function Sidebar() {
  return (
    <aside
      className="
        hidden
        h-screen
        w-18
        shrink-0
        border-r border-slate-800
        bg-slate-950
        md:flex md:flex-col
        lg:w-60
      "
    >
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 px-5">
        <Activity
          size={24}
          className="shrink-0 text-sky-400"
          aria-hidden="true"
        />

        <span className="hidden whitespace-nowrap font-semibold text-white lg:block">
          MarketPulse Pro
        </span>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1 overflow-y-auto p-2"
      >
        {navigationItems.map((item) => (
          <SidebarNavItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            active={item.label === "Dashboard"}
          />
        ))}
      </nav>
    </aside>
  );
}