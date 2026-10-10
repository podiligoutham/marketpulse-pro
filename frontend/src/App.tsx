import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout } from "./app/AppLayout";
import { DashboardPage } from "./pages/Dashboardpage";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}