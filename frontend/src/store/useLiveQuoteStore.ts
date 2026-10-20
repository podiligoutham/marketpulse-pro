
import { create } from "zustand";
import type { StockQuote } from "../api/stockQuoteApi";
import type { StockStreamStatus } from "../features/stocks/types/stockQuote";

type LiveQuoteState = {
  quotes: Record<string, StockQuote>;
  updatedAt: Record<string, number>;
  status: StockStreamStatus;
  error: string | null;

  setStreamData: (
    quotes: Record<string, StockQuote>,
    status: StockStreamStatus,
    error: string | null,
  ) => void;

  clearStream: () => void;
};

export const useLiveQuoteStore = create<LiveQuoteState>((set) => ({
  quotes: {},
  updatedAt: {},
  status: "disconnected",
  error: null,

  setStreamData: (quotes, status, error) =>
    set((state) => {
      const updatedAt = { ...state.updatedAt };

      for (const [symbol, quote] of Object.entries(quotes)) {
        if (state.quotes[symbol] !== quote) {
          updatedAt[symbol] = Date.now();
        }
      }

      for (const symbol of Object.keys(updatedAt)) {
        if (!(symbol in quotes)) {
          delete updatedAt[symbol];
        }
      }

      return { quotes, updatedAt, status, error };
    }),

  clearStream: () =>
    set({
      quotes: {},
      updatedAt: {},
      status: "disconnected",
      error: null,
    }),
}));
