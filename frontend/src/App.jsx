import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import CommandCenter from "./pages/CommandCenter";
import Simulator from "./pages/Simulator";
import Intelligence from "./pages/Intelligence";
import NotFound from "./pages/NotFound";

const Telemetry = lazy(() => import("./pages/Telemetry"));

function RouteFallback() {
  return (
    <div className="flex min-h-[400px] items-center justify-center text-sp-text-3">
      Loading…
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