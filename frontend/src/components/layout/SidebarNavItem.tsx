import { NavLink } from "react-router";
import type { LucideIcon } from "lucide-react";

type SidebarNavItemProps = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export function SidebarNavItem({
  label,
  path,
  icon: Icon,
}: SidebarNavItemProps) {
  return (
    <NavLink
      to={path}
      end={path === "/"}
      title={label}
      className={({ isActive }) =>
        `flex min-h-11 items-center gap-3 rounded-lg px-3
         transition-colors duration-150
         focus-visible:outline-2 focus-visible:outline-sky-400
         ${
           isActive
             ? "bg-sky-500/10 text-sky-400"
             : "text-slate-400 hover:bg-slate-800 hover:text-white"
         }`
      }
    >
      <Icon size={20} aria-hidden="true" className="shrink-0" />
      <span className="hidden text-sm font-medium lg:block">
        {label}
      </span>
    </NavLink>
  );
}