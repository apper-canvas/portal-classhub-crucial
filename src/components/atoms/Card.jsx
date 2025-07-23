import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({
  className,
  variant = "default",
  ...props
}, ref) => {
  const variants = {
    default: "bg-white border border-gray-100 shadow-md hover:shadow-lg",
    elevated: "bg-white shadow-lg hover:shadow-xl",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-md hover:shadow-lg"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg transition-all duration-200 transform hover:-translate-y-1",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;