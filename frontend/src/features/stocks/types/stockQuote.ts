
import type { StockQuote } from "../../../api/stockQuoteApi";

export type { StockQuote };

export type StockStreamStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";
