import { AlertCircle, RefreshCw } from "lucide-react";

type WatchlistErrorStateProps = {
  message?: string;
  onRetry: () => void;
  isRetrying?: boolean;
};

export function WatchlistErrorState({
  message = "Something went wrong while fetching your stocks.",
  onRetry,
  isRetrying = false,
}: WatchlistErrorStateProps) {
  return (
    <div
      role='alert'
      className='rounded-xl border border-red-900 bg-red-950/40 p-5'>
      <div className='flex items-start gap-3'>
        <AlertCircle
          size={20}
          aria-hidden='true'
          className='mt-0.5 shrink-0 text-red-400'
        />

        <div className='min-w-0 flex-1'>
          <h3 className='font-semibold text-red-200'>
            Unable to load watchlist
          </h3>

          <p className='mt-1 text-sm text-red-300'>{message}</p>
        </div>
      </div>

      <div className='mt-4 flex justify-end'>
        <button
          type='button'
          onClick={onRetry}
          disabled={isRetrying}
          className='inline-flex items-center gap-2 rounded-lg border border-red-800 bg-red-900/60 px-4 py-2 text-sm font-medium text-red-100 transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50'>
          <RefreshCw
            size={16}
            aria-hidden='true'
            className={isRetrying ? "animate-spin" : ""}
          />
          {isRetrying ? "Retrying..." : "Try again"}
        </button>
      </div>
    </div>
  );
}
