import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  BrainCircuit,
  Gauge,
  FlaskConical,
} from "lucide-react";
import { cn } from "../utils/cn";
import SystemStatusIndicator from "../components/status/SystemStatusIndicator";

const NAV_ITEMS = [
  { to: "/", label: "Command Center", icon: Gauge, end: true },
  { to: "/simulator", label: "Simulator", icon: FlaskConical, end: false },
  { to: "/intelligence", label: "Intelligence", icon: BrainCircuit, end: false },
  { to: "/telemetry", label: "Telemetry", icon: Activity, end: false },
];

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-sp-edge bg-sp-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sp-edge-strong bg-sp-panel-2">
              <Activity className="h-4.5 w-4.5 text-sp-teal" aria-hidden="true" />
            </div>
            <span className="text-base font-semibold tracking-tight text-sp-text">
              SystemPulse
            </span>
          </div>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sp-teal/10 text-sp-text border border-sp-teal/40"
                      : "text-sp-text-3 hover:text-sp-text hover:bg-sp-panel-2/60 border border-transparent"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn("h-4 w-4", isActive && "text-sp-teal")}
                      aria-hidden="true"
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <SystemStatusIndicator />
        </div>

        <nav
          className="flex items-center gap-1 overflow-x-auto border-t border-sp-edge px-4 py-2 md:hidden"
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sp-teal/10 text-sp-text border border-sp-teal/40"
                    : "text-sp-text-3 hover:text-sp-text hover:bg-sp-panel-2/60 border border-transparent"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn("h-4 w-4", isActive && "text-sp-teal")}
                    aria-hidden="true"
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-sp-edge">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 text-xs text-sp-text-4 sm:px-6">
          <span>SystemPulse · Observability Console</span>
          <span>Monitoring API :8003 · Product Service :8002</span>
        </div>
      </footer>
    </div>
  );
}
