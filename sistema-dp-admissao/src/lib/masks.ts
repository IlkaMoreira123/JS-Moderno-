export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function maskCPF(value: string) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCNPJ(value: string) {
  return onlyDigits(value)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function maskCEP(value: string) {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function maskPhone(value: string) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskPIS(value: string) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{5})(\d)/, "$1.$2.$3")
    .replace(/(\d{5})\.(\d{2})(\d)$/, "$1.$2-$3");
}

/** Moeda em reais: digita só números e o valor vai sendo formatado (ex.: 352000 → 3.520,00) */
export function maskCurrency(value: string) {
  const d = onlyDigits(value).replace(/^0+/, "").slice(0, 11);
  if (!d) return "";
  const cents = d.padStart(3, "0");
  const int = cents.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${int},${cents.slice(-2)}`;
}

export function currencyToNumber(value: string) {
  if (!value) return 0;
  return Number(value.replace(/\./g, "").replace(",", "."));
}

export function formatBRL(value: string) {
  return value ? `R$ ${value}` : "";
}

/** Oculta parte do CPF em telas de resumo (dado sensível) */
export function hideCPF(value: string) {
  const d = onlyDigits(value);
  if (d.length !== 11) return value;
  return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
}

export function hideAccount(value: string) {
  const d = value.replace(/\s/g, "");
  if (d.length <= 3) return d;
  return `${"•".repeat(Math.max(0, d.length - 3))}${d.slice(-3)}`;
}

export function formatDateBR(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function formatDateTimeBR(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}
