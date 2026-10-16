import type { AdmissionData, AdmissionState, AdmissionStatus, FieldErrors, StepId } from "../types";
import {
  ageAt,
  daysBetween,
  isValidCEP,
  isValidCNPJ,
  isValidCPF,
  isValidDate,
  isValidEmail,
  isValidPhone,
  isValidPIS,
  minutesBetween,
} from "./validators";
import { currencyToNumber, onlyDigits } from "./masks";

export const STEPS: { id: StepId; title: string; short: string }[] = [
  { id: "pessoais", title: "Dados pessoais", short: "Pessoais" },
  { id: "documentos", title: "Documentação", short: "Documentos" },
  { id: "contrato", title: "Dados contratuais", short: "Contrato" },
  { id: "beneficios", title: "Dados bancários e benefícios", short: "Benefícios" },
  { id: "dependentes", title: "Dependentes e complementares", short: "Dependentes" },
  { id: "conferencia", title: "Conferência e conclusão", short: "Conferência" },
];

/** Salário mínimo nacional usado como referência de validação (configurável no sistema) */
export const SALARIO_MINIMO = 1518;

const REQUIRED = "Campo obrigatório.";

function req(errors: FieldErrors, key: string, value: string, message = REQUIRED) {
  if (!value || !value.trim()) errors[key] = message;
}

export function validatePersonal(d: AdmissionData): FieldErrors {
  const e: FieldErrors = {};
  const p = d.pessoais;

  req(e, "pessoais.nomeCompleto", p.nomeCompleto);
  if (p.nomeCompleto && p.nomeCompleto.trim().split(/\s+/).length < 2) {
    e["pessoais.nomeCompleto"] = "Informe nome e sobrenome.";
  }

  req(e, "pessoais.cpf", p.cpf);
  if (p.cpf && !isValidCPF(p.cpf)) e["pessoais.cpf"] = "CPF inválido. Confira os 11 dígitos.";

  req(e, "pessoais.dataNascimento", p.dataNascimento);
  if (p.dataNascimento) {
    if (!isValidDate(p.dataNascimento)) e["pessoais.dataNascimento"] = "Data inválida.";
    else if (ageAt(p.dataNascimento) < 14) e["pessoais.dataNascimento"] = "Idade mínima para admissão é 14 anos (aprendiz).";
    else if (ageAt(p.dataNascimento) > 100) e["pessoais.dataNascimento"] = "Confira o ano de nascimento.";
  }

  req(e, "pessoais.sexo", p.sexo, "Selecione uma opção.");
  req(e, "pessoais.estadoCivil", p.estadoCivil, "Selecione uma opção.");
  req(e, "pessoais.nacionalidade", p.nacionalidade, "Selecione uma opção.");
  req(e, "pessoais.nomeMae", p.nomeMae);
  if (!p.paiNaoDeclarado) req(e, "pessoais.nomePai", p.nomePai, "Informe o nome do pai ou marque “Não declarado”.");

  req(e, "pessoais.email", p.email);
  if (p.email && !isValidEmail(p.email)) e["pessoais.email"] = "E-mail inválido. Exemplo: nome@empresa.com.";

  req(e, "pessoais.telefone", p.telefone);
  if (p.telefone && !isValidPhone(p.telefone)) e["pessoais.telefone"] = "Telefone deve ter DDD + 8 ou 9 dígitos.";

  req(e, "pessoais.cep", p.cep);
  if (p.cep && !isValidCEP(p.cep)) e["pessoais.cep"] = "CEP deve ter 8 dígitos.";
  req(e, "pessoais.endereco", p.endereco);
  req(e, "pessoais.numero", p.numero, "Informe o número ou “S/N”.");
  req(e, "pessoais.bairro", p.bairro);
  req(e, "pessoais.cidade", p.cidade);
  req(e, "pessoais.uf", p.uf, "Selecione a UF.");
  return e;
}

