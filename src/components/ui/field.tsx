import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/cn";

const fieldBase =
  "w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none disabled:bg-stone-100 disabled:text-stone-500 aria-invalid:border-rose-400 aria-invalid:focus:border-rose-500 aria-invalid:focus:ring-rose-500/10";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

function FieldWrapper({
  label,
  error,
  hint,
  required,
  htmlFor,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1 text-xs font-semibold text-stone-600"
        >
          {label}
          {required ? <span className="text-rose-500">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="text-xs font-medium text-rose-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, required, className, wrapperClassName, id, ...props },
    ref,
  ) => (
    <FieldWrapper
      label={label}
      error={error}
      hint={hint}
      required={required}
      htmlFor={id}
      className={wrapperClassName}
    >
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(fieldBase, className)}
        {...props}
      />
    </FieldWrapper>
  ),
);

Input.displayName = "Input";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, hint, required, className, wrapperClassName, id, ...props },
    ref,
  ) => (
    <FieldWrapper
      label={label}
      error={error}
      hint={hint}
      required={required}
      htmlFor={id}
      className={wrapperClassName}
    >
      <textarea
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(fieldBase, "min-h-24 resize-y", className)}
        {...props}
      />
    </FieldWrapper>
  ),
);

Textarea.displayName = "Textarea";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      required,
      className,
      wrapperClassName,
      id,
      options,
      placeholder,
      ...props
    },
    ref,
  ) => (
    <FieldWrapper
      label={label}
      error={error}
      hint={hint}
      required={required}
      htmlFor={id}
      className={wrapperClassName}
    >
      <select
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(fieldBase, "appearance-none bg-white pe-9", className)}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  ),
);

Select.displayName = "Select";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id, ...props }, ref) => (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 text-sm text-stone-600"
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-stone-300 text-brand-700 accent-brand-700",
          className,
        )}
        {...props}
      />
      {label}
    </label>
  ),
);

Checkbox.displayName = "Checkbox";
