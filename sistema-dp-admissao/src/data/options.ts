export interface Option {
  value: string;
  label: string;
}

const toOptions = (items: string[]): Option[] => items.map((i) => ({ value: i, label: i }));

export const UFS = toOptions([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]);

export const SEXO: Option[] = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
];

export const ESTADO_CIVIL = toOptions([
  "Solteiro(a)",
  "Casado(a)",
  "União estável",
  "Divorciado(a)",
  "Separado(a) judicialmente",
  "Viúvo(a)",
]);

export const NACIONALIDADE = toOptions(["Brasileira", "Brasileira naturalizada", "Estrangeira"]);

export const ORGAO_EMISSOR = toOptions(["SSP", "DETRAN", "PC", "IFP", "IIRGD", "SDS", "SESP", "PF", "Outro"]);

export const CNH_CATEGORIAS = toOptions(["A", "B", "AB", "C", "D", "E", "AC", "AD", "AE"]);

/** Empresas fictícias cadastradas no sistema (demonstração) */
export const EMPRESAS = [
  { value: "aurora", label: "Aurora Comércio de Alimentos Ltda.", cnpj: "11.222.333/0001-81", sindicato: "Sindicato dos Comerciários de São Paulo" },
  { value: "vale-norte", label: "Vale Norte Logística S.A.", cnpj: "45.723.174/0001-10", sindicato: "Sindicato dos Trabalhadores em Logística" },
  { value: "horizonte", label: "Horizonte Serviços Administrativos Ltda.", cnpj: "60.701.190/0001-04", sindicato: "" },
];

export const DEPARTAMENTOS = toOptions([
  "Administrativo",
  "Comercial",
  "Financeiro",
  "Logística",
  "Operações",
  "Recursos Humanos",
  "Tecnologia",
]);

export const CENTROS_CUSTO = toOptions([
  "1001 — Administração",
  "2001 — Vendas",
  "3001 — Operações",
  "4001 — Logística",
  "5001 — Tecnologia",
]);

/** Tipos de contrato habilitados nas regras do sistema */
export const TIPOS_CONTRATO: Option[] = [
  { value: "experiencia", label: "Contrato de experiência" },
  { value: "indeterminado", label: "Prazo indeterminado" },
  { value: "determinado", label: "Prazo determinado" },
];

export const PRAZOS_EXPERIENCIA: Option[] = [
  { value: "30", label: "30 dias" },
  { value: "45", label: "45 dias" },
  { value: "45+45", label: "45 + 45 dias (prorrogável)" },
  { value: "60", label: "60 dias" },
  { value: "30+60", label: "30 + 60 dias (prorrogável)" },
  { value: "90", label: "90 dias" },
];

export const REGIMES: Option[] = [
  { value: "presencial", label: "Presencial" },
  { value: "hibrido", label: "Híbrido" },
  { value: "teletrabalho", label: "Teletrabalho" },
];

export const JORNADAS: Option[] = [
  { value: "44h", label: "44h semanais — segunda a sábado" },
  { value: "44h-5x2", label: "44h semanais — 5x2 (compensação do sábado)" },
  { value: "40h", label: "40h semanais — 5x2" },
  { value: "36h-12x36", label: "12x36" },
  { value: "30h", label: "30h semanais — 6h diárias" },
  { value: "parcial", label: "Tempo parcial" },
];

export const BANCOS = toOptions([
  "001 — Banco do Brasil",
  "033 — Santander",
  "104 — Caixa Econômica Federal",
  "237 — Bradesco",
  "260 — Nu Pagamentos",
  "341 — Itaú Unibanco",
  "077 — Banco Inter",
  "336 — C6 Bank",
  "756 — Sicoob",
  "748 — Sicredi",
]);

export const TIPOS_CONTA: Option[] = [
  { value: "corrente", label: "Conta corrente" },
  { value: "salario", label: "Conta salário" },
  { value: "poupanca", label: "Conta poupança" },
];

export const PARENTESCO = toOptions([
  "Cônjuge",
  "Companheiro(a)",
  "Filho(a)",
  "Enteado(a)",
  "Pai/Mãe",
  "Menor sob guarda judicial",
  "Outro",
]);

/** Analista logado (fictício) */
export const USUARIO_LOGADO = {
  nome: "Mariana Albuquerque",
  cargo: "Analista de DP",
  iniciais: "MA",
};
