export type AdmissionStatus =
  | "rascunho"
  | "aguardando_documentos"
  | "em_conferencia"
  | "pendente_correcao"
  | "pronto_finalizacao"
  | "concluido";

export type StepId = "pessoais" | "documentos" | "contrato" | "beneficios" | "dependentes" | "conferencia";

export interface PersonalData {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  estadoCivil: string;
  nacionalidade: string;
  nomeMae: string;
  nomePai: string;
  paiNaoDeclarado: boolean;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export type DocFileStatus = "pendente" | "recebido" | "validado";

export interface DocFile {
  id: string;
  label: string;
  required: boolean;
  status: DocFileStatus;
  fileName?: string;
  fileSize?: number;
  receivedAt?: string;
}

export interface DocumentData {
  rg: string;
  orgaoEmissor: string;
  ufEmissor: string;
  dataEmissao: string;
  pisNit: string;
  ctpsDigital: boolean;
  tituloEleitor: string;
  reservista: string;
  exigeCnh: boolean;
  cnhNumero: string;
  cnhCategoria: string;
  cnhValidade: string;
  arquivos: DocFile[];
}

export interface ContractData {
  empresa: string;
  cnpj: string;
  matricula: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  tipoContrato: "" | "indeterminado" | "determinado" | "experiencia";
  prazoExperiencia: string;
  dataTermino: string;
  regime: string;
  jornada: string;
  horarioEntrada: string;
  horarioSaida: string;
  salario: string;
  cargaSemanal: string;
  centroCusto: string;
  sindicato: string;
  responsavel: string;
}

export type BenefitStatus = "solicitado" | "aprovado" | "dispensado";

export interface Benefit {
  id: string;
  nome: string;
  status: BenefitStatus | "";
  detalhe: string;
  custom?: boolean;
}

export interface BankBenefitsData {
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: string;
  chavePix: string;
  beneficios: Benefit[];
}

export interface Dependent {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  parentesco: string;
  irrf: boolean;
  salarioFamilia: boolean;
  planoSaude: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface AdmissionData {
  pessoais: PersonalData;
  documentos: DocumentData;
  contrato: ContractData;
  bancarios: BankBenefitsData;
  dependentes: Dependent[];
  checklist: ChecklistItem[];
  observacoes: string;
}

export interface AdmissionState {
  data: AdmissionData;
  currentStep: number;
  /** Etapas confirmadas pelo usuário com "Salvar e continuar" e sem erros */
  confirmedSteps: StepId[];
  savedAt: string | null;
  sentToReviewAt: string | null;
  finishedAt: string | null;
  protocolo: string;
}

export type FieldErrors = Record<string, string>;
