import { Briefcase, Building2, Clock3, Info } from "lucide-react";
import { useAdmission } from "../../state/AdmissionContext";
import { CENTROS_CUSTO, DEPARTAMENTOS, EMPRESAS, JORNADAS, PRAZOS_EXPERIENCIA, REGIMES, TIPOS_CONTRATO } from "../../data/options";
import { formatDateBR, maskCNPJ, maskCurrency, onlyDigits } from "../../lib/masks";
import { minutesBetween } from "../../lib/validators";
import { SALARIO_MINIMO } from "../../lib/validation";
import { BoundInput, BoundSelect } from "../ui/Bound";
import { FormGrid, SectionCard } from "../ui/Card";

/** Data final do contrato de experiência (dia anterior ao completar o prazo) */
function fimExperiencia(admissao: string, prazo: string) {
  if (!admissao || !prazo) return "";
  const dias = prazo.split("+").reduce((a, n) => a + Number(n), 0);
  const d = new Date(`${admissao}T00:00:00`);
  d.setDate(d.getDate() + dias - 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function ContractStep() {
  const { data, setContrato, setData } = useAdmission();
  const c = data.contrato;

  const escolherEmpresa = (value: string) => {
    const emp = EMPRESAS.find((e) => e.value === value);
    setData((d) => ({
      ...d,
      contrato: { ...d.contrato, empresa: value, cnpj: emp?.cnpj ?? "", sindicato: emp?.sindicato ?? d.contrato.sindicato },
    }));
  };

  const jornadaDiaria =
    c.horarioEntrada && c.horarioSaida ? minutesBetween(c.horarioEntrada, c.horarioSaida) : null;
  const fim = c.tipoContrato === "experiencia" ? fimExperiencia(c.dataAdmissao, c.prazoExperiencia) : "";

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Empresa e vínculo" icon={<Building2 className="h-4 w-4" />}>
        <FormGrid>
          <BoundSelect
            name="contrato.empresa"
            label="Empresa contratante"
            required
            value={c.empresa}
            onValue={escolherEmpresa}
            options={EMPRESAS.map((e) => ({ value: e.value, label: e.label }))}
            className="sm:col-span-2"
          />
          <BoundInput name="contrato.cnpj" label="CNPJ" required value={c.cnpj} onValue={(v) => setContrato("cnpj", v)} mask={maskCNPJ} inputMode="numeric" placeholder="00.000.000/0000-00" hint="Preenchido ao escolher a empresa." />
          <BoundInput name="contrato.matricula" label="Matrícula do funcionário" required value={c.matricula} onValue={(v) => setContrato("matricula", onlyDigits(v).slice(0, 8))} inputMode="numeric" placeholder="000000" />
          <BoundInput name="contrato.cargo" label="Cargo" required value={c.cargo} onValue={(v) => setContrato("cargo", v)} />
          <BoundSelect name="contrato.departamento" label="Departamento ou setor" required value={c.departamento} onValue={(v) => setContrato("departamento", v)} options={DEPARTAMENTOS} />
          <BoundSelect name="contrato.centroCusto" label="Centro de custo" required value={c.centroCusto} onValue={(v) => setContrato("centroCusto", v)} options={CENTROS_CUSTO} />
          <BoundInput name="contrato.sindicato" label="Sindicato" optionalNote="(quando aplicável)" value={c.sindicato} onValue={(v) => setContrato("sindicato", v)} className="sm:col-span-2" />
        </FormGrid>
      </SectionCard>

      <SectionCard title="Contrato" description="Apenas os tipos de contrato habilitados nas regras da empresa." icon={<Briefcase className="h-4 w-4" />}>
        <FormGrid>
          <BoundInput name="contrato.dataAdmissao" label="Data de admissão" required type="date" value={c.dataAdmissao} onValue={(v) => setContrato("dataAdmissao", v)} />
          <BoundSelect
            name="contrato.tipoContrato"
            label="Tipo de contrato"
            required
            value={c.tipoContrato}
            onValue={(v) =>
              setData((d) => ({
                ...d,
                contrato: { ...d.contrato, tipoContrato: v as typeof c.tipoContrato, prazoExperiencia: "", dataTermino: "" },
              }))
            }
            options={TIPOS_CONTRATO}
          />
          {c.tipoContrato === "experiencia" && (
            <BoundSelect
              name="contrato.prazoExperiencia"
              label="Prazo da experiência"
              required
              value={c.prazoExperiencia}
              onValue={(v) => setContrato("prazoExperiencia", v)}
              options={PRAZOS_EXPERIENCIA}
              hint={fim ? `Término previsto em ${formatDateBR(fim)}. Máximo legal: 90 dias.` : "Máximo legal: 90 dias, com uma prorrogação."}
            />
          )}
          {c.tipoContrato === "determinado" && (
            <BoundInput name="contrato.dataTermino" label="Data de término" required type="date" value={c.dataTermino} onValue={(v) => setContrato("dataTermino", v)} hint="Máximo de 2 anos." min={c.dataAdmissao || undefined} />
          )}
          <BoundSelect name="contrato.regime" label="Regime de trabalho" required value={c.regime} onValue={(v) => setContrato("regime", v)} options={REGIMES} />
          <BoundInput name="contrato.salario" label="Salário contratual (R$)" required value={c.salario} onValue={(v) => setContrato("salario", v)} mask={maskCurrency} inputMode="numeric" placeholder="0,00" hint={`Mínimo nacional: R$ ${SALARIO_MINIMO.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (44h).`} />
          <BoundInput name="contrato.responsavel" label="Responsável pelo cadastro" required value={c.responsavel} onValue={(v) => setContrato("responsavel", v)} />
        </FormGrid>
      </SectionCard>

      <SectionCard title="Jornada" icon={<Clock3 className="h-4 w-4" />}>
        <FormGrid cols={4}>
          <BoundSelect name="contrato.jornada" label="Jornada de trabalho" required value={c.jornada} onValue={(v) => setContrato("jornada", v)} options={JORNADAS} className="sm:col-span-2" />
          <BoundInput name="contrato.cargaSemanal" label="Carga horária semanal" required value={c.cargaSemanal} onValue={(v) => setContrato("cargaSemanal", onlyDigits(v).slice(0, 2))} inputMode="numeric" placeholder="44" hint="Em horas. Limite: 44h." />
          <div className="hidden lg:block" />
          <BoundInput name="contrato.horarioEntrada" label="Entrada" required type="time" value={c.horarioEntrada} onValue={(v) => setContrato("horarioEntrada", v)} />
          <BoundInput name="contrato.horarioSaida" label="Saída" required type="time" value={c.horarioSaida} onValue={(v) => setContrato("horarioSaida", v)} />
        </FormGrid>
        {jornadaDiaria !== null && jornadaDiaria > 0 && (
          <p className="mt-4 flex items-start gap-2 rounded-md bg-navy-50 px-3 py-2 text-[13px] text-navy-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Período de {Math.floor(jornadaDiaria / 60)}h{String(jornadaDiaria % 60).padStart(2, "0")} entre entrada e saída, incluindo o intervalo.
            {jornadaDiaria > 6 * 60 && " Jornadas acima de 6h exigem intervalo de no mínimo 1 hora."}
          </p>
        )}
      </SectionCard>
    </div>
  );
}
