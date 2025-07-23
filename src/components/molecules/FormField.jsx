import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = React.forwardRef(({
  label,
  error,
  helperText,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={props.id}>
          {label}
        </Label>
      )}
      {children || <Input ref={ref} error={error} {...props} />}
      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-secondary-400">{helperText}</p>
      )}
    </div>
  );
});

FormField.displayName = "FormField";

export default FormField;