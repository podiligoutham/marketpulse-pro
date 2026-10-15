import { createContext } from "react";
import type { WatchlistStock } from "../types/market";
import type { AddStockResult } from "../types/watchlist";

export type WatchlistContextValue = {
  stocks: WatchlistStock[];
  addStock: (symbol: string) => AddStockResult;
  removeStock: (symbol: string) => void;
};

export const WatchlistContext = createContext<WatchlistContextValue | null>(
  null,
);
