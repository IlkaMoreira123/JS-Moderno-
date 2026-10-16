import { BadgeCheck, CheckCircle2, Clock, FileText, IdCard, Paperclip, ShieldCheck, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import { useAdmission } from "../../state/AdmissionContext";
import { CNH_CATEGORIAS, ORGAO_EMISSOR, UFS } from "../../data/options";
import { formatDateTimeBR, formatFileSize, maskPIS, onlyDigits } from "../../lib/masks";
import type { DocFile, DocFileStatus } from "../../types";
import { BoundInput, BoundSelect } from "../ui/Bound";
import { FormGrid, SectionCard } from "../ui/Card";
import { Checkbox } from "../ui/Field";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";
import { cn } from "../../lib/cn";

const ACCEPTED = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 5 * 1024 * 1024;

const STATUS_META: Record<DocFileStatus, { label: string; cls: string; Icon: typeof Clock }> = {
  pendente: { label: "Pendente", cls: "bg-amber-50 text-amber-800 ring-amber-200", Icon: Clock },
  recebido: { label: "Recebido", cls: "bg-sky-50 text-sky-800 ring-sky-200", Icon: FileText },
  validado: { label: "Validado", cls: "bg-emerald-50 text-emerald-800 ring-emerald-200", Icon: BadgeCheck },
};

const maskTitulo = (v: string) =>
  onlyDigits(v)
    .slice(0, 12)
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4}) (\d{4})(\d)/, "$1 $2 $3");

