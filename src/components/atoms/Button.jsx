import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = React.forwardRef(({
  className,
  variant = "primary",
  size = "md",
  children,
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    secondary: "bg-gradient-to-r from-secondary-400 to-secondary-500 text-white hover:from-secondary-500 hover:to-secondary-600 focus:ring-secondary-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500 hover:shadow-md transform hover:-translate-y-0.5",
    ghost: "text-primary-600 hover:bg-primary-50 focus:ring-primary-500 hover:shadow-sm",
    danger: "bg-gradient-to-r from-error to-red-700 text-white hover:from-red-600 hover:to-red-800 focus:ring-error shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-md",
    lg: "px-6 py-3 text-lg rounded-lg",
    xl: "px-8 py-4 text-xl rounded-lg"
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;