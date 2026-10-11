import { TrendingDown, TrendingUp, Minus } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  changePercent: number;
};

export function StatCard({
  label,
  value,
  changePercent,
}: StatCardProps) {
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;

  const changeColor = isPositive
    ? "text-green-400"
    : isNegative
      ? "text-red-400"
      : "text-slate-400";

  const formattedChange =
    `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`;

  const TrendIcon = isPositive
    ? TrendingUp
    : isNegative
      ? TrendingDown
      : Minus;

  return (
    <article className="rounded-xl border border-slate-700 bg-slate-800 p-5">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-slate-400">
          {label}
        </h3>

        <p className="text-2xl font-semibold tracking-tight text-white">
          {value}
        </p>

        <div className={`flex items-center gap-1.5 ${changeColor}`}>
          <TrendIcon size={16} aria-hidden="true" />

          <span className="text-sm font-medium">
            {formattedChange}
          </span>
        </div>
      </div>
    </article>
  );
}
