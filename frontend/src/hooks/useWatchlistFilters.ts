import { useState } from "react";
import type { WatchlistStock } from "../api/watchlistApi";

export type SortKey = "symbol" | "companyName" | "createdAt";
export type SortDirection = "asc" | "desc";

export function useWatchlistFilters(stocks: WatchlistStock[]) {
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(normalizedQuery) ||
      stock.companyName.toLowerCase().includes(normalizedQuery),
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    const comparison =
      sortKey === "symbol"
        ? a.symbol.localeCompare(b.symbol)
        : sortKey === "companyName"
          ? a.companyName.localeCompare(b.companyName)
          : a.createdAt.localeCompare(b.createdAt);

    return sortDirection === "asc" ? comparison : -comparison;
  });

  function handleSort(column: SortKey) {
    if (sortKey === column) {
      setSortDirection((previous) =>
        previous === "asc" ? "desc" : "asc",
      );
    } else {
      setSortKey(column);
      setSortDirection("asc");
    }
  }

  return {
    searchQuery,
    setSearchQuery,
    sortKey,
    sortDirection,
    handleSort,
    sortedStocks,
  };
}