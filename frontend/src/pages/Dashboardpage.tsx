import { MarketPerformanceChart } from "../components/dashboard/MarketPerformanceChart";
import { SelectedStockCard } from "../components/dashboard/SelectedStockCard";
import { StatCard } from "../components/dashboard/StatCard";
import { StockQuoteCard } from "../components/dashboard/StockQuoteCard";
import { WatchlistPreview } from "../components/dashboard/WatchlistPreview";

const marketIndices = [
  { id: "sp500", label: "S&P 500", value: "5,842.47", changePercent: 0.82 },
  { id: "nasdaq", label: "NASDAQ", value: "18,421.09", changePercent: 1.24 },
  { id: "dow", label: "DOW JONES", value: "42,710.31", changePercent: 0.35 },
  {
    id: "russell",
    label: "RUSSELL 2000",
    value: "2,145.82",
    changePercent: -0.46,
  },
];

export function DashboardPage() {
  return (
    <section className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold text-white'>Dashboard</h1>
        <p className='mt-2 text-sm text-slate-400'>
          Market overview and analytics.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {marketIndices.map((index) => (
          <StatCard
            key={index.id}
            label={index.label}
            value={index.value}
            changePercent={index.changePercent}
          />
        ))}
      </div>

      <MarketPerformanceChart />
      <WatchlistPreview />
      <SelectedStockCard />
      <StockQuoteCard />
    </section>
  );
}
