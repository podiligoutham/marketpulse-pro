import { useMarketStore } from "../../store/useMarketStore";
import { useWatchlistQuery } from "../../hooks/useWatchlistQuery";

export function SelectedStockCard() {
  const selectedSymbol = useMarketStore(
    (state) => state.selectedSymbol,
  );

  const clearSelection = useMarketStore(
    (state) => state.clearSelection,
  );

  const { data: stocks = [] } = useWatchlistQuery();

  const selectedStock = stocks.find(
    (stock) => stock.symbol === selectedSymbol,
  );

  if (!selectedSymbol) {
    return (
      <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
        <h2 className="font-semibold text-white">Selected Stock</h2>
        <p className="mt-2 text-sm text-slate-400">
          Select a stock from your watchlist to view its details.
        </p>
      </section>
    );
  }

  if (!selectedStock) {
    return (
      <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
        <h2 className="font-semibold text-white">Selected Stock</h2>
        <p className="mt-2 text-sm text-slate-400">
          The selected stock is no longer available in your watchlist.
        </p>
        <button
          type="button"
          onClick={clearSelection}
          className="mt-3 text-sm text-sky-400 hover:text-sky-300"
        >
          Clear selection
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
      <h2 className="text-lg font-semibold text-white">
        Selected Stock
      </h2>

      <p className="mt-4 text-2xl font-bold text-sky-400">
        {selectedStock.symbol}
      </p>

      <p className="mt-1 text-sm text-slate-300">
        {selectedStock.companyName}
      </p>

      <button
        type="button"
        onClick={clearSelection}
        className="mt-4 text-sm text-sky-400 hover:text-sky-300"
      >
        Clear selection
      </button>
    </section>
  );
}