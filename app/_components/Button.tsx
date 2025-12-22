import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "google";
  isLoading?: boolean;
}

const Button = ({ 
  children, 
  variant = "primary", 
  isLoading = false,
  className = "",
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = "w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-[#8B0000] text-white hover:bg-[#6B0000]",
    secondary: "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50",
    google: "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-3",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;

