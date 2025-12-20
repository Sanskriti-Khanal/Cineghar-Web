import { forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface FormInputProps {
  label: string;
  type?: string;
  error?: FieldError;
  placeholder?: string;
  name?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, name, type = "text", error, placeholder, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          ref={ref}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