export function validateDocuments(d: AdmissionData): FieldErrors {
  const e: FieldErrors = {};
  const doc = d.documentos;

  req(e, "documentos.rg", doc.rg);
  req(e, "documentos.orgaoEmissor", doc.orgaoEmissor, "Selecione o órgão emissor.");
  req(e, "documentos.ufEmissor", doc.ufEmissor, "Selecione a UF.");
  if (doc.dataEmissao) {
    if (!isValidDate(doc.dataEmissao)) e["documentos.dataEmissao"] = "Data inválida.";
    else if (daysBetween(doc.dataEmissao, new Date().toISOString().slice(0, 10)) < 0) {
      e["documentos.dataEmissao"] = "A data de emissão não pode estar no futuro.";
    }
  }
  if (doc.pisNit && !isValidPIS(doc.pisNit)) e["documentos.pisNit"] = "PIS/NIT inválido. Confira os 11 dígitos.";
  if (doc.tituloEleitor && onlyDigits(doc.tituloEleitor).length !== 12) {
    e["documentos.tituloEleitor"] = "O título de eleitor tem 12 dígitos.";
  }
  if (doc.exigeCnh) {
    req(e, "documentos.cnhNumero", doc.cnhNumero, "A função exige CNH: informe o número.");
    if (doc.cnhNumero && onlyDigits(doc.cnhNumero).length !== 11) e["documentos.cnhNumero"] = "A CNH tem 11 dígitos.";
    req(e, "documentos.cnhCategoria", doc.cnhCategoria, "Selecione a categoria.");
    req(e, "documentos.cnhValidade", doc.cnhValidade);
    if (doc.cnhValidade && daysBetween(new Date().toISOString().slice(0, 10), doc.cnhValidade) < 0) {
      e["documentos.cnhValidade"] = "CNH vencida. Solicite a CNH renovada.";
    }
  }
  return e;
}

export function validateContract(d: AdmissionData): FieldErrors {
  const e: FieldErrors = {};
  const c = d.contrato;

  req(e, "contrato.empresa", c.empresa, "Selecione a empresa contratante.");
  req(e, "contrato.cnpj", c.cnpj);
  if (c.cnpj && !isValidCNPJ(c.cnpj)) e["contrato.cnpj"] = "CNPJ inválido.";
  req(e, "contrato.matricula", c.matricula);
  req(e, "contrato.cargo", c.cargo);
  req(e, "contrato.departamento", c.departamento, "Selecione o departamento.");
  req(e, "contrato.dataAdmissao", c.dataAdmissao);
  if (c.dataAdmissao && d.pessoais.dataNascimento && isValidDate(c.dataAdmissao)) {
    if (ageAt(d.pessoais.dataNascimento, c.dataAdmissao) < 14) {
      e["contrato.dataAdmissao"] = "Na data de admissão o colaborador teria menos de 14 anos.";
    }
  }

  req(e, "contrato.tipoContrato", c.tipoContrato, "Selecione o tipo de contrato.");
  if (c.tipoContrato === "experiencia") {
    req(e, "contrato.prazoExperiencia", c.prazoExperiencia, "Selecione o prazo da experiência.");
  }
  if (c.tipoContrato === "determinado") {
    req(e, "contrato.dataTermino", c.dataTermino, "Informe a data de término.");
    if (c.dataTermino && c.dataAdmissao) {
      const dias = daysBetween(c.dataAdmissao, c.dataTermino);
      if (dias <= 0) e["contrato.dataTermino"] = "A data de término deve ser depois da admissão.";
      else if (dias > 730) e["contrato.dataTermino"] = "Contrato por prazo determinado pode durar no máximo 2 anos.";
    }
  }

  req(e, "contrato.regime", c.regime, "Selecione o regime.");
  req(e, "contrato.jornada", c.jornada, "Selecione a jornada.");
  req(e, "contrato.horarioEntrada", c.horarioEntrada);
  req(e, "contrato.horarioSaida", c.horarioSaida);
  if (c.horarioEntrada && c.horarioSaida && minutesBetween(c.horarioEntrada, c.horarioSaida) === 0) {
    e["contrato.horarioSaida"] = "Entrada e saída não podem ser iguais.";
  }

  req(e, "contrato.salario", c.salario);
  if (c.salario) {
    const valor = currencyToNumber(c.salario);
    const carga = Number(c.cargaSemanal) || 44;
    const minimoProporcional = (SALARIO_MINIMO * Math.min(carga, 44)) / 44;
    if (valor <= 0) e["contrato.salario"] = "Informe um salário maior que zero.";
    else if (valor < minimoProporcional - 0.005) {
      e["contrato.salario"] = `Abaixo do salário mínimo proporcional (R$ ${minimoProporcional
        .toFixed(2)
        .replace(".", ",")} para ${carga}h).`;
    }
  }

  req(e, "contrato.cargaSemanal", c.cargaSemanal);
  if (c.cargaSemanal) {
    const n = Number(c.cargaSemanal);
    if (!Number.isFinite(n) || n <= 0) e["contrato.cargaSemanal"] = "Informe as horas semanais.";
    else if (n > 44) e["contrato.cargaSemanal"] = "O limite legal é 44 horas semanais.";
  }

  req(e, "contrato.centroCusto", c.centroCusto, "Selecione o centro de custo.");
  req(e, "contrato.responsavel", c.responsavel);
  return e;
}

