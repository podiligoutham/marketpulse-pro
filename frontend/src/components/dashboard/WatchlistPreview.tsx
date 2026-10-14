import { Link } from "react-router";
import { mockWatchlist } from "../../data/mockWatchlist";
import { Search } from "lucide-react";
import { useWatchlistFilters } from "../../hooks/useWatchlistFilters";
import { SortableTableHeader } from "../common/SortableTableHeader";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

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
        <div className='w-full overflow-x-auto'>
          <table className='w-full min-w-105 text-left text-sm'>
            <thead className='border-b border-slate-700 text-slate-400'>
              <tr>
                <SortableTableHeader
                  label='Symbol'
                  column='symbol'
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label='Price'
                  column='price'
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  align='right'
                />
                <SortableTableHeader
                  label='Change'
                  column='changePercent'
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  align='right'
                />
              </tr>
            </thead>

            <tbody>
              {sortedStocks.map((stock) => {
                const isPositive = stock.changePercent > 0;
                const isNegative = stock.changePercent < 0;

                const changeColor = isPositive
                  ? "text-green-400"
                  : isNegative
                    ? "text-red-400"
                    : "text-slate-400";

                const formattedChange = `${
                  isPositive ? "+" : ""
                }${stock.changePercent.toFixed(2)}%`;

                return (
                  <tr
                    key={stock.symbol}
                    className='border-b border-slate-700/60 last:border-b-0 hover:bg-slate-700/30'>
                    <th
                      scope='row'
                      className='px-3 py-3 text-left font-normal'>
                      <div className='flex flex-col gap-1'>
                        <span className='font-semibold text-white'>
                          {stock.symbol}
                        </span>
                        <span className='text-xs text-slate-400'>
                          {stock.companyName}
                        </span>
                      </div>
                    </th>

                    <td className='px-3 py-3 text-right tabular-nums text-white'>
                      {currencyFormatter.format(stock.price)}
                    </td>

                    <td
                      className={`px-3 py-3 text-right font-medium tabular-nums ${changeColor}`}>
                      {formattedChange}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='py-8 text-center'>
          <p className='text-sm font-medium text-white'>
            No matching stocks found
          </p>
          <p className='mt-1 text-sm text-slate-400'>
            Try searching for a different symbol or company.
          </p>
        </div>
      )}
    </section>
  );
}
