
import { Link } from "react-router";
import { Search } from "lucide-react";

import { useWatchlistFilters } from "../../hooks/useWatchlistFilters";
import { useWatchlistQuery } from "../../hooks/useWatchlistQuery";

import { WatchlistTable } from "../watchlist/WatchlistTable";
import { WatchlistEmptyState } from "../watchlist/WatchlistEmptyState";
import { WatchlistLoadingState } from "../common/WatchlistLoadingState";
import { WatchlistErrorState } from "../common/WatchlistErrorState";
import { useLiveQuoteStore } from "../../store/useLiveQuoteStore";

export function WatchlistPreview() {
  const {
    data: stocks = [],
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useWatchlistQuery();

  const {
    searchQuery,
    setSearchQuery,
    sortKey,
    sortDirection,
    handleSort,
    sortedStocks,
  } = useWatchlistFilters(stocks);

  // Read live market data from the shared Zustand store.
  // The SSE connection is owned by WatchlistStreamProvider.
  const quotes = useLiveQuoteStore((state) => state.quotes);
  const status = useLiveQuoteStore((state) => state.status);
  const streamError = useLiveQuoteStore((state) => state.error);

  const symbolCount = new Set(
    stocks
      .map((stock) => stock.symbol.trim().toUpperCase())
      .filter(Boolean),
  ).size;

  const canStream = symbolCount > 0 && symbolCount <= 5;

  return (
    <section className='min-w-0 rounded-xl border border-slate-700 bg-slate-800 p-5'>
      <div className='mb-5 flex items-center justify-between gap-4'>
        <h2 className='text-lg font-semibold text-white'>
          Watchlist
        </h2>

        <Link
          to='/watchlist'
          className='text-sm font-medium text-sky-400 hover:text-sky-300'>
          View all →
        </Link>
      </div>

      {isPending ? (
        <WatchlistLoadingState />
      ) : isError ? (
        <WatchlistErrorState
          message={error.message}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      ) : (
        <>
          {canStream && (
            <div className='mb-4 flex items-center gap-2 text-xs'>
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  status === "connected"
                    ? "bg-green-400"
                    : status === "disconnected"
                      ? "bg-red-400"
                      : "bg-amber-400"
                }`}
                aria-hidden='true'
              />

              <span className='text-slate-300'>
                {status === "connected"
                  ? "Live stream connected"
                  : status === "connecting"
                    ? "Connecting to live prices..."
                    : status === "reconnecting"
                      ? "Reconnecting to live prices..."
                      : "Live stream disconnected"}
              </span>
            </div>
          )}

          {canStream && streamError && (
            <p
              role='status'
              className='mb-4 text-xs text-amber-400'>
              {streamError}
            </p>
          )}

          {symbolCount > 5 && (
            <p className='mb-4 text-xs text-amber-400'>
              Live streaming currently supports up to 5 stocks.
              Your saved watchlist is still available below.
            </p>
          )}

          <div className='relative mb-4'>
            <Search
              size={18}
              aria-hidden='true'
              className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400'
            />

            <input
              type='search'
              aria-label='Search watchlist stocks'
              placeholder='Search symbol or company...'
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              className='w-full rounded-lg border border-slate-600 bg-slate-900 py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none'
            />
          </div>

          <div className='mb-4 flex items-center justify-between gap-3'>
            <p className='text-xs text-slate-400'>
              Showing {sortedStocks.length} of {stocks.length} stocks
            </p>

            {searchQuery.length > 0 && (
              <button
                type='button'
                onClick={() => setSearchQuery("")}
                className='rounded-md px-2 py-1 text-xs font-medium text-sky-400 hover:text-sky-300'>
                Clear search
              </button>
            )}
          </div>

          {sortedStocks.length > 0 ? (
            <WatchlistTable
              stocks={sortedStocks}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              liveQuotes={canStream ? quotes : {}}
            />
          ) : (
            <WatchlistEmptyState />
          )}
        </>
      )}
    </section>
  );
}
