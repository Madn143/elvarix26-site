import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, ...props }: FieldProps) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
        {label}
        {props.required && <span className="text-copper-light"> *</span>}
      </span>
      <input
        {...props}
        className={`mt-2 w-full rounded-sm border bg-black/30 px-4 py-3 text-sm text-parchment placeholder:text-muted/50 focus:border-gold focus:outline-none ${
          error ? "border-red-800" : "border-white/10"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export function SelectField({ label, error, options, placeholder, ...props }: SelectProps) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
        {label}
        {props.required && <span className="text-copper-light"> *</span>}
      </span>
      <select
        {...props}
        className={`mt-2 w-full rounded-sm border bg-black/30 px-4 py-3 text-sm text-parchment focus:border-gold focus:outline-none ${
          error ? "border-red-800" : "border-white/10"
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

interface OptionGroupProps {
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  name?: string;
}

/**
 * A glassmorphism button-group selector — used anywhere a small, fixed set
 * of mutually-exclusive options (Gender, Year, Veg/Non-Veg, etc.) needs a
 * clearer, more premium selected/unselected state than a native <select> or
 * plain radio input.
 */
export function OptionGroupField({ label, required, error, value, onChange, options, name }: OptionGroupProps) {
  return (
    <div role="radiogroup" aria-label={label}>
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
        {label}
        {required && <span className="text-copper-light"> *</span>}
      </span>
      <div className="mt-2.5 flex flex-wrap gap-2.5">
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              name={name}
              onClick={() => onChange(o.value)}
              className={`rounded-full border px-5 py-2.5 text-sm backdrop-blur-md transition-all duration-200 ease-out active:scale-95 ${
                selected
                  ? "border-gold/80 bg-gold/15 text-gold shadow-[0_0_18px_-4px_rgba(212,175,55,0.65)]"
                  : "border-white/15 bg-white/[0.06] text-parchment/75 hover:border-copper-light/60 hover:bg-white/[0.1] hover:text-parchment"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {error && <span className="mt-1.5 block text-xs text-red-400">{error}</span>}
    </div>
  );
}
