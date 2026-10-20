
import { useEffect, useMemo } from "react";
import { useWatchlistQuery } from "../../../hooks/useWatchlistQuery";
import { useWatchlistStream } from "../hooks/useWatchlistStream";
import { useLiveQuoteStore } from "../../../store/useLiveQuoteStore";

function ActiveWatchlistStream({
  symbols,
}: {
  symbols: string[];
}) {
  const { quotes, status, error } = useWatchlistStream(symbols);

  const setStreamData = useLiveQuoteStore(
    (state) => state.setStreamData,
  );

  useEffect(() => {
    setStreamData(quotes, status, error);
  }, [quotes, status, error, setStreamData]);

  return null;
}

export function WatchlistStreamProvider() {
  const { data: stocks = [], isPending, isError } =
    useWatchlistQuery();

  const symbolKey = useMemo(
    () =>
      [...new Set(
        stocks
          .map((stock) => stock.symbol.trim().toUpperCase())
          .filter(Boolean),
      )]
        .sort()
        .join(","),
    [stocks],
  );

  const symbols = useMemo(
    () => (symbolKey ? symbolKey.split(",") : []),
    [symbolKey],
  );

  const clearStream = useLiveQuoteStore(
    (state) => state.clearStream,
  );

  const canStream =
    !isPending &&
    !isError &&
    symbols.length > 0 &&
    symbols.length <= 5;

  useEffect(() => {
    if (!canStream) {
      clearStream();
    }
  }, [canStream, clearStream]);

  if (!canStream) {
    return null;
  }

  return (
    <ActiveWatchlistStream
      key={symbolKey}
      symbols={symbols}
    />
  );
}
