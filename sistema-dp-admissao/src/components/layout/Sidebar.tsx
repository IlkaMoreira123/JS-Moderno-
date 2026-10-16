import {
  BarChart3,
  Building2,
  CalendarDays,
  FileSpreadsheet,
  LayoutDashboard,
  Receipt,
  Settings,
  UserMinus,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "../../lib/cn";

const ITEMS = [
  { label: "Dashboard", Icon: LayoutDashboard },
  { label: "Empresas", Icon: Building2 },
  { label: "Funcionários", Icon: Users },
  { label: "Admissões", Icon: UserPlus, active: true },
  { label: "Férias", Icon: CalendarDays },
  { label: "Rescisões", Icon: UserMinus },
  { label: "Folha de pagamento", Icon: Wallet },
  { label: "Guias trabalhistas", Icon: Receipt },
  { label: "Relatórios", Icon: BarChart3 },
  { label: "Configurações", Icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Fundo escurecido no celular/tablet quando o menu está aberto */}
      <div
        className={cn("fixed inset-0 z-30 bg-navy-950/40 transition-opacity lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="menu-lateral"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-900 text-navy-100 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Menu principal"
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-white/10 px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-sky-400/15 font-mono text-sm font-semibold text-sky-300" aria-hidden="true">
              DP
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">Gestão DP</p>
              <p className="text-[11px] text-navy-300">Departamento Pessoal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-navy-200 hover:bg-white/10 lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {ITEMS.map(({ label, Icon, active }) => (
              <li key={label}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
                    active ? "bg-white/10 font-semibold text-white" : "text-navy-200 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {active && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r bg-sky-300" aria-hidden="true" />}
                  <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-sky-300" : "text-navy-300 group-hover:text-white")} aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-5 py-4 text-[11px] leading-relaxed text-navy-300">
          Ambiente de demonstração
          <br />
          Dados salvos apenas neste navegador
        </div>
      </aside>
    </>
  );
}
