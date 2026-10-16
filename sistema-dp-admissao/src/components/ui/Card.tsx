import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Bloco do formulário: um assunto por card, para não sobrecarregar a tela */
export function SectionCard({ title, description, icon, actions, children, className }: SectionCardProps) {
  return (
    <section className={cn("rounded-lg border border-slate-200 bg-white shadow-card", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          {icon && (
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-navy-50 text-navy-700" aria-hidden="true">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-navy-950">{title}</h3>
            {description && <p className="mt-0.5 text-[13px] text-slate-500">{description}</p>}
          </div>
        </div>
        {actions}
      </header>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

export function FormGrid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const map = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };
  return <div className={cn("grid grid-cols-1 gap-x-5 gap-y-4", map[cols])}>{children}</div>;
}
