import { Pencil } from "lucide-react";
import type { ReactNode } from "react";
import type { AdmissionData } from "../types";
import {
  CENTROS_CUSTO,
  EMPRESAS,
  JORNADAS,
  PRAZOS_EXPERIENCIA,
  REGIMES,
  SEXO,
  TIPOS_CONTA,
  TIPOS_CONTRATO,
} from "../data/options";
import { formatBRL, formatDateBR, hideAccount, hideCPF } from "../lib/masks";

const label = (list: { value: string; label: string }[], v: string) => list.find((o) => o.value === v)?.label ?? v;

function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-3 py-1.5 sm:grid-cols-[180px_minmax(0,1fr)]">
      <dt className="text-[13px] text-slate-500">{k}</dt>
      <dd className="min-w-0 break-words text-[13px] font-medium text-navy-950">{v || <span className="font-normal text-slate-400">Não informado</span>}</dd>
    </div>
  );
}

function Block({ title, onEdit, children }: { title: string; onEdit?: () => void; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5">
        <h4 className="text-[13px] font-semibold uppercase tracking-wide text-navy-800">{title}</h4>
        {onEdit && (
          <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium text-sky-700 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
            <Pencil className="h-3 w-3" aria-hidden="true" />
            Editar
          </button>
        )}
      </header>
      <dl className="divide-y divide-slate-50 px-4 py-1.5">{children}</dl>
    </section>
  );
}

/** Resumo por categoria. CPF e conta aparecem parcialmente ocultos. */
export function AdmissionSummary({ data, onEdit }: { data: AdmissionData; onEdit?: (step: number) => void }) {
  const p = data.pessoais;
  const doc = data.documentos;
  const c = data.contrato;
  const b = data.bancarios;
  const empresa = EMPRESAS.find((e) => e.value === c.empresa);

  const contrato =
    c.tipoContrato === "experiencia"
      ? `${label(TIPOS_CONTRATO, c.tipoContrato)} · ${label(PRAZOS_EXPERIENCIA, c.prazoExperiencia)}`
      : c.tipoContrato === "determinado"
        ? `${label(TIPOS_CONTRATO, c.tipoContrato)} até ${formatDateBR(c.dataTermino)}`
        : label(TIPOS_CONTRATO, c.tipoContrato);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Block title="Dados pessoais" onEdit={onEdit && (() => onEdit(0))}>
        <Row k="Nome" v={p.nomeCompleto} />
        <Row k="CPF" v={hideCPF(p.cpf)} />
        <Row k="Nascimento" v={formatDateBR(p.dataNascimento)} />
        <Row k="Sexo / estado civil" v={[label(SEXO, p.sexo), p.estadoCivil].filter(Boolean).join(" · ")} />
        <Row k="Filiação" v={[p.nomeMae, p.paiNaoDeclarado ? "Pai não declarado" : p.nomePai].filter(Boolean).join(" e ")} />
        <Row k="Contato" v={[p.email, p.telefone].filter(Boolean).join(" · ")} />
        <Row
          k="Endereço"
          v={p.endereco && `${p.endereco}, ${p.numero}${p.complemento ? ` — ${p.complemento}` : ""} · ${p.bairro} · ${p.cidade}/${p.uf} · ${p.cep}`}
        />
      </Block>

      <Block title="Documentação" onEdit={onEdit && (() => onEdit(1))}>
        <Row k="Identificação" v={doc.rg && `${doc.rg} · ${doc.orgaoEmissor}/${doc.ufEmissor}`} />
        <Row k="PIS/NIT" v={doc.pisNit} />
        <Row k="CTPS Digital" v={doc.ctpsDigital ? "Conferida" : "Não conferida"} />
        {doc.exigeCnh && <Row k="CNH" v={doc.cnhNumero && `Cat. ${doc.cnhCategoria} · validade ${formatDateBR(doc.cnhValidade)}`} />}
        <Row
          k="Arquivos"
          v={`${doc.arquivos.filter((f) => f.status === "validado").length} validados · ${doc.arquivos.filter((f) => f.status === "recebido").length} recebidos · ${doc.arquivos.filter((f) => f.required && f.status === "pendente").length} obrigatórios pendentes`}
        />
      </Block>

      <Block title="Dados contratuais" onEdit={onEdit && (() => onEdit(2))}>
        <Row k="Empresa" v={empresa && `${empresa.label} · ${c.cnpj}`} />
        <Row k="Matrícula / cargo" v={[c.matricula, c.cargo].filter(Boolean).join(" · ")} />
        <Row k="Departamento" v={[c.departamento, label(CENTROS_CUSTO, c.centroCusto)].filter(Boolean).join(" · ")} />
        <Row k="Admissão" v={formatDateBR(c.dataAdmissao)} />
        <Row k="Contrato" v={contrato} />
        <Row k="Regime" v={label(REGIMES, c.regime)} />
        <Row k="Jornada" v={c.jornada && `${label(JORNADAS, c.jornada)} · ${c.cargaSemanal}h · ${c.horarioEntrada}–${c.horarioSaida}`} />
        <Row k="Salário" v={formatBRL(c.salario)} />
        <Row k="Sindicato" v={c.sindicato} />
        <Row k="Responsável" v={c.responsavel} />
      </Block>

      <Block title="Bancários e benefícios" onEdit={onEdit && (() => onEdit(3))}>
        <Row k="Conta" v={b.banco && `${b.banco} · ag. ${b.agencia} · ${label(TIPOS_CONTA, b.tipoConta)} ${hideAccount(b.conta)}`} />
        <Row k="Chave Pix" v={b.chavePix ? "Informada" : ""} />
        {b.beneficios.map((ben) => (
          <Row
            key={ben.id}
            k={ben.nome || "Benefício"}
            v={ben.status && `${ben.status[0].toUpperCase()}${ben.status.slice(1)}${ben.detalhe ? ` · ${ben.detalhe}` : ""}`}
          />
        ))}
      </Block>

      <div className="xl:col-span-2">
        <Block title={`Dependentes (${data.dependentes.length})`} onEdit={onEdit && (() => onEdit(4))}>
          {data.dependentes.length === 0 ? (
            <Row k="Dependentes" v="Nenhum cadastrado" />
          ) : (
            data.dependentes.map((d, i) => (
              <Row
                key={d.id}
                k={`${i + 1}. ${d.parentesco || "Dependente"}`}
                v={[
                  d.nome,
                  formatDateBR(d.dataNascimento),
                  d.cpf && hideCPF(d.cpf),
                  [d.irrf && "IRRF", d.salarioFamilia && "Salário-família", d.planoSaude && "Plano de saúde"].filter(Boolean).join(", "),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))
          )}
          {data.observacoes && <Row k="Observações" v={data.observacoes} />}
        </Block>
      </div>
    </div>
  );
}
