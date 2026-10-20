import { useMarketStore } from "../../store/useMarketStore";
import { useStockQuoteQuery } from "../../hooks/useStockQuoteQuery";
import { LoaderCircle } from "lucide-react";

export function StockQuoteCard() {
  const selectedSymbol = useMarketStore(
    (state) => state.selectedSymbol,
  );

  const {
    data: quote,
    isPending,
    isError,
    isFetching,
  } = useStockQuoteQuery(selectedSymbol ?? "");

  if (!selectedSymbol) {
    return (
      <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
        <h2 className="text-lg font-semibold text-white">
          Stock Quote
        </h2>
        <p className="mt-3 text-sm text-slate-400">
          Select a stock from your watchlist.
        </p>
      </section>
    );
  }

  if (isPending) {
    return (
      <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
        <LoaderCircle className="animate-spin text-sky-400" />
        <p className="mt-2 text-sm text-slate-400">
          Loading {selectedSymbol} quote...
        </p>
      </section>
    );
  }

  if (isError || !quote) {
    return (
      <section
        role="alert"
        className="rounded-xl border border-slate-700 bg-slate-800 p-5"
      >
        <p className="text-sm text-red-400">
          Unable to load quote for {selectedSymbol}.
        </p>
      </section>
    );
  }

  const isPositive = (quote.change ?? 0) >= 0;

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          {quote.symbol}
        </h2>

        {isFetching && (
          <LoaderCircle
            size={16}
            className="animate-spin text-sky-400"
          />
        )}
      </div>

      <p className="mt-4 text-3xl font-bold text-white">
        ${quote.currentPrice.toFixed(2)}
      </p>

      <p
        className={`mt-2 text-sm font-medium ${
          isPositive ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {quote.change == null
          ? "Change unavailable"
          : `${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)}`}
        {" "}
        {quote.changePercent == null
          ? ""
          : `(${quote.changePercent.toFixed(2)}%)`}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-400">Day High</p>
          <p className="font-medium text-white">
            {quote.high == null ? "—" : `$${quote.high.toFixed(2)}`}
          </p>
        </div>

        <div>
          <p className="text-slate-400">Day Low</p>
          <p className="font-medium text-white">
            {quote.low == null ? "—" : `$${quote.low.toFixed(2)}`}
          </p>
        </div>
      </div>

      <p className="mt-5 text-xs text-slate-500">
        Quote timestamp:{" "}
        {new Date(quote.updatedAt).toLocaleString()}
      </p>
    </section>
  );
}