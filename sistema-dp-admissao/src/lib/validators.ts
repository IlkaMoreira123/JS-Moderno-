import { onlyDigits } from "./masks";

export function isValidCPF(value: string) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return calc(9) === Number(cpf[9]) && calc(10) === Number(cpf[10]);
}

export function isValidCNPJ(value: string) {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const calc = (len: number) => {
    const weights = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((acc, w, i) => acc + Number(cnpj[i]) * w, 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  return calc(12) === Number(cnpj[12]) && calc(13) === Number(cnpj[13]);
}

export function isValidPIS(value: string) {
  const pis = onlyDigits(value);
  if (pis.length !== 11 || /^(\d)\1{10}$/.test(pis)) return false;
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((acc, w, i) => acc + Number(pis[i]) * w, 0);
  const rest = 11 - (sum % 11);
  const digit = rest === 10 || rest === 11 ? 0 : rest;
  return digit === Number(pis[10]);
}

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const isValidPhone = (value: string) => {
  const d = onlyDigits(value);
  return d.length === 10 || d.length === 11;
};

export const isValidCEP = (value: string) => onlyDigits(value).length === 8;

/** Idade completa em anos numa data de referência (padrão: hoje) */
export function ageAt(birthIso: string, refIso?: string) {
  const birth = new Date(`${birthIso}T00:00:00`);
  const ref = refIso ? new Date(`${refIso}T00:00:00`) : new Date();
  let age = ref.getFullYear() - birth.getFullYear();
  const m = ref.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < birth.getDate())) age--;
  return age;
}

export function isValidDate(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(`${iso}T00:00:00`);
  return !Number.isNaN(d.getTime());
}

export function daysBetween(startIso: string, endIso: string) {
  const a = new Date(`${startIso}T00:00:00`).getTime();
  const b = new Date(`${endIso}T00:00:00`).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** Minutos entre dois horários "HH:MM" (considera virada do dia) */
export function minutesBetween(start: string, end: string) {
  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = end.split(":").map(Number);
  let diff = h2 * 60 + m2 - (h1 * 60 + m1);
  if (diff < 0) diff += 24 * 60;
  return diff;
}
