import { Bell, Menu, CircleUserRound } from "lucide-react";

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
        >
          <Menu size={22} />
        </button>

        <span className="font-semibold text-slate-100">
          MarketPulse Pro
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Bell size={20} className="text-slate-400" aria-hidden="true" />
        <CircleUserRound
          size={22}
          className="text-slate-400"
          aria-hidden="true"
        />
      </div>
    </header>
  );
}