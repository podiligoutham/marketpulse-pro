import { useWatchlistFilters } from "../hooks/useWatchlistFilters";
import { AddStockForm } from "../components/watchlist/AddStockForm";

import { WatchlistTable } from "../components/watchlist/WatchlistTable";
import { WatchlistEmptyState } from "../components/watchlist/WatchlistEmptyState";
import { useWatchlistQuery } from "../hooks/useWatchlistQuery";
import { useAddWatchlistStock } from "../hooks/useAddWatchlistStock";
import { useRemoveWatchlistStock } from "../hooks/useRemoveWatchlistStock";
import type { AddStockResult } from "../types/watchlist";
import { WatchlistLoadingState } from "../components/common/WatchlistLoadingState";
import { WatchlistErrorState } from "../components/common/WatchlistErrorState";

export function WatchlistPage() {
  const {
    data: stocks = [],
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useWatchlistQuery();

  const addMutation = useAddWatchlistStock();
  const removeMutation = useRemoveWatchlistStock();
  const { sortKey, sortDirection, handleSort, sortedStocks } =
    useWatchlistFilters(stocks);

  async function handleAddStock(symbol: string): Promise<AddStockResult> {
    try {
      await addMutation.mutateAsync(symbol);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unable to add stock.",
      };
    }
  }

  async function handleRemoveStock(stock: string): Promise<void> {
    await removeMutation.mutateAsync(stock);
  }

  if (isPending) {
    return <WatchlistLoadingState />;
  }

  if (isError) {
    return (
      <WatchlistErrorState
        message={error.message}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
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

      <AddStockForm
        onAddStock={handleAddStock}
        isPending={addMutation.isPending}
      />

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
            isRemoving={removeMutation.isPending}
            removingSymbol={removeMutation.variables}
          />
        ) : (
          <WatchlistEmptyState />
        )}
      </section>
    </div>
  );
}
