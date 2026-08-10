import { cn } from "../../utils/cn";

// Page-level heading with optional right-side actions.
export default function SectionHeader({
  title,
  subtitle,
  actions,
  icon: Icon,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon
            className="mt-0.5 h-5 w-5 shrink-0 text-sp-teal"
            aria-hidden="true"
          />
        )}

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-sp-text">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-1 text-sm text-sp-text-3">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && <div>{actions}</div>}
    </div>
  );
}