import { cn } from "../../utils/cn";

// Page-level heading with optional right-side actions.
export default function SectionHeader({ title, subtitle, actions, icon }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-sp-text sm:text-2xl">
          {icon && <span className="text-sp-teal">{icon}</span>}
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-sp-text-3">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
