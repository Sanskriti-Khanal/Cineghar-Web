import { forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, name, error, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          id={name}
          type="checkbox"
          ref={ref}
          className="w-4 h-4 text-[#8B0000] border-gray-300 rounded focus:ring-[#8B0000] focus:ring-2"
          {...props}
        />
        <label
          htmlFor={name}
          className="ml-2 text-sm text-gray-700"
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-sm text-red-600 ml-2">{error.message}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;

