# Admissão de Funcionário — Departamento Pessoal

Módulo de cadastro e admissão de funcionários para um sistema de DP e folha de pagamento. O analista registra dados pessoais, documentos, contrato, dados bancários, benefícios e dependentes, e acompanha o processo até a conclusão.

> **Ambiente de demonstração.** Não há backend conectado: o cadastro fica salvo apenas na sessão do navegador (`sessionStorage`). Nada é enviado ao eSocial nem a outro sistema, e a tela deixa isso explícito para o usuário.

## Como rodar

Pré-requisito: Node.js 20 ou mais recente.

```bash
cd sistema-dp-admissao
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173). Para testar rápido, clique em **Preencher com dados fictícios**.

| Comando             | O que faz                         |
| ------------------- | --------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento       |
| `npm run build`     | Verifica tipos e gera `dist/`     |
| `npm run preview`   | Abre o build de produção          |
| `npm test`          | Testes de máscaras, validações e status |

## O que a tela faz

**Seis etapas** com indicador de progresso, navegação livre entre elas e marcação de etapa concluída ou com pendências:

1. **Dados pessoais**: identificação, contato e endereço, com busca de endereço pelo CEP (ViaCEP).
2. **Documentação**: RG, órgão emissor, PIS/NIT, título, reservista (quando aplicável), CNH (quando a função exige) e envio de arquivos PDF/JPG/PNG de até 5 MB. Cada arquivo aparece como pendente, recebido ou validado.
3. **Dados contratuais**: empresa, CNPJ, matrícula, cargo, setor, admissão, tipo de contrato (indeterminado, determinado ou experiência, com prazos legais), regime, jornada, horário, salário, carga semanal, centro de custo, sindicato e responsável.
4. **Bancários e benefícios**: conta para crédito do salário e situação de cada benefício (solicitado, aprovado ou dispensado), com opção de incluir outros.
5. **Dependentes**: inclusão e remoção de vários dependentes, com indicação para IRRF, salário-família e plano de saúde.
6. **Conferência**: lista de pendências, checklist manual e resumo de todos os dados por categoria (CPF e conta aparecem parcialmente ocultos).

**Validações**: campos obrigatórios destacados; máscaras de CPF, CNPJ, CEP, telefone, PIS e moeda; dígitos verificadores de CPF, CNPJ e PIS; idade mínima; salário mínimo proporcional à carga; limite de 44h semanais; prazo máximo de contrato determinado; CPF obrigatório para dependente de IRRF ou plano de saúde.

**Status do processo**, calculado a partir dos dados e das ações do usuário:

| Status                  | Quando                                                              |
| ----------------------- | ------------------------------------------------------------------- |
| Rascunho                | Cadastro em preenchimento                                           |
| Aguardando documentos   | Faltam arquivos obrigatórios                                        |
| Em conferência          | Enviado para conferência; falta validar documentos ou o checklist   |
| Pendente de correção    | Enviado, mas há campos inválidos                                    |
| Pronto para finalização | Sem pendências e com todo o checklist marcado pelo usuário          |
| Concluído               | Usuário confirmou a finalização (o cadastro fica bloqueado)         |

Nenhum item do checklist é marcado automaticamente, e a finalização pede confirmação avisando que nada é transmitido ao eSocial.

**Botões**: Salvar rascunho, Salvar e continuar, Voltar etapa, Avançar etapa, Visualizar cadastro, Enviar para conferência, Finalizar admissão e Cancelar cadastro (com confirmação).

## Estrutura

```
src/
  App.tsx                     Montagem da página
  types.ts                    Tipos do cadastro
  state/AdmissionContext.tsx  Estado, salvamento na sessão e ações
  lib/
    masks.ts                  Máscaras e formatação
    validators.ts             CPF, CNPJ, PIS, datas, horários
    validation.ts             Regras por etapa, pendências e status
    cep.ts                    Consulta de CEP
    storage.ts                Salvamento na sessão
  data/
    options.ts                Listas (UFs, bancos, empresas fictícias...)
    initial.ts                Cadastro vazio e dados fictícios
  components/
    layout/                   Menu lateral e barra superior
    steps/                    Uma tela por etapa
    ui/                       Campos, botões, cards, modal, avisos
```

## Próximos passos para virar aplicação completa

- Conectar a uma API para salvar e listar admissões.
- Armazenar os arquivos em um serviço de arquivos, não no navegador.
- Gerar os eventos S-2200 do eSocial a partir do cadastro conferido.
- Permissões por perfil (analista, conferente, gestor).

## Tecnologias

React 18, TypeScript, Tailwind CSS, ícones Lucide, Vite e Vitest.
