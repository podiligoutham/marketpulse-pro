import type { LucideIcon } from "lucide-react";

type SidebarNavItemProps = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

export function SidebarNavItem({
  label,
  icon: Icon,
  active = false,
}: SidebarNavItemProps) {
  return (
    <div
      aria-current={active ? "page" : undefined}
      title={label}
      className={`
        flex min-h-11 items-center gap-3 rounded-lg px-3
        transition-colors duration-150
        ${
          active
            ? "bg-sky-500/10 text-sky-400"
            : "text-slate-400"
        }
      `}
    >
      <Icon
        size={20}
        strokeWidth={1.8}
        aria-hidden="true"
        className="shrink-0"
      />

      <span className="hidden text-sm font-medium lg:block">
        {label}
      </span>
    </div>
  );
}