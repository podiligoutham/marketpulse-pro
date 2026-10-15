import { useQuery } from "@tanstack/react-query";
import { fetchWatchlist } from "../api/watchlistApi";

export function useWatchlistQuery() {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: fetchWatchlist,
  });
}