import { Bell, ChevronDown, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { USUARIO_LOGADO } from "../../data/options";
import { cn } from "../../lib/cn";

const NOTIFICACOES = [
  { id: 1, texto: "ASO de Rafael Moura vence em 5 dias", tempo: "há 2 h" },
  { id: 2, texto: "Admissão de Bianca Lopes aguardando documentos", tempo: "ontem" },
  { id: 3, texto: "Fechamento da folha de outubro em 10 dias", tempo: "ontem" },
];

export function TopBar({ onMenu, menuOpen }: { onMenu: () => void; menuOpen: boolean }) {
  const [openNotif, setOpenNotif] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openNotif) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpenNotif(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [openNotif]);

  return (
    <div className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="rounded-md p-2 text-navy-800 hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          aria-controls="menu-lateral"
        >
          <Menu className="h-5 w-5" />
        </button>
        <nav aria-label="Trilha de navegação" className="hidden text-[13px] text-slate-500 sm:block">
          <ol className="flex items-center gap-1.5">
            <li>Admissões</li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-navy-900" aria-current="page">
              Nova admissão
            </li>
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpenNotif((v) => !v)}
            className="relative rounded-md p-2 text-navy-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            aria-label={`Notificações (${NOTIFICACOES.length} novas)`}
            aria-expanded={openNotif}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true" />
          </button>
          <div
            className={cn(
              "absolute right-0 top-full mt-2 w-[min(320px,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white shadow-lg",
              !openNotif && "hidden",
            )}
          >
            <p className="border-b border-slate-100 px-4 py-2.5 text-[13px] font-semibold text-navy-900">Notificações</p>
            <ul>
              {NOTIFICACOES.map((n) => (
                <li key={n.id} className="border-b border-slate-50 px-4 py-2.5 last:border-0">
                  <p className="text-[13px] text-navy-900">{n.texto}</p>
                  <p className="text-[11px] text-slate-500">{n.tempo}</p>
                </li>
              ))}
            </ul>
            <p className="px-4 py-2 text-[11px] text-slate-400">Exemplos para demonstração</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-2 sm:pl-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-100 text-xs font-semibold text-navy-800" aria-hidden="true">
            {USUARIO_LOGADO.iniciais}
          </span>
          <div className="hidden leading-tight md:block">
            <p className="text-[13px] font-semibold text-navy-900">{USUARIO_LOGADO.nome}</p>
            <p className="text-[11px] text-slate-500">{USUARIO_LOGADO.cargo}</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
