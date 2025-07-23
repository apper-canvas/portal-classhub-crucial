import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({
  className,
  variant = "default",
  ...props
}, ref) => {
  const variants = {
    default: "bg-primary-100 text-primary-800 border-primary-200",
    success: "bg-gradient-to-r from-success to-accent-600 text-white shadow-sm",
    warning: "bg-gradient-to-r from-warning to-orange-500 text-white shadow-sm",
    error: "bg-gradient-to-r from-error to-red-700 text-white shadow-sm",
    info: "bg-gradient-to-r from-info to-blue-600 text-white shadow-sm",
    secondary: "bg-secondary-100 text-secondary-800 border-secondary-200"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;