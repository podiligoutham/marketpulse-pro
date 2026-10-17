import { LoaderCircle, Plus, Search } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import type { AddStockResult } from "../../types/watchlist";
import type { StockSearchResult } from "../../api/stockSearchApi";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useStockSearchQuery } from "../../hooks/useStockSearchQuery";

type AddStockFormProps = {
  onAddStock: (
    stock: StockSearchResult,
  ) => Promise<AddStockResult>;
  isPending: boolean;
};

export function AddStockForm({
  onAddStock,
  isPending,
}: AddStockFormProps) {
  const [query, setQuery] = useState("");
  const [selectedStock, setSelectedStock] =
    useState<StockSearchResult | null>(null);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const debouncedQuery = useDebouncedValue(query, 300);

  const {
    data: searchResults = [],
    isFetching,
    isError,
  } = useStockSearchQuery(
    selectedStock ? "" : debouncedQuery,
  );

  const shouldShowSuggestions =
    showSuggestions &&
    !selectedStock &&
    query.trim().length >= 2;

  const isWaitingForDebounce =
    query.trim() !== debouncedQuery.trim();

  function handleQueryChange(value: string) {
    setQuery(value);
    setSelectedStock(null);
    setError("");
    setShowSuggestions(true);
  }

  function handleSelectStock(stock: StockSearchResult) {
    setSelectedStock(stock);
    setQuery(stock.symbol);
    setShowSuggestions(false);
    setError("");
  }

  async function addStock(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedStock) {
      setError("Please select a stock from the search results.");
      return;
    }

    try {
      const result = await onAddStock(selectedStock);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setQuery("");
      setSelectedStock(null);
      setError("");
      setShowSuggestions(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to add stock.",
      );
    }
  }

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Add a stock
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Search by stock symbol or company name.
        </p>
      </div>

      <form
        onSubmit={addStock}
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        <div className="relative min-w-0 flex-1">
          <label
            htmlFor="stock-symbol"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Search stocks
          </label>

          <div className="relative">
            <Search
              size={18}
              aria-hidden="true"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />

            <input
              id="stock-symbol"
              type="text"
              placeholder="Search NVDA, Tesla, Microsoft..."
              autoComplete="off"
              value={query}
              disabled={isPending}
              onChange={(event) =>
                handleQueryChange(event.target.value)
              }
              onFocus={() => {
                if (!selectedStock) {
                  setShowSuggestions(true);
                }
              }}
              className="
                w-full rounded-lg border border-slate-600
                bg-slate-900 py-2.5 pr-10 pl-10
                text-sm text-white
                placeholder:text-slate-500
                transition-colors
                focus:border-sky-500 focus:outline-none
                focus:ring-2 focus:ring-sky-500/20
                disabled:opacity-50
              "
            />

            {shouldShowSuggestions &&
              (isFetching || isWaitingForDebounce) && (
                <LoaderCircle
                  size={18}
                  aria-hidden="true"
                  className="absolute top-1/2 right-3 -translate-y-1/2 animate-spin text-sky-400"
                />
              )}
          </div>

          {shouldShowSuggestions && (
            <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-lg border border-slate-600 bg-slate-900 shadow-xl">
              {isWaitingForDebounce || isFetching ? (
                <p
                  role="status"
                  className="px-4 py-3 text-sm text-slate-400"
                >
                  Searching stocks...
                </p>
              ) : isError ? (
                <p
                  role="alert"
                  className="px-4 py-3 text-sm text-red-400"
                >
                  Stock search failed. Please try again.
                </p>
              ) : searchResults.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-400">
                  No matching stocks found.
                </p>
              ) : (
                <ul>
                  {searchResults.slice(0, 10).map((stock) => (
                    <li
                      key={`${stock.symbol}-${stock.displaySymbol}`}
                    >
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          handleSelectStock(stock)
                        }
                        className="
                          flex w-full items-center justify-between
                          gap-3 px-4 py-3 text-left
                          transition-colors
                          hover:bg-slate-800
                          focus:bg-slate-800
                          focus:outline-none
                        "
                      >
                        <span className="min-w-0">
                          <span className="block font-semibold text-white">
                            {stock.displaySymbol ||
                              stock.symbol}
                          </span>

                          <span className="block truncate text-xs text-slate-400">
                            {stock.companyName}
                          </span>
                        </span>

                        <span className="shrink-0 text-xs text-slate-500">
                          {stock.type}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {selectedStock && (
            <p className="mt-2 text-xs text-emerald-400">
              Selected: {selectedStock.symbol} —{" "}
              {selectedStock.companyName}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mt-2 text-xs font-medium text-red-400"
            >
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || !selectedStock}
          className="
            inline-flex items-center justify-center gap-2
            rounded-lg bg-sky-600 px-5 py-2.5
            text-sm font-semibold text-white
            transition-colors
            hover:bg-sky-500
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-sky-400
            disabled:cursor-not-allowed
            disabled:opacity-50
            disabled:hover:bg-sky-600
            sm:mt-7
          "
        >
          {isPending ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
                aria-hidden="true"
              />
              Adding...
            </>
          ) : (
            <>
              <Plus size={18} aria-hidden="true" />
              Add Stock
            </>
          )}
        </button>
      </form>
    </section>
  );
}