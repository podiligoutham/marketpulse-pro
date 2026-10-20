
import { Circle, LoaderCircle } from "lucide-react";
import type { StockStreamStatus } from "../types/stockQuote";

interface ConnectionStatusProps {
  status: StockStreamStatus;
}

const statusConfig = {
  connected: {
    label: "Live",
    color: "text-emerald-400",
  },
  connecting: {
    label: "Connecting",
    color: "text-amber-400",
  },
  reconnecting: {
    label: "Reconnecting",
    color: "text-amber-400",
  },
  disconnected: {
    label: "Disconnected",
    color: "text-red-400",
  },
} as const;

export function ConnectionStatus({
  status,
}: ConnectionStatusProps) {
  const { label, color } = statusConfig[status];

  const isConnecting =
    status === "connecting" || status === "reconnecting";

  return (
    <div
      role="status"
      className={`flex items-center gap-2 text-xs font-medium ${color}`}
    >
      {isConnecting ? (
        <LoaderCircle
          size={13}
          className="animate-spin"
          aria-hidden="true"
        />
      ) : (
        <Circle
          size={10}
          fill="currentColor"
          aria-hidden="true"
        />
      )}

      <span>{label}</span>
    </div>
  );
}
