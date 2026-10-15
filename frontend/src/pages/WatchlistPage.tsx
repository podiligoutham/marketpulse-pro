import { useState } from "react";
import { mockWatchlist } from "../data/mockWatchlist";
import type { WatchlistStock } from "../types/market";
import { useWatchlistFilters } from "../hooks/useWatchlistFilters";
import { AddStockForm } from "../components/watchlist/AddStockForm";
import { mockStockCatalog } from "../data/mockStockCatalog";
import { WatchlistTable } from "../components/watchlist/WatchlistTable";
import { WatchlistEmptyState } from "../components/watchlist/WatchlistEmptyState";

export type AddStockResult =
  | { success: true }
  | { success: false; error: string };

export function WatchlistPage() {
  const [stocks, setStocks] = useState<WatchlistStock[]>(mockWatchlist);

  const { sortKey, sortDirection, handleSort, sortedStocks } =
    useWatchlistFilters(stocks);

  function handleAddStock(stock: string): AddStockResult {
    const newStock = mockStockCatalog.find((s) => s.symbol === stock);
    if (!newStock) {
      return {
        success: false,
        error: `${stock} was not found in our stock catalog`,
      };
    }
    const stockExists = mockStockCatalog.find((s) => s.symbol === stock);
    if (stockExists) {
      return {
        success: false,
        error: `${stock} is already in your watchlist.`,
      };
    }
    setStocks([...stocks, newStock]);
    return {
      success: true,
    };
  }

  function handleRemoveStock(stock: string) {
    setStocks(stocks.filter((s) => stock !== s.symbol));
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-white'>
            My Watchlist
          </h1>

          <p className='mt-1 text-sm text-slate-400'>
            Track and manage your favorite stocks.
          </p>
        </div>

        <div className='rounded-lg border border-slate-700 bg-slate-800 px-4 py-2'>
          <p className='text-sm text-slate-400'>Total Stocks</p>

          <p className='text-xl font-bold text-white'>{stocks.length}</p>
        </div>
      </div>

      <AddStockForm onAddStock={handleAddStock} />

      <section className='rounded-xl border border-slate-700 bg-slate-800 p-5'>
        <div className='mb-5'>
          <h2 className='text-lg font-semibold text-white'>Your Stocks</h2>

          <p className='mt-1 text-sm text-slate-400'>
            Your watchlist holdings and price movements.
          </p>
        </div>

        {sortedStocks.length > 0 ? (
          <WatchlistTable
            stocks={sortedStocks}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            handleRemove={handleRemoveStock}
          />
        ) : (
          <WatchlistEmptyState />
        )}
      </section>
    </div>
  );
}
