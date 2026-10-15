import { mockWatchlist } from "../data/mockWatchlist";
import { mockStockCatalog } from "../data/mockStockCatalog";
import type { WatchlistStock } from "../types/market";

let serverWatchlist: WatchlistStock[] = [...mockWatchlist];

function simulateLatency() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 500);
  });
}

export async function fetchWatchlist(): Promise<WatchlistStock[]> {
  console.log("fetch called");
  await simulateLatency();
  return [...serverWatchlist];
}

export async function addWatchlistStock(
  symbol: string,
): Promise<WatchlistStock> {
  await simulateLatency();

  const normalizedSymbol = symbol.trim().toUpperCase();

  const stock = mockStockCatalog.find(
    (item) => item.symbol === normalizedSymbol,
  );

  if (!stock) {
    throw new Error(`${normalizedSymbol} was not found.`);
  }

  if (serverWatchlist.some((item) => item.symbol === normalizedSymbol)) {
    throw new Error(`${normalizedSymbol} is already in your watchlist.`);
  }

  serverWatchlist = [...serverWatchlist, stock];

  return stock;
}

export async function removeWatchlistStock(symbol: string): Promise<void> {
  await simulateLatency();

  serverWatchlist = serverWatchlist.filter((item) => item.symbol !== symbol);
}
