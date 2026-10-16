import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";

const variants: Record<Variant, string> = {
  primary: "bg-navy-800 text-white hover:bg-navy-700 shadow-sm",
  secondary: "border border-slate-300 bg-white text-navy-800 hover:bg-slate-50 hover:border-slate-400 shadow-sm",
  ghost: "text-navy-700 hover:bg-navy-50",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50 hover:border-red-300",
  success: "bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({ variant = "secondary", size = "md", icon, iconRight, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-sm",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
