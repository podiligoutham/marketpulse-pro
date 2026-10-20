import { useQuery } from "@tanstack/react-query";
import { fetchStockQuote } from "../api/stockQuoteApi";

export function useStockQuoteQuery(symbol: string) {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return useQuery({
    queryKey: ["stock-quote", normalizedSymbol],

    queryFn: ({ signal }) =>
      fetchStockQuote(normalizedSymbol, signal),

    enabled: normalizedSymbol.length > 0,

    staleTime: 30_000,

    refetchInterval: 60_000,

    refetchOnWindowFocus: false,

    retry: 1,
  });
}