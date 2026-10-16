import { describe, expect, it } from "vitest";
import { maskCEP, maskCNPJ, maskCPF, maskCurrency, maskPhone, hideCPF } from "./masks";
import { isValidCNPJ, isValidCPF, isValidPIS } from "./validators";
import { deriveStatus, getPendencias, validateContract, validatePersonal } from "./validation";
import { demoAdmission, initialState } from "../data/initial";
import type { AdmissionState } from "../types";

describe("máscaras", () => {
  it("formata CPF, CNPJ, CEP e telefone", () => {
    expect(maskCPF("52998224725")).toBe("529.982.247-25");
    expect(maskCNPJ("11222333000181")).toBe("11.222.333/0001-81");
    expect(maskCEP("04538132")).toBe("04538-132");
    expect(maskPhone("11987654321")).toBe("(11) 98765-4321");
    expect(maskPhone("1132654321")).toBe("(11) 3265-4321");
  });

  it("formata moeda digitando só números", () => {
    expect(maskCurrency("620000")).toBe("6.200,00");
    expect(maskCurrency("5")).toBe("0,05");
  });

  it("oculta parte do CPF no resumo", () => {
    expect(hideCPF("529.982.247-25")).toBe("***.982.247-**");
  });
});

describe("validadores", () => {
  it("confere dígitos verificadores", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true);
    expect(isValidCPF("529.982.247-26")).toBe(false);
    expect(isValidCPF("111.111.111-11")).toBe(false);
    expect(isValidCNPJ("11.222.333/0001-81")).toBe(true);
    expect(isValidCNPJ("11.222.333/0001-82")).toBe(false);
    expect(isValidPIS("120.34567.89-9")).toBe(true);
  });
});

describe("regras do cadastro", () => {
  it("cadastro vazio tem campos obrigatórios pendentes", () => {
    expect(Object.keys(validatePersonal(initialState().data)).length).toBeGreaterThan(10);
  });

  it("dados fictícios passam nas validações de campos", () => {
    const d = demoAdmission();
    expect(validatePersonal(d)).toEqual({});
    expect(validateContract(d)).toEqual({});
  });

  it("recusa salário abaixo do mínimo e carga acima de 44h", () => {
    const d = demoAdmission();
    d.contrato.salario = "1.000,00";
    d.contrato.cargaSemanal = "48";
    const e = validateContract(d);
    expect(e["contrato.salario"]).toMatch(/mínimo/);
    expect(e["contrato.cargaSemanal"]).toMatch(/44/);
  });
});

describe("status do processo", () => {
  const base = (): AdmissionState => ({ ...initialState(), data: demoAdmission() });

  it("começa como rascunho", () => {
    expect(deriveStatus(base())).toBe("rascunho");
  });

  it("fica aguardando documentos depois de confirmar a etapa sem os arquivos", () => {
    const s = { ...base(), confirmedSteps: ["documentos" as const] };
    expect(deriveStatus(s)).toBe("aguardando_documentos");
  });

  it("não fica pronto sem o checklist marcado pelo usuário", () => {
    const s = base();
    s.data.documentos.arquivos = s.data.documentos.arquivos.map((f) => ({ ...f, status: "validado" }));
    s.sentToReviewAt = new Date().toISOString();
    expect(deriveStatus(s)).toBe("em_conferencia");

    s.data.checklist = s.data.checklist.map((c) => ({ ...c, checked: true }));
    expect(deriveStatus(s)).toBe("pronto_finalizacao");
    expect(getPendencias(s)).toEqual([]);
  });

  it("volta para pendente de correção se um campo ficar inválido após o envio", () => {
    const s = base();
    s.sentToReviewAt = new Date().toISOString();
    s.data.pessoais.cpf = "123";
    expect(deriveStatus(s)).toBe("pendente_correcao");
  });
});
