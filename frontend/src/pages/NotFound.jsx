import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <Compass className="h-10 w-10 text-sp-text-4" aria-hidden="true" />
      <h1 className="text-xl font-semibold text-sp-text">
        Page not found
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-sp-text-3">
        The route you requested does not exist in the SystemPulse console.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-md border border-sp-edge bg-sp-panel-2 px-4 py-2 text-sm font-medium text-sp-text transition-colors hover:border-sp-edge-strong hover:bg-sp-panel-3"
      >
        Return to Command Center
      </Link>
    </div>
  );
}
