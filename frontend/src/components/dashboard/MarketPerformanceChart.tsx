import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MarketChartTooltip } from "./MarketChartTooltip";

type Timeframe = "1D" | "1W" | "1M" | "1Y";

const timeframes: Timeframe[] = ["1D", "1W", "1M", "1Y"];

type MarketDataPoint = {
  date: string;
  price: number;
};

const marketHistory: Record<Timeframe, MarketDataPoint[]> = {
  "1D": [
    { date: "9 AM", price: 5800 },
    { date: "10 AM", price: 5810 },
    { date: "11 AM", price: 5795 },
    { date: "12 PM", price: 5820 },
  ],
  "1W": [
    { date: "Mon", price: 5710 },
    { date: "Tue", price: 5745 },
    { date: "Wed", price: 5730 },
    { date: "Thu", price: 5805 },
    { date: "Fri", price: 5842 },
  ],
  "1M": [
    { date: "Week 1", price: 5550 },
    { date: "Week 2", price: 5650 },
    { date: "Week 3", price: 5600 },
    { date: "Week 4", price: 5842 },
  ],
  "1Y": [
    { date: "Jan", price: 4900 },
    { date: "Mar", price: 5100 },
    { date: "May", price: 5250 },
    { date: "Jul", price: 5500 },
    { date: "Oct", price: 5842 },
  ],
};

export function MarketPerformanceChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>("1W");

  return (
    <section className='rounded-xl border border-slate-700 bg-slate-800 p-5'>
      <div className='mb-6'>
        <h2 className='text-lg font-semibold text-white'>Market Performance</h2>

        <p className='mt-1 text-sm text-slate-400'>
          S&P 500 historical performance
        </p>
      </div>

      <div className='mb-4 flex items-center gap-2'>
        {timeframes.map((timeframe) => (
          <button
            key={timeframe}
            type='button'
            onClick={() => setSelectedTimeframe(timeframe)}
            aria-pressed={selectedTimeframe === timeframe}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              selectedTimeframe === timeframe
                ? "bg-sky-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}>
            {timeframe}
          </button>
        ))}
      </div>

      <div className='h-72 w-full min-w-0'>
        <ResponsiveContainer
          width='100%'
          height='100%'>
          <LineChart data={marketHistory[selectedTimeframe]}>
            <CartesianGrid
              stroke='#334155'
              strokeDasharray='3 3'
            />

            <XAxis
              dataKey='date'
              stroke='#94a3b8'
            />
            <YAxis
              stroke='#94a3b8'
              width={55}
            />

            <Tooltip
  content={({ active, payload, label }) => (
    <MarketChartTooltip
      active={active}
      payload={payload}
      label={label}
    />
  )}
/>

            <Line
              type='monotone'
              dataKey='price'
              stroke='#38bdf8'
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
