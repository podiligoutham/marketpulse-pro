import { useState } from "react";

import { useWatchlistFilters } from "../hooks/useWatchlistFilters";
import { useWatchlistQuery } from "../hooks/useWatchlistQuery";
import { useAddWatchlistStock } from "../hooks/useAddWatchlistStock";
import { useRemoveWatchlistStock } from "../hooks/useRemoveWatchlistStock";

import { AddStockForm } from "../components/watchlist/AddStockForm";
import { WatchlistTable } from "../components/watchlist/WatchlistTable";
import { WatchlistEmptyState } from "../components/watchlist/WatchlistEmptyState";
import { WatchlistLoadingState } from "../components/common/WatchlistLoadingState";
import { WatchlistErrorState } from "../components/common/WatchlistErrorState";

import { useLiveQuoteStore } from "../store/useLiveQuoteStore";

import type { AddStockResult } from "../types/watchlist";
import type { StockSearchResult } from "../api/stockSearchApi";

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

  const [removeError, setRemoveError] = useState("");

  const { sortKey, sortDirection, handleSort, sortedStocks } =
    useWatchlistFilters(stocks);

  // Shared live quotes from the application-level SSE provider.
  const liveQuotes = useLiveQuoteStore((state) => state.quotes);
  const streamStatus = useLiveQuoteStore((state) => state.status);
  const streamError = useLiveQuoteStore((state) => state.error);

  const symbolCount = new Set(
    stocks.map((stock) => stock.symbol.trim().toUpperCase()).filter(Boolean),
  ).size;

  const canStream = symbolCount > 0 && symbolCount <= 5;

  async function handleAddStock(
    stock: StockSearchResult,
  ): Promise<AddStockResult> {
    try {
      await addMutation.mutateAsync({
        symbol: stock.symbol,
        companyName: stock.companyName,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unable to add stock.",
      };
    }
  }

  async function handleRemoveStock(symbol: string): Promise<void> {
    setRemoveError("");

    try {
      await removeMutation.mutateAsync(symbol);
    } catch (error) {
      setRemoveError(
        error instanceof Error ? error.message : "Unable to remove stock.",
      );
    }
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
        <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h2 className='text-lg font-semibold text-white'>Your Stocks</h2>

            <p className='mt-1 text-sm text-slate-400'>
              Your saved stocks and latest available prices.
            </p>
          </div>

          {canStream && (
            <div
              role='status'
              className='flex items-center gap-2 text-xs text-slate-300'>
              <span
                aria-hidden='true'
                className={`h-2 w-2 rounded-full ${
                  streamStatus === "connected"
                    ? "bg-green-400"
                    : streamStatus === "disconnected"
                      ? "bg-red-400"
                      : "bg-amber-400"
                }`}
              />

              <span>
                {streamStatus === "connected"
                  ? "Live connected"
                  : streamStatus === "connecting"
                    ? "Connecting..."
                    : streamStatus === "reconnecting"
                      ? "Reconnecting..."
                      : "Disconnected"}
              </span>
            </div>
          )}
        </div>

        {canStream && streamError && (
          <p
            role='status'
            className='mb-4 text-sm text-amber-400'>
            {streamError}
          </p>
        )}

        {symbolCount > 5 && (
          <p className='mb-4 text-sm text-amber-400'>
            Live streaming currently supports up to 5 stocks. Your saved
            watchlist remains available.
          </p>
        )}

        {removeError && (
          <p
            role='alert'
            className='mb-4 text-sm text-red-400'>
            {removeError}
          </p>
        )}

        {sortedStocks.length > 0 ? (
          <WatchlistTable
            stocks={sortedStocks}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            handleRemove={handleRemoveStock}
            isRemoving={removeMutation.isPending}
            removingSymbol={removeMutation.variables}
            liveQuotes={canStream ? liveQuotes : {}}
          />
        ) : (
          <WatchlistEmptyState />
        )}
      </section>
    </div>
  );
}
