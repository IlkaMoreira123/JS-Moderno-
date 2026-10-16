import { CheckCircle2, FlaskConical, Wand2 } from "lucide-react";
import { useState } from "react";
import { AdmissionProvider, useAdmission } from "./state/AdmissionContext";
import { STEPS } from "./lib/validation";
import { formatDateTimeBR } from "./lib/masks";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { PageHeader } from "./components/PageHeader";
import { Stepper } from "./components/Stepper";
import { ActionBar } from "./components/ActionBar";
import { Button } from "./components/ui/Button";
import { ToastProvider, useToast } from "./components/ui/Toast";
import { PersonalStep } from "./components/steps/PersonalStep";
import { DocumentsStep } from "./components/steps/DocumentsStep";
import { ContractStep } from "./components/steps/ContractStep";
import { BankBenefitsStep } from "./components/steps/BankBenefitsStep";
import { DependentsStep } from "./components/steps/DependentsStep";
import { ReviewStep } from "./components/steps/ReviewStep";

const STEP_COMPONENTS = [PersonalStep, DocumentsStep, ContractStep, BankBenefitsStep, DependentsStep, ReviewStep];

function DemoNotice() {
  const { loadDemo, state } = useAdmission();
  const toast = useToast();
  const vazio = !state.data.pessoais.nomeCompleto && !state.data.contrato.cargo;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2.5 text-[13px] text-navy-900">
        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" aria-hidden="true" />
        <span>
          <strong className="font-semibold">Ambiente de demonstração.</strong> O cadastro fica salvo apenas nesta sessão do navegador e não é enviado a
          nenhum sistema real nem ao eSocial.
        </span>
      </p>
      {vazio && !state.finishedAt && (
        <Button
          size="sm"
          variant="secondary"
          icon={<Wand2 className="h-3.5 w-3.5" />}
          className="shrink-0"
          onClick={() => {
            loadDemo();
            toast("info", "Dados fictícios carregados", "Use para testar o fluxo. Os arquivos ainda precisam ser anexados.");
          }}
        >
          Preencher com dados fictícios
        </Button>
      )}
    </div>
  );
}

function FinishedBanner() {
  const { state, data, reset } = useAdmission();
  if (!state.finishedAt) return null;
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-emerald-900">Admissão de {data.pessoais.nomeCompleto} finalizada neste sistema</p>
          <p className="text-[13px] text-emerald-800">
            Registrada em {formatDateTimeBR(state.finishedAt)} · protocolo interno {state.protocolo}. O envio ao eSocial ainda precisa ser feito pelo
            canal oficial.
          </p>
        </div>
      </div>
      <Button variant="secondary" size="sm" className="shrink-0" onClick={reset}>
        Iniciar nova admissão
      </Button>
    </div>
  );
}

function AdmissionPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { state } = useAdmission();
  const toast = useToast();
  const Step = STEP_COMPONENTS[state.currentStep];
  const step = STEPS[state.currentStep];

  return (
    <div className="min-h-screen bg-slate-50">
      <a href="#conteudo" className="sr-only z-50 rounded bg-navy-900 px-3 py-2 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Pular para o formulário
      </a>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <TopBar onMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
        <main id="conteudo" className="mx-auto flex max-w-6xl flex-col gap-5 px-4 pt-6 sm:px-6 lg:px-8">
          <PageHeader
            onBack={() =>
              toast("info", "Lista de admissões", "A listagem não faz parte desta demonstração. Seu rascunho continua salvo nesta sessão.")
            }
          />
          <DemoNotice />
          <FinishedBanner />
          <Stepper />

          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs uppercase tracking-wider text-sky-700">
              Etapa {state.currentStep + 1} de {STEPS.length}
            </p>
            <h2 className="text-lg font-semibold text-navy-950">{step.title}</h2>
            <p className="text-[13px] text-slate-500">
              Campos com <span className="text-red-600">*</span> são obrigatórios.
            </p>
          </div>

          <fieldset disabled={Boolean(state.finishedAt)} className="min-w-0">
            <legend className="sr-only">{step.title}</legend>
            <Step />
          </fieldset>

          <ActionBar />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AdmissionProvider>
        <AdmissionPage />
      </AdmissionProvider>
    </ToastProvider>
  );
}
