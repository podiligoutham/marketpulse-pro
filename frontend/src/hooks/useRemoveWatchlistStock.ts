import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeWatchlistStock } from "../api/watchlistApi";
import type { WatchlistStock } from "../api/watchlistApi";

const WATCHLIST_QUERY_KEY = ["watchlist"] as const;

export function useRemoveWatchlistStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWatchlistStock,

    onMutate: async (symbol: string) => {
      // 1. Cancel any ongoing watchlist refetch.
      await queryClient.cancelQueries({
        queryKey: WATCHLIST_QUERY_KEY,
      });

      // 2. Save the current cache for rollback.
      const previousStocks =
        queryClient.getQueryData<WatchlistStock[]>(WATCHLIST_QUERY_KEY);

      // 3. Optimistically remove the stock.
      queryClient.setQueryData<WatchlistStock[]>(
        WATCHLIST_QUERY_KEY,
        (oldStocks) => {
          if (!oldStocks) {
            return undefined;
          }

          return oldStocks.filter((stock) => stock.symbol !== symbol);
        },
      );

      // 4. Return the snapshot.
      return { previousStocks };
    },

    onError: (_error, _symbol, context) => {
      // 5. Restore the previous cache if removal fails.
      if (context?.previousStocks !== undefined) {
        queryClient.setQueryData(WATCHLIST_QUERY_KEY, context.previousStocks);
      }
    },

    onSettled: async () => {
      // 6. Reconcile cached data with the server.
      await queryClient.invalidateQueries({
        queryKey: WATCHLIST_QUERY_KEY,
      });
    },
  });
}
