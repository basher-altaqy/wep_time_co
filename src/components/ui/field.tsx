import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "block w-full rounded-md border border-border bg-surface px-3 py-2 text-ink placeholder:text-ink-subtle " +
  "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 " +
  "disabled:cursor-not-allowed disabled:opacity-60 transition-colors";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        fieldBase,
        "h-10",
        error && "border-danger focus:border-danger focus:ring-danger/30",
        className
      )}
      {...rest}
    />
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, error, rows = 4, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          fieldBase,
          "resize-y leading-relaxed",
          error && "border-danger focus:border-danger focus:ring-danger/30",
          className
        )}
        {...rest}
      />
    );
  }
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, error, children, ...rest },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        fieldBase,
        "h-10 cursor-pointer",
        error && "border-danger focus:border-danger focus:ring-danger/30",
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
});

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ required, children, className, ...rest }: LabelProps) {
  return (
    <label
      className={cn("block text-sm font-medium text-ink mb-1.5", className)}
      {...rest}
    >
      {children}
      {required ? <span className="text-danger ms-1">*</span> : null}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-danger">{message}</p>;
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-sm text-ink-subtle">{children}</p>;
}
