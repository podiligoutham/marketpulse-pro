import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout } from "./app/AppLayout";
import { DashboardPage } from "./pages/Dashboardpage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { MarketsPage } from "./pages/MarketsPage";
import { WatchlistPage } from "./pages/WatchlistPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route
              index
              element={<DashboardPage />}
            />
            <Route
              path='markets'
              element={<MarketsPage />}
            />
            <Route
              path='watchlist'
              element={<WatchlistPage />}
            />
          </Route>

          <Route
            path='*'
            element={<NotFoundPage />}
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
