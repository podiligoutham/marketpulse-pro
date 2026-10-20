
import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../../config/api";
import type {
  StockStreamStatus,
} from "../types/stockQuote";
import type { StockQuote } from "../../../api/stockQuoteApi";

interface UseWatchlistStreamResult {
  quotes: Record<string, StockQuote>;
  status: StockStreamStatus;
  error: string | null;
}

const STALE_TIMEOUT_MS = 45_000;
const RETRY_DELAY_MS = 3_000;

export function useWatchlistStream(
  symbols: string[],
): UseWatchlistStreamResult {
  const symbolKey = useMemo(
    () =>
      [...new Set(
        symbols.map((symbol) => symbol.trim().toUpperCase())
          .filter(Boolean),
      )]
        .sort()
        .join(","),
    [symbols],
  );

  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [status, setStatus] =
    useState<StockStreamStatus>("connecting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbolKey) {
      return;
    }

    const url =
      `${API_BASE_URL}/v1/stocks/stream?symbols=` +
      encodeURIComponent(symbolKey);

    let eventSource: EventSource | null = null;
    let staleTimer: ReturnType<typeof setTimeout> | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    function clearStaleTimer() {
      if (staleTimer !== null) {
        clearTimeout(staleTimer);
        staleTimer = null;
      }
    }

    function scheduleRetry() {
      if (disposed || retryTimer !== null) return;

      retryTimer = setTimeout(() => {
        retryTimer = null;
        connect();
      }, RETRY_DELAY_MS);
    }

    function resetStaleTimer() {
      clearStaleTimer();

      staleTimer = setTimeout(() => {
        if (disposed) return;

        eventSource?.close();
        eventSource = null;

        setStatus("reconnecting");
        setError("No recent updates. Reconnecting...");
        scheduleRetry();
      }, STALE_TIMEOUT_MS);
    }

    function connect() {
      if (disposed) return;

      eventSource?.close();

      const source = new EventSource(url);
      eventSource = source;
      resetStaleTimer();

      source.onopen = () => {
        if (disposed || eventSource !== source) return;

        setStatus("connected");
        setError(null);
        resetStaleTimer();
      };

      source.addEventListener("quote", (event: MessageEvent) => {
        if (disposed || eventSource !== source) return;

        try {
          const quote = JSON.parse(event.data) as StockQuote;

          if (!symbolKey.split(",").includes(quote.symbol)) return;

          setQuotes((previous) => ({
            ...previous,
            [quote.symbol]: quote,
          }));

          resetStaleTimer();
        } catch {
          setError("Unable to parse stock quote.");
        }
      });

      source.addEventListener("heartbeat", () => {
        if (disposed || eventSource !== source) return;
        resetStaleTimer();
      });

      source.onerror = () => {
        if (disposed || eventSource !== source) return;

        clearStaleTimer();
        setStatus("reconnecting");
        setError("Connection lost. Reconnecting...");

        if (source.readyState === EventSource.CLOSED) {
          source.close();
          eventSource = null;
          scheduleRetry();
        } else {
          resetStaleTimer();
        }
      };
    }

    connect();

    return () => {
      disposed = true;
      clearStaleTimer();

      if (retryTimer !== null) {
        clearTimeout(retryTimer);
      }

      eventSource?.close();
    };
  }, [symbolKey]);

  const filteredQuotes = useMemo(() => {
    const allowed = new Set(symbolKey.split(","));

    return Object.fromEntries(
      Object.entries(quotes).filter(([symbol]) =>
        allowed.has(symbol),
      ),
    );
  }, [quotes, symbolKey]);

  return {
    quotes: filteredQuotes,
    status: symbolKey ? status : "disconnected",
    error: symbolKey ? error : null,
  };
}
