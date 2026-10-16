import { CheckCircle2, CircleDashed, Clock, FileWarning, PencilLine, SearchCheck } from "lucide-react";
import type { AdmissionStatus } from "../../types";
import { STATUS_INFO } from "../../lib/validation";
import { cn } from "../../lib/cn";

const STYLE: Record<AdmissionStatus, { cls: string; Icon: typeof Clock }> = {
  rascunho: { cls: "bg-slate-100 text-slate-700 ring-slate-200", Icon: PencilLine },
  aguardando_documentos: { cls: "bg-amber-50 text-amber-800 ring-amber-200", Icon: Clock },
  em_conferencia: { cls: "bg-sky-50 text-sky-800 ring-sky-200", Icon: SearchCheck },
  pendente_correcao: { cls: "bg-red-50 text-red-700 ring-red-200", Icon: FileWarning },
  pronto_finalizacao: { cls: "bg-emerald-50 text-emerald-800 ring-emerald-200", Icon: CircleDashed },
  concluido: { cls: "bg-emerald-700 text-white ring-emerald-700", Icon: CheckCircle2 },
};

export function StatusBadge({ status, className }: { status: AdmissionStatus; className?: string }) {
  const { cls, Icon } = STYLE[status];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", cls, className)}
      title={STATUS_INFO[status].description}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {STATUS_INFO[status].label}
    </span>
  );
}

/** Todos os status do fluxo, para o painel de andamento */
export const STATUS_ORDER: AdmissionStatus[] = [
  "rascunho",
  "aguardando_documentos",
  "em_conferencia",
  "pendente_correcao",
  "pronto_finalizacao",
  "concluido",
];
