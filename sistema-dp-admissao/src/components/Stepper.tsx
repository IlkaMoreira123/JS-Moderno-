import { AlertCircle, Check } from "lucide-react";
import { useAdmission } from "../state/AdmissionContext";
import { STEPS, requiredDocsMissing } from "../lib/validation";
import { cn } from "../lib/cn";

type StepState = "concluida" | "atual" | "pendente" | "nao_iniciada";

export function Stepper() {
  const { state, errorsByStep, goTo } = useAdmission();

  const stepState = (i: number): StepState => {
    const s = STEPS[i];
    const hasErrors =
      Object.keys(errorsByStep[s.id]).length > 0 || (s.id === "documentos" && requiredDocsMissing(state.data));
    if (i === state.currentStep) return "atual";
    if (s.id === "conferencia") return state.finishedAt ? "concluida" : "nao_iniciada";
    if (state.confirmedSteps.includes(s.id)) return hasErrors ? "pendente" : "concluida";
    return "nao_iniciada";
  };

  return (
    <nav aria-label="Etapas da admissão" className="relative -mx-1 overflow-x-auto px-1 pb-1">
      <ol className="flex min-w-max gap-2 lg:grid lg:min-w-0 lg:grid-cols-6">
        {STEPS.map((s, i) => {
          const st = stepState(i);
          return (
            <li key={s.id} className="min-w-0">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={st === "atual" ? "step" : undefined}
                className={cn(
                  "relative flex w-full min-w-[150px] items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition lg:min-w-0",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                  st === "atual" && "border-navy-700 bg-navy-800 text-white shadow-sm",
                  st === "concluida" && "border-emerald-200 bg-white hover:border-emerald-300",
                  st === "pendente" && "border-amber-300 bg-amber-50/60 hover:border-amber-400",
                  st === "nao_iniciada" && "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold",
                    st === "atual" && "bg-sky-300 text-navy-950",
                    st === "concluida" && "bg-emerald-600 text-white",
                    st === "pendente" && "bg-amber-500 text-white",
                    st === "nao_iniciada" && "bg-slate-100 text-slate-600",
                  )}
                  aria-hidden="true"
                >
                  {st === "concluida" ? <Check className="h-4 w-4" /> : st === "pendente" ? <AlertCircle className="h-4 w-4" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className={cn("block text-[11px] uppercase tracking-wide", st === "atual" ? "text-navy-200" : "text-slate-500")}>
                    Etapa {i + 1}
                  </span>
                  <span className={cn("block truncate text-[13px] font-semibold", st === "atual" ? "text-white" : "text-navy-900")}>
                    {s.short}
                  </span>
                  <span className="sr-only">
                    {st === "concluida" ? " — concluída" : st === "pendente" ? " — com pendências" : st === "atual" ? " — etapa atual" : ""}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
