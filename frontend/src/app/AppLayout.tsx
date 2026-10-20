import { useState } from "react";
import { Header } from "../components/layout/Header";
import { MobileNavigation } from "../components/layout/MobileNavigation";
import { Sidebar } from "../components/layout/Sidebar";
import { Outlet } from "react-router";
import { WatchlistStreamProvider } from "../features/stocks/components/WatchlistStreamProvider";


export function AppLayout() {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <WatchlistStreamProvider/>
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header onMenuClick={() => setMobileNavOpen(true)} />

        <MobileNavigation
          open={isMobileNavOpen}
          onOpenChange={setMobileNavOpen}
        />

        <main className="p-4 md:p-6"><Outlet/></main>
      </div>
    </div>
  );
}