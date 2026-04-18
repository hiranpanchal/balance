import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";

const labelCls =
  "block text-[11px] leading-[14px] tracking-[0.22em] uppercase text-gold mb-2";
const helpCls = "mt-2 text-[13px] text-stone";
const errorCls = "mt-2 text-[13px] text-error";
const inputCls =
  "w-full rounded-sm border border-stone bg-cream-light px-4 py-3 text-[15px] text-teal placeholder:text-stone/70 focus:outline-none focus:border-gold focus:ring-0 focus:border-2 focus:py-[11px] transition-colors";

type FieldWrap = {
  label: string;
  htmlFor?: string;
  help?: string;
  error?: string;
  children: ReactNode;
};

export function FieldWrap({ label, htmlFor, help, error, children }: FieldWrap) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
      </label>
      {children}
      {help && !error && <p className={helpCls}>{help}</p>}
      {error && (
        <p role="alert" className={errorCls}>
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = {
  label: string;
  help?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, help, error, id, className = "", ...rest }, ref) {
    const autoId = id || `f-${label.replace(/\s+/g, "-").toLowerCase()}`;
    return (
      <FieldWrap label={label} htmlFor={autoId} help={help} error={error}>
        <input
          ref={ref}
          id={autoId}
          aria-invalid={Boolean(error) || undefined}
          className={`${inputCls} ${className}`}
          {...rest}
        />
      </FieldWrap>
    );
  },
);

type TextAreaProps = {
  label: string;
  help?: string;
  error?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextAreaField({ label, help, error, id, className = "", ...rest }, ref) {
    const autoId = id || `f-${label.replace(/\s+/g, "-").toLowerCase()}`;
    return (
      <FieldWrap label={label} htmlFor={autoId} help={help} error={error}>
        <textarea
          ref={ref}
          id={autoId}
          aria-invalid={Boolean(error) || undefined}
          className={`${inputCls} min-h-[120px] resize-y ${className}`}
          {...rest}
        />
      </FieldWrap>
    );
  },
);
