import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { WatchlistContext } from "./WatchlistContext";
import { mockWatchlist } from "../data/mockWatchlist";
import type { WatchlistStock } from "../types/market";
import { mockStockCatalog } from "../data/mockStockCatalog";
import type { AddStockResult } from "../types/watchlist";

type WatchlistProviderProps = {
  children: ReactNode;
};

export function WatchlistProvider({ children }: WatchlistProviderProps) {
  const [stocks, setStocks] = useState<WatchlistStock[]>(() => {
    const saved = localStorage.getItem("marketpulse.watchlist");

    if (!saved) {
      return mockWatchlist;
    }

    try {
      return JSON.parse(saved) as WatchlistStock[];
    } catch {
      return mockWatchlist;
    }
  });

  useEffect(() => {
    localStorage.setItem("marketpulse.watchlist", JSON.stringify(stocks));
  }, [stocks]);

  function handleAddStock(stock: string): AddStockResult {
    const newStock = mockStockCatalog.find((s) => s.symbol === stock);
    if (!newStock) {
      return {
        success: false,
        error: `${stock} was not found in our stock catalog`,
      };
    }
    const stockExists = stocks.some((s) => s.symbol === stock);
    if (stockExists) {
      return {
        success: false,
        error: `${stock} is already in your watchlist.`,
      };
    }
    setStocks((previousStocks) => [...previousStocks, newStock]);
    return {
      success: true,
    };
  }

  function handleRemoveStock(stock: string) {
    setStocks((previousStocks) =>
      previousStocks.filter((s) => s.symbol !== stock),
    );
  }

  // TODO: Move handleAddStock here.
  // TODO: Move handleRemoveStock here.
  // TODO: Persist stocks to localStorage.

  return (
    <WatchlistContext.Provider
      value={{
        stocks,
        addStock: handleAddStock,
        removeStock: handleRemoveStock,
      }}>
      {children}
    </WatchlistContext.Provider>
  );
}
