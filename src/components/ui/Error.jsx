import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  title = "Connection Problem",
  message = "We're having trouble connecting to our services. This could be due to network issues or server maintenance. Please check your internet connection and try again.",
  onRetry,
  className 
}) => {
  const isNetworkError = message?.toLowerCase().includes('network') || 
                        message?.toLowerCase().includes('connection') ||
                        message?.toLowerCase().includes('fetch') ||
                        message?.toLowerCase().includes('unavailable') ||
                        message?.toLowerCase().includes('timeout');

  const displayTitle = isNetworkError ? "Network Connection Issue" : title;
  const displayMessage = isNetworkError ? 
    "Unable to connect to the server. Please check your internet connection and try again. If the problem persists, the service may be temporarily unavailable." : 
    message;

  return (
    <Card className={cn("p-8 text-center max-w-md mx-auto", className)}>
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center mb-4">
          <ApperIcon name={isNetworkError ? "WifiOff" : "AlertTriangle"} className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-xl font-semibold text-primary-900 mb-2">{displayTitle}</h3>
        <p className="text-secondary-400 leading-relaxed">{displayMessage}</p>
        
        {isNetworkError && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              💡 <strong>Troubleshooting:</strong> Check your WiFi connection, refresh the page, or try again in a few moments.
            </p>
          </div>
        )}
      </div>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          icon="RefreshCw"
          className="mx-auto"
        >
          {isNetworkError ? 'Check Connection & Retry' : 'Try Again'}
        </Button>
      )}
    </Card>
  );
};

export default Error;