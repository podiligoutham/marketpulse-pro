import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addWatchlistStock } from "../api/watchlistApi";

export function useAddWatchlistStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addWatchlistStock,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["watchlist"],
      });
    },
  });
}