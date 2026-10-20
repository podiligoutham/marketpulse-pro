import { useQuery } from "@tanstack/react-query";
import { searchStocks } from "../api/stockSearchApi";

export function useStockSearchQuery(query: string) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ["stock-search", normalizedQuery],

    queryFn: ({ signal }) =>
      searchStocks(normalizedQuery, signal),

    enabled: normalizedQuery.length >= 2,

    staleTime: 60_000,

    retry: 1,
  });
}