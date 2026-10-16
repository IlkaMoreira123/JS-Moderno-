import { Gift, Landmark, Plus, Trash2 } from "lucide-react";
import { useAdmission } from "../../state/AdmissionContext";
import { BANCOS, TIPOS_CONTA } from "../../data/options";
import type { Benefit, BenefitStatus } from "../../types";
import { BoundInput, BoundSelect, fieldId } from "../ui/Bound";
import { FormGrid, SectionCard } from "../ui/Card";
import { Button } from "../ui/Button";
import { TextInput } from "../ui/Field";
import { cn, uid } from "../../lib/cn";

const STATUS_OPTIONS: { value: BenefitStatus; label: string; active: string }[] = [
  { value: "solicitado", label: "Solicitado", active: "bg-sky-600 text-white border-sky-600" },
  { value: "aprovado", label: "Aprovado", active: "bg-emerald-700 text-white border-emerald-700" },
  { value: "dispensado", label: "Dispensado", active: "bg-slate-600 text-white border-slate-600" },
];

const PLACEHOLDER: Record<string, string> = {
  vt: "Ex.: 2 conduções por dia — ônibus municipal",
  vr: "Ex.: R$ 35,00 por dia útil",
  va: "Ex.: R$ 600,00 mensais",
  saude: "Ex.: Plano enfermaria — titular",
};

export function BankBenefitsStep() {
  const { data, setBancarios, setData, errorFor, touch } = useAdmission();
  const b = data.bancarios;

  const updateBenefit = (id: string, patch: Partial<Benefit>) =>
    setData((d) => ({
      ...d,
      bancarios: { ...d.bancarios, beneficios: d.bancarios.beneficios.map((x) => (x.id === id ? { ...x, ...patch } : x)) },
    }));

  const addBenefit = () =>
    setData((d) => ({
      ...d,
      bancarios: { ...d.bancarios, beneficios: [...d.bancarios.beneficios, { id: uid(), nome: "", status: "", detalhe: "", custom: true }] },
    }));

  const removeBenefit = (id: string) =>
    setData((d) => ({ ...d, bancarios: { ...d.bancarios, beneficios: d.bancarios.beneficios.filter((x) => x.id !== id) } }));

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Dados bancários" description="Conta onde o salário será creditado. Deve estar em nome do colaborador." icon={<Landmark className="h-4 w-4" />}>
        <FormGrid cols={4}>
          <BoundSelect name="bancarios.banco" label="Banco" required value={b.banco} onValue={(v) => setBancarios("banco", v)} options={BANCOS} className="sm:col-span-2" />
          <BoundInput name="bancarios.agencia" label="Agência" required value={b.agencia} onValue={(v) => setBancarios("agencia", v.replace(/[^\d-]/g, "").slice(0, 6))} inputMode="numeric" placeholder="0000" />
          <BoundInput name="bancarios.conta" label="Conta" required value={b.conta} onValue={(v) => setBancarios("conta", v.replace(/[^\dXx-]/g, "").slice(0, 14))} inputMode="numeric" placeholder="00000-0" />
          <BoundSelect name="bancarios.tipoConta" label="Tipo de conta" required value={b.tipoConta} onValue={(v) => setBancarios("tipoConta", v)} options={TIPOS_CONTA} />
          <BoundInput name="bancarios.chavePix" label="Chave Pix" optionalNote="(se necessária)" value={b.chavePix} onValue={(v) => setBancarios("chavePix", v)} className="sm:col-span-2 lg:col-span-3" placeholder="CPF, e-mail, telefone ou chave aleatória" />
        </FormGrid>
      </SectionCard>

      <SectionCard
        title="Benefícios"
        description="Indique a situação de cada benefício. Use “Dispensado” quando o colaborador não quiser ou não tiver direito."
        icon={<Gift className="h-4 w-4" />}
        actions={
          <Button size="sm" variant="secondary" icon={<Plus className="h-3.5 w-3.5" />} onClick={addBenefit}>
            Outro benefício
          </Button>
        }
      >
        <ul className="-my-1 divide-y divide-slate-100">
          {b.beneficios.map((ben, i) => {
            const statusKey = `bancarios.beneficios.${i}.status`;
            const nameKey = `bancarios.beneficios.${i}.nome`;
            const statusErr = errorFor(statusKey);
            const nameErr = errorFor(nameKey);
            return (
              <li key={ben.id} className="grid grid-cols-1 gap-3 py-4 lg:grid-cols-[minmax(160px,220px)_auto_minmax(0,1fr)_auto] lg:items-start">
                <div className="min-w-0">
                  {ben.custom ? (
                    <>
                      <label htmlFor={fieldId(nameKey)} className="sr-only">
                        Nome do benefício
                      </label>
                      <TextInput
                        id={fieldId(nameKey)}
                        value={ben.nome}
                        placeholder="Nome do benefício"
                        error={nameErr}
                        onChange={(e) => updateBenefit(ben.id, { nome: e.target.value })}
                        onBlur={() => touch(nameKey)}
                      />
                      {nameErr && <p className="mt-1 text-xs text-red-700">{nameErr}</p>}
                    </>
                  ) : (
                    <p className="pt-2 text-sm font-semibold text-navy-950">{ben.nome}</p>
                  )}
                </div>

                <div className="min-w-0">
                  <div role="radiogroup" aria-label={`Situação: ${ben.nome || "benefício"}`} className="inline-flex rounded-md shadow-sm">
                    {STATUS_OPTIONS.map((opt, idx) => {
                      const selected = ben.status === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => {
                            updateBenefit(ben.id, { status: opt.value });
                            touch(statusKey);
                          }}
                          className={cn(
                            "h-9 border px-3 text-[13px] font-medium transition focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                            idx === 0 && "rounded-l-md",
                            idx === STATUS_OPTIONS.length - 1 && "rounded-r-md",
                            idx > 0 && "-ml-px",
                            selected ? opt.active : statusErr ? "border-red-300 bg-red-50/40 text-navy-800" : "border-slate-300 bg-white text-navy-800 hover:bg-slate-50",
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {statusErr && <p className="mt-1 text-xs text-red-700">{statusErr}</p>}
                </div>

                <div className="min-w-0">
                  <label htmlFor={`beneficio-${ben.id}-detalhe`} className="sr-only">
                    Detalhes de {ben.nome || "benefício"}
                  </label>
                  <TextInput
                    id={`beneficio-${ben.id}-detalhe`}
                    value={ben.detalhe}
                    placeholder={PLACEHOLDER[ben.id] ?? "Valor, operadora ou observação"}
                    onChange={(e) => updateBenefit(ben.id, { detalhe: e.target.value })}
                  />
                </div>

                <div className="flex justify-end">
                  {ben.custom && (
                    <Button size="sm" variant="ghost" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => removeBenefit(ben.id)} aria-label={`Remover ${ben.nome || "benefício"}`} className="h-9">
                      <span className="lg:sr-only">Remover</span>
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </div>
  );
}
