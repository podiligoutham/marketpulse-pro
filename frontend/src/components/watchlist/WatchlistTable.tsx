import { SortableTableHeader } from "../common/SortableTableHeader";
import type { WatchlistStock } from "../../types/market";
import type { SortKey, SortDirection } from "../../hooks/useWatchlistFilters";
import { LoaderCircle, Trash2 } from "lucide-react";

type WatchlistTableProps = {
  stocks: WatchlistStock[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (column: SortKey) => void;
  handleRemove?: (stock: string) => Promise<void>;
  isRemoving?: boolean;
  removingSymbol?: string;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function WatchlistTable({
  stocks,
  sortKey,
  sortDirection,
  onSort,
  handleRemove,
  isRemoving,
  removingSymbol,
}: WatchlistTableProps) {
  return (
    <div className='w-full overflow-x-auto'>
      <table className='w-full min-w-105 text-left text-sm'>
        <thead className='border-b border-slate-700 text-slate-400'>
          <tr>
            <SortableTableHeader
              label='Symbol'
              column='symbol'
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableTableHeader
              label='Price'
              column='price'
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
              align='right'
            />
            <SortableTableHeader
              label='Change'
              column='changePercent'
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
              align='right'
            />
            {handleRemove && (
              <th
                scope='col'
                className='px-3 py-3 text-right'>
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {stocks.map((stock) => {
            const isPositive = stock.changePercent > 0;
            const isNegative = stock.changePercent < 0;
            const isRemovingThisStock =
              isRemoving && removingSymbol === stock.symbol;

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

                {handleRemove && (
                  <td className='px-3 py-3 text-right'>
                    <button
                      type='button'
                      disabled={isRemoving}
                      onClick={() => handleRemove?.(stock.symbol)}
                      aria-label={`Remove ${stock.symbol} from watchlist`}
                      className='
    inline-flex items-center justify-center
    rounded-lg p-2 text-slate-400
    transition-colors
    hover:bg-red-500/10
    hover:text-red-400
    disabled:cursor-not-allowed
    disabled:opacity-50
  '>
                      {isRemovingThisStock ? (
                        <LoaderCircle
                          size={17}
                          className='animate-spin'
                          aria-hidden='true'
                        />
                      ) : (
                        <Trash2
                          size={17}
                          aria-hidden='true'
                        />
                      )}
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
