import type { AdmissionData, AdmissionState, ChecklistItem, DocFile, Benefit } from "../types";
import { USUARIO_LOGADO } from "./options";

export const DOCUMENT_FILES: DocFile[] = [
  { id: "identificacao", label: "Documento de identificação (RG ou CNH)", required: true, status: "pendente" },
  { id: "cpf", label: "Comprovante de CPF", required: true, status: "pendente" },
  { id: "residencia", label: "Comprovante de residência", required: true, status: "pendente" },
  { id: "ctps", label: "CTPS Digital", required: true, status: "pendente" },
  { id: "aso", label: "Atestado de Saúde Ocupacional (ASO)", required: true, status: "pendente" },
  { id: "titulo", label: "Título de eleitor", required: false, status: "pendente" },
  { id: "reservista", label: "Certificado de reservista", required: false, status: "pendente" },
  { id: "escolaridade", label: "Comprovante de escolaridade", required: false, status: "pendente" },
  { id: "certidoes", label: "Certidões dos dependentes", required: false, status: "pendente" },
];

export const BENEFITS: Benefit[] = [
  { id: "vt", nome: "Vale-transporte", status: "", detalhe: "" },
  { id: "vr", nome: "Vale-refeição", status: "", detalhe: "" },
  { id: "va", nome: "Vale-alimentação", status: "", detalhe: "" },
  { id: "saude", nome: "Plano de saúde", status: "", detalhe: "" },
];

export const CHECKLIST: ChecklistItem[] = [
  { id: "pessoais", label: "Dados pessoais conferidos", checked: false },
  { id: "documentos", label: "Documentos recebidos", checked: false },
  { id: "contrato", label: "Dados contratuais validados", checked: false },
  { id: "salario", label: "Salário e jornada conferidos", checked: false },
  { id: "dependentes", label: "Dependentes revisados", checked: false },
  { id: "exames", label: "Exames e requisitos admissionais verificados", checked: false },
  { id: "esocial", label: "Cadastro preparado para integração com o eSocial", checked: false },
];

export function emptyAdmission(): AdmissionData {
  return {
    pessoais: {
      nomeCompleto: "",
      cpf: "",
      dataNascimento: "",
      sexo: "",
      estadoCivil: "",
      nacionalidade: "Brasileira",
      nomeMae: "",
      nomePai: "",
      paiNaoDeclarado: false,
      email: "",
      telefone: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
    },
    documentos: {
      rg: "",
      orgaoEmissor: "",
      ufEmissor: "",
      dataEmissao: "",
      pisNit: "",
      ctpsDigital: false,
      tituloEleitor: "",
      reservista: "",
      exigeCnh: false,
      cnhNumero: "",
      cnhCategoria: "",
      cnhValidade: "",
      arquivos: DOCUMENT_FILES.map((d) => ({ ...d })),
    },
    contrato: {
      empresa: "",
      cnpj: "",
      matricula: "",
      cargo: "",
      departamento: "",
      dataAdmissao: "",
      tipoContrato: "",
      prazoExperiencia: "",
      dataTermino: "",
      regime: "",
      jornada: "",
      horarioEntrada: "",
      horarioSaida: "",
      salario: "",
      cargaSemanal: "",
      centroCusto: "",
      sindicato: "",
      responsavel: USUARIO_LOGADO.nome,
    },
    bancarios: {
      banco: "",
      agencia: "",
      conta: "",
      tipoConta: "",
      chavePix: "",
      beneficios: BENEFITS.map((b) => ({ ...b })),
    },
    dependentes: [],
    checklist: CHECKLIST.map((c) => ({ ...c })),
    observacoes: "",
  };
}

function newProtocol() {
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `ADM-${new Date().getFullYear()}-${n}`;
}

export function initialState(): AdmissionState {
  return {
    data: emptyAdmission(),
    currentStep: 0,
    confirmedSteps: [],
    savedAt: null,
    sentToReviewAt: null,
    finishedAt: null,
    protocolo: newProtocol(),
  };
}

/**
 * Dados FICTÍCIOS para demonstração. Os documentos têm dígitos verificadores
 * válidos só para passar nas validações; não pertencem a ninguém.
 */
export function demoAdmission(): AdmissionData {
  const base = emptyAdmission();
  return {
    ...base,
    pessoais: {
      nomeCompleto: "Juliana Ferreira Campos",
      cpf: "428.617.935-46",
      dataNascimento: "1994-03-18",
      sexo: "feminino",
      estadoCivil: "Casado(a)",
      nacionalidade: "Brasileira",
      nomeMae: "Regina Ferreira Campos",
      nomePai: "Antônio Carlos Campos",
      paiNaoDeclarado: false,
      email: "juliana.campos@exemplo.com",
      telefone: "(11) 98765-4321",
      cep: "04538-132",
      endereco: "Avenida Exemplo",
      numero: "1200",
      complemento: "Apto 54",
      bairro: "Itaim Bibi",
      cidade: "São Paulo",
      uf: "SP",
    },
    documentos: {
      ...base.documentos,
      rg: "34.567.890-1",
      orgaoEmissor: "SSP",
      ufEmissor: "SP",
      dataEmissao: "2015-07-02",
      pisNit: "120.34567.89-9",
      ctpsDigital: true,
      tituloEleitor: "1234 5678 0191",
    },
    contrato: {
      ...base.contrato,
      empresa: "aurora",
      cnpj: "11.222.333/0001-81",
      matricula: "000482",
      cargo: "Analista Financeiro Pleno",
      departamento: "Financeiro",
      dataAdmissao: "2026-11-03",
      tipoContrato: "experiencia",
      prazoExperiencia: "45+45",
      regime: "hibrido",
      jornada: "44h-5x2",
      horarioEntrada: "08:00",
      horarioSaida: "17:48",
      salario: "6.200,00",
      cargaSemanal: "44",
      centroCusto: "1001 — Administração",
      sindicato: "Sindicato dos Comerciários de São Paulo",
    },
    bancarios: {
      banco: "341 — Itaú Unibanco",
      agencia: "0457",
      conta: "38214-6",
      tipoConta: "corrente",
      chavePix: "juliana.campos@exemplo.com",
      beneficios: [
        { id: "vt", nome: "Vale-transporte", status: "dispensado", detalhe: "Colaboradora optou por não receber" },
        { id: "vr", nome: "Vale-refeição", status: "solicitado", detalhe: "R$ 38,00 por dia útil" },
        { id: "va", nome: "Vale-alimentação", status: "aprovado", detalhe: "R$ 650,00 mensais" },
        { id: "saude", nome: "Plano de saúde", status: "solicitado", detalhe: "Plano Enfermaria — titular + 1 dependente" },
      ],
    },
    dependentes: [
      {
        id: "dep-demo-1",
        nome: "Lucas Campos Ribeiro",
        cpf: "713.504.286-71",
        dataNascimento: "2019-09-12",
        parentesco: "Filho(a)",
        irrf: true,
        salarioFamilia: false,
        planoSaude: true,
      },
    ],
  };
}
