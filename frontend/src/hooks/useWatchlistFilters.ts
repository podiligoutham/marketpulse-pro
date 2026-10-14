import { useState } from "react";
import type { WatchlistStock } from "../types/market";

export type SortKey = "symbol" | "price" | "changePercent";
export type SortDirection = "asc" | "desc";

export function useWatchlistFilters(stocks: WatchlistStock[]) {
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredStocks = stocks.filter((stock) => {
    const matchesSymbol = stock.symbol.toLowerCase().includes(normalizedQuery);

    const matchesCompany = stock.companyName
      .toLowerCase()
      .includes(normalizedQuery);

    return matchesSymbol || matchesCompany;
  });

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    let comparison;
    if (sortKey === "symbol") {
      comparison = a.symbol.localeCompare(b.symbol);
    } else if (sortKey === "price") {
      comparison = a.price - b.price;
    } else {
      comparison = a.changePercent - b.changePercent;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  function handleSort(column: SortKey) {
    if (sortKey === column) {
      setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"));
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
