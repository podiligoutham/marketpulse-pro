export type StockQuote = {
  symbol: string;
  currentPrice: number;
  change: number | null;
  changePercent: number | null;
  high: number | null;
  low: number | null;
  open: number | null;
  previousClose: number | null;
  updatedAt: string;
};

export async function fetchStockQuote(
  symbol: string,
  signal?: AbortSignal,
): Promise<StockQuote> {
  const response = await fetch(
    `/api/v1/stocks/${encodeURIComponent(symbol)}/quote`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to fetch quote for ${symbol}: HTTP ${response.status}`,
    );
  }

  return (await response.json()) as StockQuote;
}