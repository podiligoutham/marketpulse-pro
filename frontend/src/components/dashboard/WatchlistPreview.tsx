import { Link } from "react-router";
import { mockWatchlist } from "../../data/mockWatchlist";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

type SortKey = "symbol" | "price" | "changePercent";
type SortDirection = "asc" | "desc";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function WatchlistPreview() {
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedStocks = [...mockWatchlist].sort((a, b) => {
    let comparison;
    if (sortKey === "symbol") {
      comparison = a.symbol.localeCompare(b.symbol);
    } else if (sortKey === "price") {
      comparison = a.price - b.price;
    } else {
      comparison = a.changePercent - b.changePercent;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  function handleSort(column: SortKey) {
    if (sortKey === column) {
      setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(column);
      setSortDirection("asc");
    }
  }

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

      <div className='w-full overflow-x-auto'>
        <table className='w-full min-w-105 text-left text-sm'>
          <thead className='border-b border-slate-700 text-slate-400'>
            <tr>
              <th
                scope='col'
                aria-sort={
                  sortKey === "symbol"
                    ? sortDirection === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
                className='px-3 py-3 text-left font-medium'>
                <button
                  type='button'
                  onClick={() => handleSort("symbol")}
                  className='inline-flex items-center gap-1 rounded text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-sky-400'>
                  Symbol
                  <ArrowUpDown
                    size={14}
                    aria-hidden='true'
                  />
                </button>
              </th>
              <th
                scope='col'
                aria-sort={
                  sortKey === "price"
                    ? sortDirection === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
                className='px-3 py-3 text-right font-medium'>
                <button
                  type='button'
                  onClick={() => handleSort("price")}
                  className='inline-flex items-center gap-1 rounded text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-sky-400'>
                  Price
                  <ArrowUpDown
                    size={14}
                    aria-hidden='true'
                  />
                </button>
              </th>
              <th
                scope='col'
                aria-sort={
                  sortKey === "changePercent"
                    ? sortDirection === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
                className='px-3 py-3 text-right font-medium'>
                <button
                  type='button'
                  onClick={() => handleSort("changePercent")}
                  className='inline-flex items-center gap-1 rounded text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-sky-400'>
                  Change
                  <ArrowUpDown
                    size={14}
                    aria-hidden='true'
                  />
                </button>
              </th>
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
    </section>
  );
}
