import { LoaderCircle } from "lucide-react";

export function WatchlistLoadingState() {
  return (
    <div
      role='status'
      aria-live='polite'
      className='rounded-xl border border-slate-700 bg-slate-800 p-5'>
      <div className='mb-5 flex items-center gap-3'>
        <LoaderCircle
          size={20}
          aria-hidden='true'
          className='animate-spin text-sky-400'
        />

        <div>
          <p className='text-sm font-medium text-white'>Loading watchlist...</p>
          <p className='mt-1 text-xs text-slate-400'>
            Fetching your tracked stocks
          </p>
        </div>
      </div>

      <div className='space-y-3 animate-pulse'>
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className='flex items-center justify-between rounded-lg bg-slate-900/60 p-4'>
            <div className='space-y-2'>
              <div className='h-3 w-20 rounded bg-slate-700' />
              <div className='h-2 w-32 rounded bg-slate-700/70' />
            </div>

            <div className='h-3 w-16 rounded bg-slate-700' />
          </div>
        ))}
      </div>
    </div>
  );
}
