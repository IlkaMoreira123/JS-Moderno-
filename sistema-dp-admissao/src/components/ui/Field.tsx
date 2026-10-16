import { AlertCircle } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { Option } from "../../data/options";
import { cn } from "../../lib/cn";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  optionalNote?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** Rótulo + controle + dica/erro, com ligação acessível entre eles */
export function Field({ id, label, required, optionalNote, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex flex-wrap items-baseline gap-x-1.5 text-[13px] font-medium text-navy-900">
        {label}
        {required ? (
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        ) : (
          optionalNote && <span className="text-xs font-normal text-slate-500">{optionalNote}</span>
        )}
        {required && <span className="sr-only">(obrigatório)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-erro`} className="flex items-start gap-1 text-xs text-red-700" role="alert">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-dica`} className="text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

const controlBase =
  "w-full rounded-md border bg-white px-3 py-2 text-sm text-navy-950 shadow-sm outline-none transition " +
  "placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 " +
  "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-erro` : hint ? `${id}-dica` : undefined;

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; hint?: string; error?: string };

export function TextInput({ id, invalid, className, hint, error, ...rest }: InputProps & { id: string }) {
  const isInvalid = invalid ?? Boolean(error);
  return (
    <input
      id={id}
      name={id}
      aria-invalid={isInvalid || undefined}
      aria-describedby={describedBy(id, error, hint)}
      className={cn(controlBase, isInvalid ? "border-red-400 bg-red-50/40" : "border-slate-300", className)}
      {...rest}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  placeholder?: string;
  error?: string;
  hint?: string;
};

export function Select({ id, options, placeholder = "Selecione", error, hint, className, ...rest }: SelectProps & { id: string }) {
  return (
    <select
      id={id}
      name={id}
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={describedBy(id, error, hint)}
      className={cn(
        controlBase,
        "appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9",
        "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]",
        error ? "border-red-400 bg-red-50/40" : "border-slate-300",
        !rest.value && "text-slate-400",
        className,
      )}
      {...rest}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value} className="text-navy-950">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function TextArea({ id, className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string }) {
  return <textarea id={id} name={id} className={cn(controlBase, "min-h-[88px] border-slate-300", className)} {...rest} />;
}

interface CheckboxProps {
  id: string;
  label: ReactNode;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ id, label, description, checked, onChange, disabled }: CheckboxProps) {
  return (
    <div className="flex items-start gap-2.5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-navy-700 focus:ring-2 focus:ring-sky-300"
      />
      <label htmlFor={id} className="cursor-pointer text-sm leading-5 text-navy-900">
        {label}
        {description && <span className="block text-xs text-slate-500">{description}</span>}
      </label>
    </div>
  );
}
