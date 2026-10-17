import { LoaderCircle, Trash2 } from "lucide-react";
import { SortableTableHeader } from "../common/SortableTableHeader";
import type { WatchlistStock } from "../../api/watchlistApi";
import type { SortKey, SortDirection } from "../../hooks/useWatchlistFilters";
import { useMarketStore } from "../../store/useMarketStore";

type WatchlistTableProps = {
  stocks: WatchlistStock[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (column: SortKey) => void;
  handleRemove?: (symbol: string) => Promise<void>;
  isRemoving?: boolean;
  removingSymbol?: string;
};

export function WatchlistTable({
  stocks,
  sortKey,
  sortDirection,
  onSort,
  handleRemove,
  isRemoving,
  removingSymbol,
}: WatchlistTableProps) {
  const selectedSymbol = useMarketStore((state) => state.selectedSymbol);

  const selectStock = useMarketStore((state) => state.selectStock);
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
              label='Company'
              column='companyName'
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
            />

            <SortableTableHeader
              label='Added'
              column='createdAt'
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
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
            const removing = isRemoving && removingSymbol === stock.symbol;

            return (
              <tr
                key={stock.symbol}
                className='border-b border-slate-700/60 last:border-b-0 hover:bg-slate-700/30'>
                <th
                  scope='row'
                  className='px-3 py-3 text-left'>
                  <button
                    type='button'
                    onClick={() => selectStock(stock.symbol)}
                    aria-pressed={selectedSymbol === stock.symbol}
                    className={`rounded px-2 py-1 font-semibold transition-colors ${
                      selectedSymbol === stock.symbol
                        ? "bg-sky-500/20 text-sky-300"
                        : "text-white hover:text-sky-400"
                    }`}>
                    {stock.symbol}
                  </button>
                </th>

                <td className='px-3 py-3 text-slate-300'>
                  {stock.companyName}
                </td>

                <td className='px-3 py-3 text-slate-300'>
                  {stock.createdAt
                    ? new Date(stock.createdAt).toLocaleDateString()
                    : "—"}
                </td>

                {handleRemove && (
                  <td className='px-3 py-3 text-right'>
                    <button
                      type='button'
                      disabled={isRemoving}
                      onClick={() => void handleRemove(stock.symbol)}
                      aria-label={`Remove ${stock.symbol} from watchlist`}
                      className='inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50'>
                      {removing ? (
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
