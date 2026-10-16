import { Loader2, MapPin, Search, UserRound, Contact } from "lucide-react";
import { useState } from "react";
import { useAdmission } from "../../state/AdmissionContext";
import { ESTADO_CIVIL, NACIONALIDADE, SEXO, UFS } from "../../data/options";
import { maskCEP, maskCPF, maskPhone } from "../../lib/masks";
import { lookupCep } from "../../lib/cep";
import { BoundInput, BoundSelect } from "../ui/Bound";
import { FormGrid, SectionCard } from "../ui/Card";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Field";
import { useToast } from "../ui/Toast";

export function PersonalStep() {
  const { data, setPessoais, setData } = useAdmission();
  const toast = useToast();
  const p = data.pessoais;
  const [buscando, setBuscando] = useState(false);

  async function buscarCep() {
    setBuscando(true);
    try {
      const r = await lookupCep(p.cep);
      setData((d) => ({
        ...d,
        pessoais: {
          ...d.pessoais,
          endereco: r.endereco || d.pessoais.endereco,
          bairro: r.bairro || d.pessoais.bairro,
          cidade: r.cidade,
          uf: r.uf,
        },
      }));
      toast("success", "Endereço preenchido pelo CEP", "Confira os dados e informe o número.");
    } catch (err) {
      toast("warning", "CEP não consultado", err instanceof Error ? err.message : undefined);
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Identificação" description="Como consta no documento oficial do colaborador." icon={<UserRound className="h-4 w-4" />}>
        <FormGrid>
          <BoundInput name="pessoais.nomeCompleto" label="Nome completo" required value={p.nomeCompleto} onValue={(v) => setPessoais("nomeCompleto", v)} autoComplete="name" className="sm:col-span-2" />
          <BoundInput name="pessoais.cpf" label="CPF" required value={p.cpf} onValue={(v) => setPessoais("cpf", v)} mask={maskCPF} inputMode="numeric" placeholder="000.000.000-00" />
          <BoundInput name="pessoais.dataNascimento" label="Data de nascimento" required type="date" value={p.dataNascimento} onValue={(v) => setPessoais("dataNascimento", v)} max={new Date().toISOString().slice(0, 10)} />
          <BoundSelect name="pessoais.sexo" label="Sexo" required hint="Exigido pelo eSocial no cadastro do trabalhador." value={p.sexo} onValue={(v) => setPessoais("sexo", v)} options={SEXO} />
          <BoundSelect name="pessoais.estadoCivil" label="Estado civil" required value={p.estadoCivil} onValue={(v) => setPessoais("estadoCivil", v)} options={ESTADO_CIVIL} />
          <BoundSelect name="pessoais.nacionalidade" label="Nacionalidade" required value={p.nacionalidade} onValue={(v) => setPessoais("nacionalidade", v)} options={NACIONALIDADE} />
          <BoundInput name="pessoais.nomeMae" label="Nome da mãe" required value={p.nomeMae} onValue={(v) => setPessoais("nomeMae", v)} className="sm:col-span-2" />
          <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-3">
            <BoundInput
              name="pessoais.nomePai"
              label="Nome do pai"
              required={!p.paiNaoDeclarado}
              optionalNote="(quando aplicável)"
              value={p.paiNaoDeclarado ? "" : p.nomePai}
              disabled={p.paiNaoDeclarado}
              onValue={(v) => setPessoais("nomePai", v)}
              className="lg:max-w-[calc((100%-2.5rem)*2/3+1.25rem)]"
            />
            <Checkbox
              id="pessoais-paiNaoDeclarado"
              label="Pai não declarado no documento"
              checked={p.paiNaoDeclarado}
              onChange={(c) => setData((d) => ({ ...d, pessoais: { ...d.pessoais, paiNaoDeclarado: c, nomePai: c ? "" : d.pessoais.nomePai } }))}
            />
          </div>
        </FormGrid>
      </SectionCard>

      <SectionCard title="Contato" icon={<Contact className="h-4 w-4" />}>
        <FormGrid cols={2}>
          <BoundInput name="pessoais.email" label="E-mail" required type="email" value={p.email} onValue={(v) => setPessoais("email", v)} autoComplete="email" placeholder="nome@exemplo.com" />
          <BoundInput name="pessoais.telefone" label="Telefone" required type="tel" value={p.telefone} onValue={(v) => setPessoais("telefone", v)} mask={maskPhone} placeholder="(00) 00000-0000" autoComplete="tel" />
        </FormGrid>
      </SectionCard>

      <SectionCard title="Endereço residencial" description="Digite o CEP e use “Buscar” para preencher o endereço." icon={<MapPin className="h-4 w-4" />}>
        <FormGrid cols={4}>
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
            <BoundInput name="pessoais.cep" label="CEP" required value={p.cep} onValue={(v) => setPessoais("cep", v)} mask={maskCEP} inputMode="numeric" placeholder="00000-000" className="flex-1" autoComplete="postal-code" />
            <Button
              variant="secondary"
              onClick={buscarCep}
              disabled={buscando || p.cep.replace(/\D/g, "").length !== 8}
              aria-label="Buscar endereço pelo CEP"
              className="mb-px shrink-0 px-3"
              icon={buscando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            >
              <span className="lg:hidden xl:inline">Buscar</span>
            </Button>
          </div>
          <BoundInput name="pessoais.endereco" label="Endereço" required value={p.endereco} onValue={(v) => setPessoais("endereco", v)} className="sm:col-span-2 lg:col-span-3" autoComplete="address-line1" />
          <BoundInput name="pessoais.numero" label="Número" required value={p.numero} onValue={(v) => setPessoais("numero", v)} />
          <BoundInput name="pessoais.complemento" label="Complemento" optionalNote="(opcional)" value={p.complemento} onValue={(v) => setPessoais("complemento", v)} />
          <BoundInput name="pessoais.bairro" label="Bairro" required value={p.bairro} onValue={(v) => setPessoais("bairro", v)} className="sm:col-span-2" />
          <BoundInput name="pessoais.cidade" label="Cidade" required value={p.cidade} onValue={(v) => setPessoais("cidade", v)} className="sm:col-span-1 lg:col-span-3" autoComplete="address-level2" />
          <BoundSelect name="pessoais.uf" label="Estado" required value={p.uf} onValue={(v) => setPessoais("uf", v)} options={UFS} placeholder="UF" />
        </FormGrid>
      </SectionCard>
    </div>
  );
}