export function DocumentsStep() {
  const { data, setDocumentos, setData } = useAdmission();
  const doc = data.documentos;
  const ehMasculino = data.pessoais.sexo === "masculino";

  const updateFile = (id: string, patch: Partial<DocFile>) =>
    setData((d) => ({
      ...d,
      documentos: { ...d.documentos, arquivos: d.documentos.arquivos.map((f) => (f.id === id ? { ...f, ...patch } : f)) },
    }));

  const counts = {
    pendente: doc.arquivos.filter((f) => f.status === "pendente").length,
    recebido: doc.arquivos.filter((f) => f.status === "recebido").length,
    validado: doc.arquivos.filter((f) => f.status === "validado").length,
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Documento de identificação" icon={<IdCard className="h-4 w-4" />}>
        <FormGrid cols={4}>
          <BoundInput name="documentos.rg" label="RG ou documento de identificação" required value={doc.rg} onValue={(v) => setDocumentos("rg", v)} className="sm:col-span-2" />
          <BoundSelect name="documentos.orgaoEmissor" label="Órgão emissor" required value={doc.orgaoEmissor} onValue={(v) => setDocumentos("orgaoEmissor", v)} options={ORGAO_EMISSOR} />
          <BoundSelect name="documentos.ufEmissor" label="UF" required value={doc.ufEmissor} onValue={(v) => setDocumentos("ufEmissor", v)} options={UFS} placeholder="UF" />
          <BoundInput name="documentos.dataEmissao" label="Data de emissão" optionalNote="(quando aplicável)" type="date" value={doc.dataEmissao} onValue={(v) => setDocumentos("dataEmissao", v)} />
        </FormGrid>
      </SectionCard>

      <SectionCard title="Documentos trabalhistas e civis" description="Preencha os que se aplicam a este colaborador." icon={<ShieldCheck className="h-4 w-4" />}>
        <div className="flex flex-col gap-5">
          <FormGrid>
            <BoundInput name="documentos.pisNit" label="PIS/NIT" optionalNote="(quando aplicável)" hint="Não tem? O número é gerado no primeiro emprego." value={doc.pisNit} onValue={(v) => setDocumentos("pisNit", v)} mask={maskPIS} inputMode="numeric" placeholder="000.00000.00-0" />
            <BoundInput name="documentos.tituloEleitor" label="Título de eleitor" optionalNote="(quando necessário)" value={doc.tituloEleitor} onValue={(v) => setDocumentos("tituloEleitor", v)} mask={maskTitulo} inputMode="numeric" placeholder="0000 0000 0000" />
            {ehMasculino && (
              <BoundInput name="documentos.reservista" label="Certificado de reservista" optionalNote="(18 a 45 anos)" value={doc.reservista} onValue={(v) => setDocumentos("reservista", v)} />
            )}
          </FormGrid>
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
            <Checkbox id="documentos-ctpsDigital" label="CTPS Digital conferida" description="Carteira de Trabalho Digital apresentada pelo colaborador (app ou gov.br)." checked={doc.ctpsDigital} onChange={(c) => setDocumentos("ctpsDigital", c)} />
            <Checkbox id="documentos-exigeCnh" label="A função exige CNH" description="Ex.: motorista, entregador, vendedor externo." checked={doc.exigeCnh} onChange={(c) => setDocumentos("exigeCnh", c)} />
          </div>
          {doc.exigeCnh && (
            <FormGrid>
              <BoundInput name="documentos.cnhNumero" label="Número da CNH" required value={doc.cnhNumero} onValue={(v) => setDocumentos("cnhNumero", onlyDigits(v).slice(0, 11))} inputMode="numeric" />
              <BoundSelect name="documentos.cnhCategoria" label="Categoria" required value={doc.cnhCategoria} onValue={(v) => setDocumentos("cnhCategoria", v)} options={CNH_CATEGORIAS} />
              <BoundInput name="documentos.cnhValidade" label="Validade" required type="date" value={doc.cnhValidade} onValue={(v) => setDocumentos("cnhValidade", v)} />
            </FormGrid>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Arquivos dos documentos"
        description="Envie em PDF, JPG ou PNG, até 5 MB cada. Os arquivos ficam só neste navegador."
        icon={<Paperclip className="h-4 w-4" />}
        actions={
          <div className="flex flex-wrap gap-1.5 text-xs" aria-label="Resumo dos documentos">
            <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-800">{counts.pendente} pendentes</span>
            <span className="rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-800">{counts.recebido} recebidos</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800">{counts.validado} validados</span>
          </div>
        }
      >
        <ul className="-my-1 divide-y divide-slate-100">
          {doc.arquivos.map((f) => (
            <DocRow key={f.id} file={f} onChange={(patch) => updateFile(f.id, patch)} />
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

function DocRow({ file, onChange }: { file: DocFile; onChange: (patch: Partial<DocFile>) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const meta = STATUS_META[file.status];
  const inputId = `arquivo-${file.id}`;

  function handleFile(f: File | undefined) {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      toast("error", "Formato não aceito", `“${f.name}” não é PDF, JPG ou PNG.`);
      return;
    }
    if (f.size > MAX_SIZE) {
      toast("error", "Arquivo muito grande", `“${f.name}” tem ${formatFileSize(f.size)}. O limite é 5 MB.`);
      return;
    }
    onChange({ status: "recebido", fileName: f.name, fileSize: f.size, receivedAt: new Date().toISOString() });
    toast("success", "Documento recebido", `${file.label}: ${f.name}`);
  }

  return (
    <li className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className={cn("mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", meta.cls)}>
          <meta.Icon className="h-3 w-3" aria-hidden="true" />
          {meta.label}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-navy-950">
            {file.label}
            {file.required ? <span className="ml-1 text-red-600" aria-label="obrigatório">*</span> : <span className="ml-1.5 text-xs font-normal text-slate-500">opcional</span>}
          </p>
          {file.fileName ? (
            <p className="truncate text-xs text-slate-500">
              {file.fileName} · {formatFileSize(file.fileSize ?? 0)} · recebido {file.receivedAt && formatDateTimeBR(file.receivedAt)}
            </p>
          ) : (
            <p className="text-xs text-slate-400">Nenhum arquivo enviado</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2 pl-[76px] sm:pl-0">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="sr-only"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
          aria-label={`Enviar arquivo: ${file.label}`}
        />
        {file.status === "pendente" ? (
          <Button size="sm" variant="secondary" icon={<Upload className="h-3.5 w-3.5" />} onClick={() => inputRef.current?.click()}>
            Enviar arquivo
          </Button>
        ) : (
          <>
            {file.status === "recebido" ? (
              <Button size="sm" variant="primary" icon={<CheckCircle2 className="h-3.5 w-3.5" />} onClick={() => onChange({ status: "validado" })}>
                Validar
              </Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => onChange({ status: "recebido" })}>
                Desfazer validação
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              aria-label={`Remover arquivo de ${file.label}`}
              onClick={() => onChange({ status: "pendente", fileName: undefined, fileSize: undefined, receivedAt: undefined })}
            >
              <span className="sm:hidden">Remover</span>
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
