import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  title = "Connection Problem",
  message = "We're having trouble connecting to our services. Please check your internet connection and try again.",
  onRetry,
  className 
}) => {
  return (
    <Card className={cn("p-8 text-center max-w-md mx-auto", className)}>
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center mb-4">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-xl font-semibold text-primary-900 mb-2">{title}</h3>
        <p className="text-secondary-400">{message}</p>
      </div>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          icon="RefreshCw"
          className="mx-auto"
        >
          Try Again
        </Button>
      )}
    </Card>
  );
};

export default Error;