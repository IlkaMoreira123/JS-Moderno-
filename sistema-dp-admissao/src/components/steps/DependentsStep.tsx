import { NotebookPen, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useAdmission } from "../../state/AdmissionContext";
import { PARENTESCO } from "../../data/options";
import { maskCPF } from "../../lib/masks";
import { ageAt } from "../../lib/validators";
import type { Dependent } from "../../types";
import { BoundInput, BoundSelect } from "../ui/Bound";
import { FormGrid, SectionCard } from "../ui/Card";
import { Button } from "../ui/Button";
import { Checkbox, Field, TextArea } from "../ui/Field";
import { Modal } from "../ui/Modal";
import { uid } from "../../lib/cn";

const emptyDependent = (): Dependent => ({
  id: uid(),
  nome: "",
  cpf: "",
  dataNascimento: "",
  parentesco: "",
  irrf: false,
  salarioFamilia: false,
  planoSaude: false,
});

export function DependentsStep() {
  const { data, setData, errorFor } = useAdmission();
  const [removing, setRemoving] = useState<Dependent | null>(null);

  const update = (id: string, patch: Partial<Dependent>) =>
    setData((d) => ({ ...d, dependentes: d.dependentes.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));

  const add = () => {
    const dep = emptyDependent();
    setData((d) => ({ ...d, dependentes: [...d.dependentes, dep] }));
    setTimeout(() => document.getElementById(`dependentes-${data.dependentes.length}-nome`)?.focus(), 50);
  };

  const confirmRemove = () => {
    if (!removing) return;
    setData((d) => ({ ...d, dependentes: d.dependentes.filter((x) => x.id !== removing.id) }));
    setRemoving(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Dependentes"
        description="Cadastre quem depende do colaborador para fins legais, fiscais ou de benefícios. Se não houver, siga para a próxima etapa."
        icon={<Users className="h-4 w-4" />}
        actions={
          <Button size="sm" variant="primary" icon={<Plus className="h-3.5 w-3.5" />} onClick={add}>
            Adicionar dependente
          </Button>
        }
      >
        {data.dependentes.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300 px-6 py-10 text-center">
            <Users className="h-8 w-8 text-slate-300" aria-hidden="true" />
            <p className="text-sm font-medium text-navy-900">Nenhum dependente cadastrado</p>
            <p className="max-w-sm text-[13px] text-slate-500">Use “Adicionar dependente” para incluir cônjuge, filhos ou outros dependentes.</p>
          </div>
        ) : (
          <ol className="flex flex-col gap-4">
            {data.dependentes.map((dep, i) => {
              const k = `dependentes.${i}`;
              const idade = dep.dataNascimento ? ageAt(dep.dataNascimento) : null;
              const sfErr = errorFor(`${k}.salarioFamilia`);
              return (
                <li key={dep.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-navy-900">
                      Dependente {i + 1}
                      {idade !== null && idade >= 0 && <span className="ml-2 font-normal text-slate-500">· {idade} {idade === 1 ? "ano" : "anos"}</span>}
                    </p>
                    <Button size="sm" variant="danger" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => setRemoving(dep)} aria-label={`Remover dependente ${i + 1}`}>
                      Remover
                    </Button>
                  </div>
                  <FormGrid cols={4}>
                    <BoundInput name={`${k}.nome`} label="Nome completo" required value={dep.nome} onValue={(v) => update(dep.id, { nome: v })} className="sm:col-span-2" />
                    <BoundInput name={`${k}.dataNascimento`} label="Data de nascimento" required type="date" value={dep.dataNascimento} onValue={(v) => update(dep.id, { dataNascimento: v })} max={new Date().toISOString().slice(0, 10)} />
                    <BoundSelect name={`${k}.parentesco`} label="Grau de parentesco" required value={dep.parentesco} onValue={(v) => update(dep.id, { parentesco: v })} options={PARENTESCO} />
                    <BoundInput
                      name={`${k}.cpf`}
                      label="CPF"
                      required={dep.irrf || dep.planoSaude}
                      optionalNote="(quando exigido)"
                      value={dep.cpf}
                      onValue={(v) => update(dep.id, { cpf: v })}
                      mask={maskCPF}
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                    />
                  </FormGrid>
                  <fieldset className="mt-4 border-t border-slate-200 pt-4">
                    <legend className="mb-2 text-[13px] font-medium text-navy-900">Dependente para fins de</legend>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <Checkbox id={`dep-${dep.id}-irrf`} label="Imposto de renda (IRRF)" description="Exige CPF" checked={dep.irrf} onChange={(c) => update(dep.id, { irrf: c })} />
                      <Checkbox id={`dep-${dep.id}-sf`} label="Salário-família" description="Filhos até 14 anos" checked={dep.salarioFamilia} onChange={(c) => update(dep.id, { salarioFamilia: c })} />
                      <Checkbox id={`dep-${dep.id}-saude`} label="Plano de saúde" description="Exige CPF" checked={dep.planoSaude} onChange={(c) => update(dep.id, { planoSaude: c })} />
                    </div>
                    {sfErr && <p className="mt-2 text-xs text-red-700" role="alert">{sfErr}</p>}
                  </fieldset>
                </li>
              );
            })}
          </ol>
        )}
      </SectionCard>

      <SectionCard title="Informações complementares" icon={<NotebookPen className="h-4 w-4" />}>
        <Field id="observacoes" label="Observações para a conferência" optionalNote="(opcional)" hint="Ex.: aguardando ASO, colaborador começa após aviso prévio na empresa anterior.">
          <TextArea
            id="observacoes"
            value={data.observacoes}
            maxLength={1000}
            onChange={(e) => setData((d) => ({ ...d, observacoes: e.target.value }))}
            aria-describedby="observacoes-dica"
          />
        </Field>
      </SectionCard>

      <Modal
        open={Boolean(removing)}
        title="Remover dependente?"
        description={removing?.nome ? `${removing.nome} será removido(a) deste cadastro.` : "Este dependente será removido do cadastro."}
        onClose={() => setRemoving(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRemoving(null)}>
              Manter
            </Button>
            <Button variant="danger" onClick={confirmRemove} icon={<Trash2 className="h-4 w-4" />}>
              Remover dependente
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">Os dados preenchidos para este dependente serão apagados.</p>
      </Modal>
    </div>
  );
}
