import React from "react";
import { cn } from "../../utils/cn";

export default function SectionHeader({
  title,
  subtitle,
  icon,
  actions,
  className = "",
}) {
  let renderedIcon = null;

  if (React.isValidElement(icon)) {
    // Already a JSX element: <Activity />
    renderedIcon = icon;
  } else if (icon) {
    // Lucide components are often forwardRef objects.
    renderedIcon = React.createElement(icon, {
      className: "h-5 w-5",
    });
  }

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4",
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {renderedIcon && (
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sp-border bg-sp-surface text-sp-text-2">
            {renderedIcon}
          </div>
        )}

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-sp-text-1">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-sp-text-3">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}