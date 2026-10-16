import { ArrowLeft, ArrowRight, CheckCheck, Eye, Save, Send, XCircle } from "lucide-react";
import { useState } from "react";
import { useAdmission } from "../state/AdmissionContext";
import { STEPS, requiredDocsMissing } from "../lib/validation";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { useToast } from "./ui/Toast";
import { AdmissionSummary } from "./AdmissionSummary";
import { fieldId } from "./ui/Bound";

export function ActionBar() {
  const adm = useAdmission();
  const { state, stepId, errorsByStep, status, data } = adm;
  const toast = useToast();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [preview, setPreview] = useState(false);

  const isLast = state.currentStep === STEPS.length - 1;
  const finished = Boolean(state.finishedAt);

  function focusFirstError(step: typeof stepId) {
    const first = Object.keys(errorsByStep[step])[0];
    if (!first) return;
    setTimeout(() => {
      const el = document.getElementById(fieldId(first));
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
    }, 60);
  }

  function saveDraft() {
    const ok = adm.saveNow();
    if (ok) toast("success", "Rascunho salvo", "Os dados ficam guardados nesta sessão do navegador.");
    else toast("error", "Não foi possível salvar", "O navegador bloqueou o armazenamento. Verifique se está em janela anônima.");
  }

  function saveAndContinue() {
    const errors = errorsByStep[stepId];
    const count = Object.keys(errors).length;
    adm.markAttempted(stepId);
    if (count > 0) {
      adm.unconfirmStep(stepId);
      toast("error", `Corrija ${count} ${count === 1 ? "campo" : "campos"} para continuar`, "Os campos com problema estão destacados em vermelho.");
      focusFirstError(stepId);
      return;
    }
    adm.confirmStep(stepId);
    adm.saveNow();
    if (stepId === "documentos" && requiredDocsMissing(data)) {
      toast("warning", "Etapa salva — aguardando documentos", "Ainda faltam arquivos obrigatórios. O cadastro ficou como “Aguardando documentos”.");
    } else {
      toast("success", `${STEPS[state.currentStep].title}: salvo`, "Etapa conferida e salva.");
    }
    adm.goTo(state.currentStep + 1);
  }

  function sendToReview() {
    const totalErrors = Object.values(errorsByStep).reduce((a, e) => a + Object.keys(e).length, 0);
    adm.sendToReview();
    adm.saveNow();
    if (totalErrors > 0) {
      toast("warning", "Enviado com pendências", `${totalErrors} ${totalErrors === 1 ? "campo precisa" : "campos precisam"} de correção. Veja a lista de pendências.`);
    } else if (requiredDocsMissing(data)) {
      toast("warning", "Enviado — aguardando documentos", "Faltam arquivos obrigatórios para concluir a conferência.");
    } else {
      toast("success", "Enviado para conferência", "Valide os documentos e marque o checklist para finalizar.");
    }
  }

  function finish() {
    adm.finish();
    setConfirmFinish(false);
    toast("success", "Admissão finalizada neste sistema", "Lembre-se: nada foi transmitido ao eSocial.");
  }

  return (
    <>
      <div className="z-10 -mx-4 mb-0 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 md:sticky md:bottom-0 md:py-3 lg:-mx-8 lg:px-8">
        <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {!finished && (
              <Button variant="danger" icon={<XCircle className="h-4 w-4" />} onClick={() => setConfirmCancel(true)}>
                Cancelar cadastro
              </Button>
            )}
            <Button variant="ghost" icon={<Eye className="h-4 w-4" />} onClick={() => setPreview(true)}>
              Visualizar cadastro
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            {!finished && (
              <Button variant="secondary" icon={<Save className="h-4 w-4" />} onClick={saveDraft}>
                Salvar rascunho
              </Button>
            )}
            <Button variant="secondary" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => adm.goTo(state.currentStep - 1)} disabled={state.currentStep === 0}>
              Voltar etapa
            </Button>
            {!isLast ? (
              <>
                <Button variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />} onClick={() => adm.goTo(state.currentStep + 1)}>
                  Avançar etapa
                </Button>
                {!finished && (
                  <Button variant="primary" iconRight={<ArrowRight className="h-4 w-4" />} onClick={saveAndContinue}>
                    Salvar e continuar
                  </Button>
                )}
              </>
            ) : (
              !finished && (
                <>
                  <Button
                    variant={state.sentToReviewAt ? "secondary" : "primary"}
                    icon={<Send className="h-4 w-4" />}
                    onClick={sendToReview}
                    title={state.sentToReviewAt ? "Reenviar após correções" : undefined}
                  >
                    {state.sentToReviewAt ? "Reenviar para conferência" : "Enviar para conferência"}
                  </Button>
                  <Button
                    variant="success"
                    icon={<CheckCheck className="h-4 w-4" />}
                    onClick={() => setConfirmFinish(true)}
                    disabled={status !== "pronto_finalizacao"}
                    title={status !== "pronto_finalizacao" ? "Disponível quando não houver pendências e o checklist estiver completo" : undefined}
                  >
                    Finalizar admissão
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </div>

      <Modal
        open={confirmCancel}
        title="Cancelar este cadastro?"
        description="Todos os dados preenchidos e os arquivos anexados nesta admissão serão descartados. Essa ação não pode ser desfeita."
        onClose={() => setConfirmCancel(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmCancel(false)}>
              Continuar preenchendo
            </Button>
            <Button
              variant="danger"
              icon={<XCircle className="h-4 w-4" />}
              onClick={() => {
                adm.reset();
                setConfirmCancel(false);
                toast("info", "Cadastro cancelado", "Os dados foram descartados.");
              }}
            >
              Cancelar cadastro
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">Se quiser continuar depois, use “Salvar rascunho” em vez de cancelar.</p>
      </Modal>

      <Modal
        open={confirmFinish}
        title="Finalizar admissão?"
        description="Confirme que todos os dados e documentos foram conferidos."
        onClose={() => setConfirmFinish(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmFinish(false)}>
              Revisar mais
            </Button>
            <Button variant="success" icon={<CheckCheck className="h-4 w-4" />} onClick={finish}>
              Confirmar finalização
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3 text-sm text-slate-700">
          <p>
            <strong className="text-navy-950">{data.pessoais.nomeCompleto}</strong> será registrada como admitida neste sistema, com início em{" "}
            {data.contrato.dataAdmissao.split("-").reverse().join("/")}.
          </p>
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
            Este é um ambiente de demonstração sem integração: a admissão <strong>não</strong> será enviada ao eSocial nem a nenhum sistema externo. Depois de
            finalizado, o cadastro fica bloqueado para edição.
          </p>
        </div>
      </Modal>

      <Modal open={preview} size="lg" title="Visualizar cadastro" description="Dados preenchidos até agora." onClose={() => setPreview(false)}>
        <AdmissionSummary data={data} />
      </Modal>
    </>
  );
}
