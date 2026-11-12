import { cloneElement, forwardRef, isValidElement, useId, type InputHTMLAttributes, type ReactElement, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/* --------------------------------------------------------------------------
   Form fields: label above, 48 px control (r 12, hairline ring, brand focus
   ring), hint or error below. Text is 17 px, so iOS never zooms into a field.
   -------------------------------------------------------------------------- */

interface FieldProps {
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  /** exactly one TextInput / TextArea / select */
  children: ReactElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean; required?: boolean }>;
  className?: string;
}

export function Field({ label, required = false, hint, error, children, className }: FieldProps) {
  const auto = useId();
  const id = (isValidElement(children) && children.props.id) || auto;
  const noteId = `${id}-note`;
  const control = cloneElement(children, {
    id,
    required: required || children.props.required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": hint || error ? noteId : undefined,
  });

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-label text-ink">
        {label}
        {required ? (
          <span className="text-ink-3" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {control}
      {error ? (
        <p id={noteId} role="alert" className="text-caption text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={noteId} className="text-caption text-ink-2">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function TextInput({ className, ...props }, ref) {
  return <input ref={ref} className={cn("lg-input", className)} {...props} />;
});

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea({ className, rows = 4, ...props }, ref) {
  return <textarea ref={ref} rows={rows} className={cn("lg-input lg-input--area", className)} {...props} />;
});
