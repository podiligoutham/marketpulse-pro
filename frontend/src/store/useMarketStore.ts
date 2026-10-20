import { create } from "zustand";

type MarketState = {
  selectedSymbol: string | null;
  selectStock: (symbol: string) => void;
  clearSelection: () => void;
};

export const useMarketStore = create<MarketState>((set) => ({
  selectedSymbol: null,

  selectStock: (symbol) => {
    set({ selectedSymbol: symbol });
  },

  clearSelection: () => {
    set({ selectedSymbol: null });
  },
}));