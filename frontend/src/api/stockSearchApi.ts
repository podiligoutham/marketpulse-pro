export type StockSearchResult = {
  symbol: string;
  companyName: string;
  displaySymbol: string;
  type: string;
};

export async function searchStocks(
  query: string,
  signal?: AbortSignal,
): Promise<StockSearchResult[]> {
  const params = new URLSearchParams({
    query: query.trim(),
  });

  const response = await fetch(
    `/api/v1/stocks/search?${params.toString()}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to search stocks (HTTP ${response.status}).`,
    );
  }

  return (await response.json()) as StockSearchResult[];
}