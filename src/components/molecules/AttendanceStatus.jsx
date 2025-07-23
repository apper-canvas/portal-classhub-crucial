import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const AttendanceStatus = ({ status, className }) => {
  const statusConfig = {
    present: {
      label: "Present",
      variant: "success",
      color: "bg-success"
    },
    absent: {
      label: "Absent", 
      variant: "error",
      color: "bg-error"
    },
    late: {
      label: "Late",
      variant: "warning",
      color: "bg-warning"
    },
    excused: {
      label: "Excused",
      variant: "info",
      color: "bg-info"
    }
  };

  const config = statusConfig[status] || statusConfig.absent;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn("w-3 h-3 rounded-full", config.color)} />
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    </div>
  );
};

export default AttendanceStatus;