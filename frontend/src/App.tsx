import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout } from "./app/AppLayout";
import { DashboardPage } from "./pages/Dashboardpage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { MarketsPage } from "./pages/MarketsPage";
import { WatchlistPage } from "./pages/WatchlistPage";

export default function App() {
  return (
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
  );
}
