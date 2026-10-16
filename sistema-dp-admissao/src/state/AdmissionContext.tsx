import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type {
  AdmissionData,
  AdmissionState,
  AdmissionStatus,
  BankBenefitsData,
  ContractData,
  DocumentData,
  FieldErrors,
  PersonalData,
  StepId,
} from "../types";
import { demoAdmission, initialState } from "../data/initial";
import { clearDraft, loadDraft, saveDraft } from "../lib/storage";
import { deriveStatus, getPendencias, STEPS, validateAll, type Pendencia } from "../lib/validation";

interface AdmissionContextValue {
  state: AdmissionState;
  data: AdmissionData;
  status: AdmissionStatus;
  stepId: StepId;
  errorsByStep: Record<StepId, FieldErrors>;
  pendencias: Pendencia[];
  attemptedSteps: StepId[];
  lastAutosave: string | null;

  setData: (fn: (d: AdmissionData) => AdmissionData) => void;
  setPessoais: <K extends keyof PersonalData>(k: K, v: PersonalData[K]) => void;
  setDocumentos: <K extends keyof DocumentData>(k: K, v: DocumentData[K]) => void;
  setContrato: <K extends keyof ContractData>(k: K, v: ContractData[K]) => void;
  setBancarios: <K extends keyof BankBenefitsData>(k: K, v: BankBenefitsData[K]) => void;

  /** Erro do campo, exibido só depois que ele foi tocado ou a etapa foi enviada */
  errorFor: (key: string) => string | undefined;
  touch: (key: string) => void;

  goTo: (index: number) => void;
  markAttempted: (step: StepId) => void;
  confirmStep: (step: StepId) => void;
  unconfirmStep: (step: StepId) => void;
  saveNow: () => boolean;
  sendToReview: () => void;
  finish: () => void;
  reset: () => void;
  loadDemo: () => void;
}

const Ctx = createContext<AdmissionContextValue | null>(null);

export function useAdmission() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmission precisa estar dentro de <AdmissionProvider>");
  return ctx;
}

export function AdmissionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdmissionState>(() => loadDraft() ?? initialState());
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [attemptedSteps, setAttempted] = useState<StepId[]>([]);
  const [lastAutosave, setLastAutosave] = useState<string | null>(null);
  const first = useRef(true);

  // Salvamento automático na sessão a cada alteração (com pequeno atraso)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      if (saveDraft(state)) setLastAutosave(new Date().toISOString());
    }, 400);
    return () => clearTimeout(t);
  }, [state]);

  const errorsByStep = useMemo(() => validateAll(state.data), [state.data]);
  const status = useMemo(() => deriveStatus(state), [state]);
  const pendencias = useMemo(() => getPendencias(state), [state]);
  const stepId = STEPS[state.currentStep].id;

  const setData = useCallback((fn: (d: AdmissionData) => AdmissionData) => {
    setState((s) => (s.finishedAt ? s : { ...s, data: fn(s.data) }));
  }, []);

  const section =
    <S extends "pessoais" | "documentos" | "contrato" | "bancarios">(name: S) =>
    <K extends keyof AdmissionData[S]>(k: K, v: AdmissionData[S][K]) =>
      setData((d) => ({ ...d, [name]: { ...d[name], [k]: v } }));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setPessoais = useCallback(section("pessoais"), [setData]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setDocumentos = useCallback(section("documentos"), [setData]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setContrato = useCallback(section("contrato"), [setData]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setBancarios = useCallback(section("bancarios"), [setData]);

  const errorFor = useCallback(
    (key: string) => {
      const step = (key.startsWith("bancarios") ? "beneficios" : key.split(".")[0]) as StepId;
      const err = errorsByStep[step]?.[key];
      if (!err) return undefined;
      return touched.has(key) || attemptedSteps.includes(step) || Boolean(state.sentToReviewAt) ? err : undefined;
    },
    [errorsByStep, touched, attemptedSteps, state.sentToReviewAt],
  );

  const touch = useCallback((key: string) => {
    setTouched((t) => (t.has(key) ? t : new Set(t).add(key)));
  }, []);

  const goTo = useCallback((index: number) => {
    setState((s) => ({ ...s, currentStep: Math.max(0, Math.min(STEPS.length - 1, index)) }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const markAttempted = useCallback((step: StepId) => {
    setAttempted((a) => (a.includes(step) ? a : [...a, step]));
  }, []);

  const confirmStep = useCallback((step: StepId) => {
    setState((s) => (s.confirmedSteps.includes(step) ? s : { ...s, confirmedSteps: [...s.confirmedSteps, step] }));
  }, []);

  const unconfirmStep = useCallback((step: StepId) => {
    setState((s) => ({ ...s, confirmedSteps: s.confirmedSteps.filter((x) => x !== step) }));
  }, []);

  const stateRef = useRef(state);
  stateRef.current = state;

  const saveNow = useCallback(() => {
    const savedAt = new Date().toISOString();
    const next = { ...stateRef.current, savedAt };
    const ok = saveDraft(next);
    setState(next);
    if (ok) setLastAutosave(savedAt);
    return ok;
  }, []);

  const sendToReview = useCallback(() => {
    setAttempted(STEPS.map((s) => s.id));
    setState((s) => ({ ...s, sentToReviewAt: new Date().toISOString() }));
  }, []);

  const finish = useCallback(() => {
    setState((s) => ({ ...s, finishedAt: new Date().toISOString() }));
  }, []);

  const reset = useCallback(() => {
    clearDraft();
    setTouched(new Set());
    setAttempted([]);
    setLastAutosave(null);
    first.current = true;
    setState(initialState());
    window.scrollTo({ top: 0 });
  }, []);

  const loadDemo = useCallback(() => {
    setState((s) => ({ ...s, data: demoAdmission() }));
  }, []);

  const value: AdmissionContextValue = {
    state,
    data: state.data,
    status,
    stepId,
    errorsByStep,
    pendencias,
    attemptedSteps,
    lastAutosave,
    setData,
    setPessoais,
    setDocumentos,
    setContrato,
    setBancarios,
    errorFor,
    touch,
    goTo,
    markAttempted,
    confirmStep,
    unconfirmStep,
    saveNow,
    sendToReview,
    finish,
    reset,
    loadDemo,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
