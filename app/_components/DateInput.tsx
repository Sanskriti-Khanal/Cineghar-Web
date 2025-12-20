import { forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface DateInputProps {
  label: string;
  name?: string;
  error?: FieldError;
  placeholder?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, name, error, placeholder, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <input
            id={name}
            name={name}
            type="date"
            ref={ref}
            placeholder={placeholder}
            className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;
