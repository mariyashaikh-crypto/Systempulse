import { cn } from "../../utils/cn";

export default function Panel({
  title,
  subtitle,
  icon: Icon,
  actions,
  children,
  padded = true,
  tone,
  className = "",
}) {
  const toneClasses = tone?.panel ?? "";

  return (
    <section
      className={cn(
        "rounded-xl border border-sp-border bg-sp-surface",
        toneClasses,
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div className="min-w-0">
            {title && (
              <div className="flex items-center gap-2">
                {Icon && (
                  <span className="text-sp-text-2">
                    <Icon className="h-4 w-4" />
                  </span>
                )}

                <h3 className="text-sm font-semibold text-sp-text-1">
                  {title}
                </h3>
              </div>
            )}

            {subtitle && (
              <p className="mt-1 text-xs text-sp-text-3">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex shrink-0 items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          padded && "px-5 pb-5",
          title && "pt-2"
        )}
      >
        {children}
      </div>
    </section>
  );
}