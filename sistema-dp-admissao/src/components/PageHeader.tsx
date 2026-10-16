import { ArrowLeft, Save } from "lucide-react";
import { useAdmission } from "../state/AdmissionContext";
import { STEPS } from "../lib/validation";
import { formatDateTimeBR } from "../lib/masks";
import { StatusBadge } from "./ui/StatusBadge";
import { Button } from "./ui/Button";

export function PageHeader({ onBack }: { onBack: () => void }) {
  const { state, status, errorsByStep, lastAutosave } = useAdmission();

  // Progresso = etapas confirmadas pelo usuário que estão sem erros
  const done = STEPS.filter(
    (s) => s.id !== "conferencia" && state.confirmedSteps.includes(s.id) && Object.keys(errorsByStep[s.id]).length === 0,
  ).length;
  const conferencia = state.data.checklist.filter((c) => c.checked).length / state.data.checklist.length;
  const percent = Math.round(((done + (state.finishedAt ? 1 : conferencia)) / STEPS.length) * 100);

  return (
    <header className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Button variant="secondary" size="sm" onClick={onBack} icon={<ArrowLeft className="h-4 w-4" />} className="mt-1 shrink-0" aria-label="Voltar para a lista de admissões">
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-navy-950 [text-wrap:balance]">Admissão de Funcionário</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Cadastre os dados do novo colaborador e acompanhe as etapas do processo admissional.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1.5 sm:items-end">
          <StatusBadge status={status} />
          <p className="font-mono text-[11px] text-slate-500">Protocolo interno {state.protocolo}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-card sm:flex-row sm:items-center sm:gap-5">
        <div className="flex items-center justify-between gap-3 sm:w-48 sm:shrink-0">
          <span className="text-[13px] font-medium text-navy-900">Andamento da admissão</span>
          <span className="font-mono text-[13px] font-semibold tabular-nums text-navy-800 sm:hidden">{percent}%</span>
        </div>
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Andamento da admissão"
        >
          <div className="h-full rounded-full bg-gradient-to-r from-navy-600 to-sky-400 transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
        <span className="hidden w-10 text-right font-mono text-[13px] font-semibold tabular-nums text-navy-800 sm:block">{percent}%</span>
        <span className="flex items-center gap-1.5 text-[12px] text-slate-500 sm:w-56 sm:justify-end">
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
          {lastAutosave ? `Salvo nesta sessão às ${formatDateTimeBR(lastAutosave).split(" ")[1]}` : "Ainda não salvo"}
        </span>
      </div>
    </header>
  );
}
