type TooltipValue = number | string | readonly (number | string)[];

type MarketChartTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{
    value?: TooltipValue;
  }>;
  label?: string | number;
};

export function MarketChartTooltip({
  active,
  payload,
  label,
}: MarketChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const price = payload[0]?.value;

  if (typeof price !== "number") {
    return null;
  }

  return (
    <div className='rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 shadow-xl'>
      <p className='mb-2 text-xs text-slate-400'>{label}</p>

      <div className='flex items-center justify-between gap-6'>
        <span className='text-sm text-slate-300'>S&P 500</span>

        <span className='text-sm font-semibold tabular-nums text-white'>
          {price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
}
