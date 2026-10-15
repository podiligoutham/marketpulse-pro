import { ListPlus } from "lucide-react";

export function WatchlistEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
  <div className="mb-4 rounded-full bg-slate-700/50 p-4">
    <ListPlus size={28} className="text-sky-400" aria-hidden="true" />
  </div>

  <h3 className="text-base font-semibold text-white">
    Your watchlist is empty
  </h3>

  <p className="mt-2 max-w-sm text-sm text-slate-400">
    Add your first stock using the form above to start tracking it.
  </p>
</div>
  );
}
