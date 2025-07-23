import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({
  title = "No data found",
  message = "There's nothing here yet. Get started by adding some data.",
  icon = "Database",
  actionLabel = "Get Started",
  onAction,
  className
}) => {
  return (
    <Card className={cn("p-12 text-center", className)} variant="gradient">
      <div className="mb-8">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
        </div>
        <h3 className="text-2xl font-bold text-primary-900 mb-3 bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-secondary-400 max-w-md mx-auto leading-relaxed">{message}</p>
      </div>
      
      {onAction && (
        <Button
          onClick={onAction}
          icon="Plus"
          size="lg"
          variant="accent"
          className="shadow-lg"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default Empty;