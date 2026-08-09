import { cn } from "../../utils/cn";

// Reusable surface container used across every page.
export default function Panel({
  title,
  subtitle,
  icon,
  actions,
  tone,
  className = "",
  padded = true,
  children,
}) {
  const toneClasses = tone?.ring ?? "";

  return (
    <section
      className={cn(
        "rounded-lg border border-sp-edge bg-sp-panel shadow-sm",
        tone && toneClasses,
        className
      )}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
          <div className="min-w-0">
            {title && (
              <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-sp-text">
                {icon && <span className="text-sp-text-2">{icon}</span>}
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-xs leading-relaxed text-sp-text-3">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </header>
      )}
      <div className={cn(padded && "px-5 pb-5", title && "pt-2")}>
        {children}
      </div>
    </section>
  );
}
