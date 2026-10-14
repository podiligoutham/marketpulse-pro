import type { WatchlistStock } from "../types/market";

export const mockWatchlist: WatchlistStock[] = [
  { symbol: "NVDA", companyName: "NVIDIA", price: 184.25, changePercent: 1.42 },
  { symbol: "AMD", companyName: "AMD", price: 212.30, changePercent: -0.63 },
  { symbol: "AAPL", companyName: "Apple", price: 251.60, changePercent: 0.91 },
  { symbol: "AMZN", companyName: "Amazon", price: 225.80, changePercent: 0.37 },
];