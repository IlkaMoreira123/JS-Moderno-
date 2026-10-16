import { AlertTriangle, CheckCircle2, ClipboardCheck, FileSearch, ListChecks } from "lucide-react";
import { useAdmission } from "../../state/AdmissionContext";
import { STEPS } from "../../lib/validation";
import { formatDateTimeBR } from "../../lib/masks";
import { SectionCard } from "../ui/Card";
import { Checkbox } from "../ui/Field";
import { AdmissionSummary } from "../AdmissionSummary";
import { cn } from "../../lib/cn";

export function ReviewStep() {
  const { data, setData, pendencias, goTo, state, status } = useAdmission();
  const bloqueado = Boolean(state.finishedAt);

  const erros = pendencias.filter((p) => p.tipo !== "conferencia");
  const checklistFeito = data.checklist.filter((c) => c.checked).length;

  const toggle = (id: string, checked: boolean) =>
    setData((d) => ({ ...d, checklist: d.checklist.map((c) => (c.id === id ? { ...c, checked } : c)) }));

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Pendências antes de concluir"
        description="O que ainda impede a finalização da admissão."
        icon={<AlertTriangle className="h-4 w-4" />}
        actions={
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", erros.length ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800")}>
            {erros.length ? `${erros.length} ${erros.length === 1 ? "pendência" : "pendências"}` : "Sem pendências de dados"}
          </span>
        }
      >
        {erros.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-emerald-800">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Todos os campos obrigatórios estão válidos e os documentos obrigatórios foram validados.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {STEPS.filter((s) => erros.some((e) => e.step === s.id)).map((s) => (
              <div key={s.id}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <h4 className="text-[13px] font-semibold text-navy-900">{s.title}</h4>
                  <button
                    type="button"
                    onClick={() => goTo(STEPS.findIndex((x) => x.id === s.id))}
                    className="rounded px-1.5 py-0.5 text-xs font-medium text-sky-700 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    Ir para a etapa
                  </button>
                </div>
                <ul className="flex flex-col gap-1">
                  {erros
                    .filter((e) => e.step === s.id)
                    .map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-slate-700">
                        <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", e.tipo === "documento" ? "bg-amber-500" : "bg-red-500")} aria-hidden="true" />
                        {e.mensagem}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Checklist de conferência"
        description="Marque cada item somente após conferir. Nenhum item é marcado automaticamente."
        icon={<ListChecks className="h-4 w-4" />}
        actions={
          <span className="font-mono text-xs font-semibold tabular-nums text-navy-800">
            {checklistFeito}/{data.checklist.length}
          </span>
        }
      >
        {!state.sentToReviewAt && (
          <p className="mb-4 flex items-start gap-2 rounded-md bg-navy-50 px-3 py-2 text-[13px] text-navy-800">
            <FileSearch className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Envie o cadastro para conferência para liberar a finalização. Você já pode ir marcando os itens conferidos.
          </p>
        )}
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {data.checklist.map((c) => (
            <li key={c.id} className={cn("rounded-md border px-3 py-2.5 transition", c.checked ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200")}>
              <Checkbox id={`check-${c.id}`} label={c.label} checked={c.checked} onChange={(v) => toggle(c.id, v)} disabled={bloqueado} />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-500">
          “Cadastro preparado para integração com o eSocial” indica que os dados estão completos para o envio. Este sistema ainda não transmite nada ao
          eSocial.
        </p>
      </SectionCard>

      <SectionCard
        title="Resumo do cadastro"
        description="Confira os dados por categoria. CPF e conta bancária aparecem parcialmente ocultos."
        icon={<ClipboardCheck className="h-4 w-4" />}
        actions={
          state.sentToReviewAt ? (
            <span className="text-xs text-slate-500">
              Enviado para conferência em {formatDateTimeBR(state.sentToReviewAt)}
              {status === "concluido" && state.finishedAt && ` · finalizado em ${formatDateTimeBR(state.finishedAt)}`}
            </span>
          ) : undefined
        }
      >
        <AdmissionSummary data={data} onEdit={bloqueado ? undefined : goTo} />
      </SectionCard>
    </div>
  );
}
