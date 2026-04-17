import { forwardRef, InputHTMLAttributes, ReactNode, useId } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, rightIcon, id, className = "", ...props },
  ref
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy =
    [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-md border bg-paper py-2 text-text-primary placeholder:text-text-muted outline-none transition focus:ring-1 ${
            leftIcon ? "pl-10" : "pl-3"
          } ${rightIcon ? "pr-10" : "pr-3"} ${
            error
              ? "border-error focus:ring-error/30"
              : "border-border-default focus:border-primary focus:ring-primary/30"
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <span id={errorId} className="text-xs text-error">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="text-xs text-text-secondary">
          {hint}
        </span>
      ) : null}
    </div>
  );
});