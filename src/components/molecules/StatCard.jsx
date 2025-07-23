import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  iconColor = "text-primary-600",
  className,
  ...props
}) => {
  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-secondary-400"
  };

  return (
    <Card className={cn("p-6", className)} variant="elevated" {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-primary-900 bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
            {value}
          </p>
          {change && (
            <p className={cn("text-sm mt-2 flex items-center", changeColors[changeType])}>
              <ApperIcon 
                name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                className="w-4 h-4 mr-1" 
              />
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary-50 to-primary-100">
              <ApperIcon name={icon} className={cn("w-6 h-6", iconColor)} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;