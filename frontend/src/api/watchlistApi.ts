const BASE_URL = "/api/v1/watchlist/stocks";

export interface WatchlistStock {
  id: number;
  symbol: string;
  companyName: string;
  createdAt: string;
}

export interface AddWatchlistStockRequest {
  symbol: string;
  companyName: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);

    throw new Error(
      errorBody?.message ?? `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function fetchWatchlist(): Promise<WatchlistStock[]> {
  const response = await fetch(BASE_URL);

  return handleResponse<WatchlistStock[]>(response);
}

export async function addWatchlistStock(
  request: AddWatchlistStockRequest,
): Promise<WatchlistStock> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return handleResponse<WatchlistStock>(response);
}

export async function removeWatchlistStock(symbol: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(symbol)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);

    throw new Error(
      errorBody?.message ?? `Failed to remove stock: ${response.status}`,
    );
  }
}
