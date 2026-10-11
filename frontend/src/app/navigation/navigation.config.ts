import {
  Bell,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  LayoutDashboard,
  SlidersHorizontal,
  Star,
} from "lucide-react";

export const navigationItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Markets", path: "/markets", icon: ChartNoAxesCombined },
  { label: "Screener", path: "/screener", icon: SlidersHorizontal },
  { label: "Watchlist", path: "/watchlist", icon: Star },
  { label: "Paper Trading", path: "/paper-trading", icon: BriefcaseBusiness },
  { label: "Alerts", path: "/alerts", icon: Bell },
] as const;