import { Plus } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import type { AddStockResult } from "../../pages/WatchlistPage";

type AddStockFormProps = {
  onAddStock: (symbol: string) => AddStockResult;
};

export function AddStockForm({ onAddStock }: AddStockFormProps) {
  const [stock, setStock] = useState<string>('')
  const [error, setError] = useState<string>('')
  // TODO: Implement handleSubmit.
  // TODO: Handle validation errors.

  function addStock (e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const normalizedSymbol = stock.trim().toUpperCase();
    if(!normalizedSymbol) {
        setError("Please enter a stock symbol")
        return;
    }
    const result = onAddStock(stock.trim().toUpperCase())
    if(!result.success) {
        setError(result.error)
        return;
    }
    setStock('')
    setError('')
  }

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Add a stock
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Enter a stock symbol to add it to your watchlist.
        </p>
      </div>

      <form
        onSubmit={e => addStock(e)}
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="stock-symbol"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Stock symbol
          </label>

          <input
            id="stock-symbol"
            type="text"
            placeholder="e.g. TSLA, MSFT, GOOGL"
            autoComplete="off"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="
              w-full rounded-lg border border-slate-600
              bg-slate-900 px-4 py-2.5
              text-sm text-white uppercase
              placeholder:normal-case placeholder:text-slate-500
              transition-colors
              focus:border-sky-500 focus:outline-none
              focus:ring-2 focus:ring-sky-500/20
            "
          />

          {error && (
  <p role="alert" className="mt-2 text-xs font-medium text-red-400">
    {error}
  </p>
)}
        </div>

        <button
          type="submit"
          className="
            inline-flex items-center justify-center gap-2
            rounded-lg bg-sky-600 px-5 py-2.5
            text-sm font-semibold text-white
            transition-colors
            hover:bg-sky-500
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-sky-400
            sm:mt-7
          "
        >
          <Plus size={18} aria-hidden="true" />
          Add Stock
        </button>
      </form>
    </section>
  );
}