export function validateBankBenefits(d: AdmissionData): FieldErrors {
  const e: FieldErrors = {};
  const b = d.bancarios;
  req(e, "bancarios.banco", b.banco, "Selecione o banco.");
  req(e, "bancarios.agencia", b.agencia);
  if (b.agencia && !/^\d{4}(-?\d)?$/.test(b.agencia.trim())) e["bancarios.agencia"] = "Agência com 4 dígitos (dígito opcional).";
  req(e, "bancarios.conta", b.conta);
  if (b.conta && !/^\d{3,12}-?[\dXx]?$/.test(b.conta.trim())) e["bancarios.conta"] = "Use só números e o dígito (ex.: 12345-6).";
  req(e, "bancarios.tipoConta", b.tipoConta, "Selecione o tipo de conta.");

  b.beneficios.forEach((ben, i) => {
    if (!ben.nome.trim()) e[`bancarios.beneficios.${i}.nome`] = "Dê um nome ao benefício.";
    if (!ben.status) e[`bancarios.beneficios.${i}.status`] = "Indique se foi solicitado, aprovado ou dispensado.";
  });
  return e;
}

export function validateDependents(d: AdmissionData): FieldErrors {
  const e: FieldErrors = {};
  d.dependentes.forEach((dep, i) => {
    const k = `dependentes.${i}`;
    req(e, `${k}.nome`, dep.nome);
    req(e, `${k}.dataNascimento`, dep.dataNascimento);
    if (dep.dataNascimento && daysBetween(new Date().toISOString().slice(0, 10), dep.dataNascimento) > 0) {
      e[`${k}.dataNascimento`] = "A data não pode estar no futuro.";
    }
    req(e, `${k}.parentesco`, dep.parentesco, "Selecione o parentesco.");
    if (dep.irrf || dep.planoSaude) {
      req(e, `${k}.cpf`, dep.cpf, "CPF obrigatório para dependente de IRRF ou plano de saúde.");
    }
    if (dep.cpf && !isValidCPF(dep.cpf)) e[`${k}.cpf`] = "CPF inválido.";
    if (dep.cpf && dep.cpf === d.pessoais.cpf) e[`${k}.cpf`] = "CPF igual ao do colaborador.";
    if (dep.salarioFamilia && dep.dataNascimento && ageAt(dep.dataNascimento) >= 14 && dep.parentesco !== "Outro") {
      e[`${k}.salarioFamilia`] = "Salário-família vale para filhos de até 14 anos (ou inválidos).";
    }
  });
  return e;
}

export function validateStep(step: StepId, d: AdmissionData): FieldErrors {
  switch (step) {
    case "pessoais":
      return validatePersonal(d);
    case "documentos":
      return validateDocuments(d);
    case "contrato":
      return validateContract(d);
    case "beneficios":
      return validateBankBenefits(d);
    case "dependentes":
      return validateDependents(d);
    case "conferencia":
      return {};
  }
}

export function validateAll(d: AdmissionData) {
  const byStep = {} as Record<StepId, FieldErrors>;
  for (const s of STEPS) byStep[s.id] = validateStep(s.id, d);
  return byStep;
}

export interface Pendencia {
  step: StepId;
  tipo: "erro" | "documento" | "conferencia";
  mensagem: string;
}

