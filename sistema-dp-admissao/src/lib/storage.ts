import type { AdmissionState } from "../types";

const KEY = "dp-admissao:rascunho:v1";

/** Os dados ficam só na sessão deste navegador (sessionStorage). Nada é enviado a servidor. */
export function loadDraft(): AdmissionState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AdmissionState) : null;
  } catch {
    return null;
  }
}

export function saveDraft(state: AdmissionState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* sem armazenamento disponível */
  }
}
