import { useState } from "react";
import type { ReactNode } from "react";
import { Header } from "../components/layout/Header";
import { MobileNavigation } from "../components/layout/MovileNavigation";
import { Sidebar } from "../components/layout/Sidebar";


type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header onMenuClick={() => setMobileNavOpen(true)} />

        <MobileNavigation
          open={isMobileNavOpen}
          onOpenChange={setMobileNavOpen}
        />

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}