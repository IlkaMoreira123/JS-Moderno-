import { onlyDigits } from "./masks";

export interface CepResult {
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
}

/**
 * Consulta pública de CEP (ViaCEP). É a única chamada externa da tela e serve
 * apenas para preencher o endereço; nenhum dado do colaborador é enviado.
 */
export async function lookupCep(cep: string): Promise<CepResult> {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) throw new Error("Digite os 8 números do CEP.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    let data: Record<string, string> & { erro?: unknown };
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: controller.signal });
      if (!res.ok) throw new Error("http");
      data = await res.json();
    } catch {
      throw new Error("Não foi possível consultar o CEP agora. Preencha o endereço manualmente.");
    }
    if (data.erro) throw new Error("CEP não encontrado. Preencha o endereço manualmente.");
    return { endereco: data.logradouro ?? "", bairro: data.bairro ?? "", cidade: data.localidade ?? "", uf: data.uf ?? "" };
  } finally {
    clearTimeout(timer);
  }
}
