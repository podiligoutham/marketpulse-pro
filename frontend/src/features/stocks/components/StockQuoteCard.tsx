import { useStockQuoteStream } from "../hooks/useStockQuoteStream";
import { ConnectionStatus } from "./ConnectionStatus";

interface StockQuoteCardProps {
  symbol: string;
}

export function StockQuoteCard({ symbol }: StockQuoteCardProps) {
  const { quote, status, error } = useStockQuoteStream(symbol);

  const isPositive = (quote?.change ?? 0) >= 0;

  return (
    <section className='rounded-xl border border-slate-800 bg-slate-900 p-5 text-white'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>{symbol.toUpperCase()}</h2>

        <ConnectionStatus status={status} />
      </div>

      {quote ? (
        <div className='mt-5'>
          <p className='text-3xl font-bold'>${quote.currentPrice.toFixed(2)}</p>

          <p
            className={`mt-2 text-sm ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}>
            {isPositive ? "+" : ""}
            {quote.change.toFixed(2)}
            {" ("}
            {quote.changePercent.toFixed(2)}%{")"}
          </p>
        </div>
      ) : (
        <p className='mt-5 text-slate-400'>Waiting for stock quote...</p>
      )}

      {error && <p className='mt-3 text-sm text-amber-400'>{error}</p>}
    </section>
  );
}
