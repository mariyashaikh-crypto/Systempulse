import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import CommandCenter from "./pages/CommandCenter";
import Simulator from "./pages/Simulator";
import Intelligence from "./pages/Intelligence";
import NotFound from "./pages/NotFound";

// Telemetry uses Recharts — load it only when the route is visited.
const Telemetry = lazy(() => import("./pages/Telemetry"));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-sp-text-3">Loading…</p>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<CommandCenter />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="/telemetry" element={<Telemetry />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
