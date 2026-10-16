import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { cn, uid } from "../../lib/cn";

export type ToastKind = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  kind: ToastKind;
  title: string;
  message?: string;
}

const ToastCtx = createContext<(kind: ToastKind, title: string, message?: string) => void>(() => {});

export const useToast = () => useContext(ToastCtx);

const STYLE = {
  success: { Icon: CheckCircle2, cls: "border-emerald-200 text-emerald-800", icon: "text-emerald-600" },
  error: { Icon: XCircle, cls: "border-red-200 text-red-800", icon: "text-red-600" },
  warning: { Icon: AlertTriangle, cls: "border-amber-200 text-amber-900", icon: "text-amber-600" },
  info: { Icon: Info, cls: "border-sky-200 text-navy-900", icon: "text-sky-600" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (kind: ToastKind, title: string, message?: string) => {
      const id = uid();
      setItems((list) => [...list.slice(-3), { id, kind, title, message }]);
      setTimeout(() => dismiss(id), kind === "error" || kind === "warning" ? 7000 : 4500);
    },
    [dismiss],
  );

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2"
        aria-live="polite"
        role="status"
      >
        {items.map((t) => {
          const { Icon, cls, icon } = STYLE[t.kind];
          return (
            <div key={t.id} className={cn("pointer-events-auto flex items-start gap-3 rounded-lg border bg-white p-3.5 shadow-lg", cls)}>
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", icon)} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t.title}</p>
                {t.message && <p className="mt-0.5 text-[13px] text-slate-600">{t.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="rounded p-0.5 text-slate-400 hover:text-slate-700"
                aria-label="Fechar aviso"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
