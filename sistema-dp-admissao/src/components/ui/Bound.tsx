import type { InputHTMLAttributes } from "react";
import { useAdmission } from "../../state/AdmissionContext";
import type { Option } from "../../data/options";
import { Field, Select, TextInput } from "./Field";

/** id de DOM a partir da chave do campo (ex.: "pessoais.cpf" → "pessoais-cpf") */
export const fieldId = (key: string) => key.replace(/\./g, "-");

interface BoundInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id"> {
  name: string;
  label: string;
  value: string;
  onValue: (v: string) => void;
  mask?: (v: string) => string;
  required?: boolean;
  optionalNote?: string;
  hint?: string;
  className?: string;
}

/** Campo de texto ligado à validação: mostra erro depois de tocado */
export function BoundInput({ name, label, value, onValue, mask, required, optionalNote, hint, className, ...rest }: BoundInputProps) {
  const { errorFor, touch } = useAdmission();
  const id = fieldId(name);
  const error = errorFor(name);
  return (
    <Field id={id} label={label} required={required} optionalNote={optionalNote} hint={hint} error={error} className={className}>
      <TextInput
        id={id}
        value={value}
        error={error}
        hint={hint}
        required={required}
        onChange={(e) => onValue(mask ? mask(e.target.value) : e.target.value)}
        onBlur={() => touch(name)}
        {...rest}
      />
    </Field>
  );
}

interface BoundSelectProps {
  name: string;
  label: string;
  value: string;
  onValue: (v: string) => void;
  options: Option[];
  required?: boolean;
  optionalNote?: string;
  hint?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function BoundSelect({ name, label, value, onValue, options, required, optionalNote, hint, placeholder, className, disabled }: BoundSelectProps) {
  const { errorFor, touch } = useAdmission();
  const id = fieldId(name);
  const error = errorFor(name);
  return (
    <Field id={id} label={label} required={required} optionalNote={optionalNote} hint={hint} error={error} className={className}>
      <Select
        id={id}
        value={value}
        options={options}
        placeholder={placeholder}
        error={error}
        hint={hint}
        required={required}
        disabled={disabled}
        onChange={(e) => {
          onValue(e.target.value);
          touch(name);
        }}
        onBlur={() => touch(name)}
      />
    </Field>
  );
}
