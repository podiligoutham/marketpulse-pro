import * as Dialog from "@radix-ui/react-dialog";
import { Activity, X } from "lucide-react";
import { NavLink } from "react-router";

type MobileNavigationProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNavigation({
  open,
  onOpenChange,
}: MobileNavigationProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />

        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-slate-950 p-4 shadow-xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="flex items-center gap-2 font-semibold text-white">
              <Activity size={22} className="text-sky-400" />
              MarketPulse Pro
            </Dialog.Title>

            <Dialog.Close
              aria-label="Close navigation"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800"
            >
              <X size={20} />
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile navigation" className="space-y-1">
            <NavLink
              to="/"
              end
              onClick={() => onOpenChange(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-3 ${
                  isActive
                    ? "bg-sky-500/10 text-sky-400"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              Dashboard
            </NavLink>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}