import { Link } from "react-router";
import { mockWatchlist } from "../../data/mockWatchlist";
import { Search } from "lucide-react";
import { useWatchlistFilters } from "../../hooks/useWatchlistFilters";
import { WatchlistTable } from "../watchlist/WatchlistTable";
import { WatchlistEmptyState } from "../watchlist/WatchlistEmptyState";

export function WatchlistPreview() {
  const {
    searchQuery,
    setSearchQuery,
    sortKey,
    sortDirection,
    handleSort,
    sortedStocks,
  } = useWatchlistFilters(mockWatchlist);

  return (
    <section className='min-w-0 rounded-xl border border-slate-700 bg-slate-800 p-5'>
      <div className='mb-5 flex items-center justify-between gap-4'>
        <h2 className='text-lg font-semibold text-white'>Watchlist</h2>

        <Link
          to='/watchlist'
          className='text-sm font-medium text-sky-400 hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400'>
          View all →
        </Link>
      </div>

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
          onChange={(event) => setSearchQuery(event.target.value)}
          className='w-full rounded-lg border border-slate-600 bg-slate-900 py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none'
        />
      </div>

      <div className='mb-4 flex items-center justify-between gap-3'>
        <p className='text-xs text-slate-400'>
          Showing {sortedStocks.length} of {mockWatchlist.length} stocks
        </p>

        {searchQuery.length > 0 && (
          <button
            type='button'
            onClick={() => {
              setSearchQuery("");
            }}
            className='
      rounded-md
      px-2 py-1
      text-xs font-medium
      text-sky-400
      transition-colors
      hover:bg-slate-700
      hover:text-sky-300
      focus-visible:outline-2
      focus-visible:outline-offset-2
      focus-visible:outline-sky-400
    '>
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
        />
      ) : (
        <WatchlistEmptyState/>
      )}
    </section>
  );
}
