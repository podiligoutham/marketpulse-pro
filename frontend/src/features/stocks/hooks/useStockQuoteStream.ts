
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../config/api";
import type {
  StockQuote,
  StockStreamStatus,
} from "../types/stockQuote";

interface UseStockQuoteStreamResult {
  quote: StockQuote | null;
  status: StockStreamStatus;
  error: string | null;
}

const STALE_TIMEOUT_MS = 45_000;
const RETRY_DELAY_MS = 3_000;

export function useStockQuoteStream(
  symbol: string,
): UseStockQuoteStreamResult {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [status, setStatus] =
    useState<StockStreamStatus>("connecting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const normalizedSymbol = symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      return;
    }

    const url =
      `${API_BASE_URL}/v1/stocks/` +
      `${encodeURIComponent(normalizedSymbol)}/stream`;

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
      if (disposed || retryTimer !== null) {
        return;
      }

      retryTimer = setTimeout(() => {
        retryTimer = null;
        connect();
      }, RETRY_DELAY_MS);
    }

    function resetStaleTimer() {
      clearStaleTimer();

      staleTimer = setTimeout(() => {
        if (disposed) {
          return;
        }

        console.warn("[SSE] Stream became stale");

        eventSource?.close();
        eventSource = null;

        setStatus("reconnecting");
        setError("No recent updates. Reconnecting...");

        scheduleRetry();
      }, STALE_TIMEOUT_MS);
    }

    function connect() {
      if (disposed) {
        return;
      }

      eventSource?.close();

      const source = new EventSource(url);
      eventSource = source;

      console.log("[SSE] Connecting:", url);

      // Detect streams that never successfully open.
      resetStaleTimer();

      source.onopen = () => {
        if (disposed || eventSource !== source) {
          return;
        }

        console.log("[SSE] Connected");

        setStatus("connected");
        setError(null);
        resetStaleTimer();
      };

      source.addEventListener("quote", (event: MessageEvent) => {
        if (disposed || eventSource !== source) {
          return;
        }

        try {
          const updatedQuote = JSON.parse(
            event.data,
          ) as StockQuote;

          setQuote(updatedQuote);
          setError(null);
          resetStaleTimer();
        } catch {
          setError("Unable to parse stock quote.");
        }
      });

      source.addEventListener("heartbeat", () => {
        if (disposed || eventSource !== source) {
          return;
        }

        console.log("[SSE] Heartbeat received");
        resetStaleTimer();
      });

      source.onerror = () => {
        if (disposed || eventSource !== source) {
          return;
        }

        console.warn(
          "[SSE] Connection error:",
          source.readyState,
        );

        clearStaleTimer();

        if (source.readyState === EventSource.CLOSED) {
          setStatus("disconnected");
          setError("Live updates are unavailable.");

          // CLOSED connections don't automatically reconnect.
          source.close();
          eventSource = null;
          scheduleRetry();
        } else {
          // EventSource handles retry automatically.
          setStatus("reconnecting");
          setError("Connection lost. Reconnecting...");

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
  }, [symbol]);

  return { quote, status, error };
}