const FIELD_LABELS: Record<string, string> = {
  nomeCompleto: "Nome completo", cpf: "CPF", dataNascimento: "Data de nascimento", sexo: "Sexo",
  estadoCivil: "Estado civil", nacionalidade: "Nacionalidade", nomeMae: "Nome da mãe", nomePai: "Nome do pai",
  email: "E-mail", telefone: "Telefone", cep: "CEP", endereco: "Endereço", numero: "Número", bairro: "Bairro",
  cidade: "Cidade", uf: "Estado", rg: "RG / identificação", orgaoEmissor: "Órgão emissor", ufEmissor: "UF do emissor",
  dataEmissao: "Data de emissão", pisNit: "PIS/NIT", tituloEleitor: "Título de eleitor", cnhNumero: "Número da CNH",
  cnhCategoria: "Categoria da CNH", cnhValidade: "Validade da CNH", empresa: "Empresa contratante", matricula: "Matrícula",
  cargo: "Cargo", departamento: "Departamento", dataAdmissao: "Data de admissão", tipoContrato: "Tipo de contrato",
  prazoExperiencia: "Prazo de experiência", dataTermino: "Data de término", regime: "Regime de trabalho",
  jornada: "Jornada", horarioEntrada: "Horário de entrada", horarioSaida: "Horário de saída", salario: "Salário",
  cargaSemanal: "Carga horária semanal", centroCusto: "Centro de custo", responsavel: "Responsável pelo cadastro",
  banco: "Banco", agencia: "Agência", conta: "Conta", tipoConta: "Tipo de conta", nome: "Nome",
  parentesco: "Parentesco", status: "Situação", salarioFamilia: "Salário-família",
};

export function describeErrorKey(key: string, d: AdmissionData) {
  const parts = key.split(".");
  const field = parts[parts.length - 1];
  const label = FIELD_LABELS[field] ?? field;
  if (parts[0] === "dependentes") {
    const dep = d.dependentes[Number(parts[1])];
    return `Dependente ${Number(parts[1]) + 1}${dep?.nome ? ` (${dep.nome.split(" ")[0]})` : ""}: ${label}`;
  }
  if (parts[1] === "beneficios") {
    const ben = d.bancarios.beneficios[Number(parts[2])];
    return `${ben?.nome || "Benefício"}: ${label}`;
  }
  return label;
}

export function getPendencias(state: AdmissionState): Pendencia[] {
  const d = state.data;
  const list: Pendencia[] = [];
  const all = validateAll(d);

  for (const s of STEPS) {
    for (const [key, msg] of Object.entries(all[s.id])) {
      list.push({ step: s.id, tipo: "erro", mensagem: `${describeErrorKey(key, d)} — ${msg}` });
    }
  }

  for (const f of d.documentos.arquivos) {
    if (!f.required) continue;
    if (f.status === "pendente") list.push({ step: "documentos", tipo: "documento", mensagem: `${f.label}: arquivo não recebido.` });
    else if (f.status === "recebido") list.push({ step: "documentos", tipo: "documento", mensagem: `${f.label}: recebido, aguardando validação.` });
  }

  for (const c of d.checklist) {
    if (!c.checked) list.push({ step: "conferencia", tipo: "conferencia", mensagem: `Conferência pendente: ${c.label}.` });
  }
  return list;
}

export function hasFieldErrors(d: AdmissionData) {
  const all = validateAll(d);
  return Object.values(all).some((e) => Object.keys(e).length > 0);
}

export const requiredDocsMissing = (d: AdmissionData) =>
  d.documentos.arquivos.some((f) => f.required && f.status === "pendente");

export const requiredDocsNotValidated = (d: AdmissionData) =>
  d.documentos.arquivos.some((f) => f.required && f.status !== "validado");

/**
 * Status do processo, calculado a partir dos dados e das ações do usuário.
 * Nada é marcado como concluído sem confirmação explícita.
 */
export function deriveStatus(state: AdmissionState): AdmissionStatus {
  const d = state.data;
  if (state.finishedAt) return "concluido";

  const sent = Boolean(state.sentToReviewAt);
  const docsStepConfirmed = state.confirmedSteps.includes("documentos");

  if (sent && hasFieldErrors(d)) return "pendente_correcao";
  if (requiredDocsMissing(d) && (sent || docsStepConfirmed)) return "aguardando_documentos";
  if (!sent) return "rascunho";
  if (requiredDocsNotValidated(d) || d.checklist.some((c) => !c.checked)) return "em_conferencia";
  return "pronto_finalizacao";
}

export const STATUS_INFO: Record<AdmissionStatus, { label: string; description: string }> = {
  rascunho: { label: "Rascunho", description: "Cadastro em preenchimento." },
  aguardando_documentos: { label: "Aguardando documentos", description: "Há documentos obrigatórios não recebidos." },
  em_conferencia: { label: "Em conferência", description: "Enviado para conferência. Valide documentos e o checklist." },
  pendente_correcao: { label: "Pendente de correção", description: "Há campos com erro que precisam ser corrigidos." },
  pronto_finalizacao: { label: "Pronto para finalização", description: "Tudo conferido. A admissão pode ser finalizada." },
  concluido: { label: "Concluído", description: "Admissão finalizada neste sistema." },
};
