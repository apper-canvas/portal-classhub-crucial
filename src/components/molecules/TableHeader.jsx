import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const TableHeader = ({
  columns,
  sortField,
  sortDirection,
  onSort,
  className
}) => {
  return (
    <thead className={cn("bg-gradient-to-r from-primary-50 to-primary-100", className)}>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={cn(
              "px-6 py-4 text-left text-sm font-semibold text-primary-900 uppercase tracking-wider",
              column.sortable && "cursor-pointer hover:bg-primary-100 transition-colors"
            )}
            onClick={() => column.sortable && onSort && onSort(column.key)}
          >
            <div className="flex items-center space-x-2">
              <span>{column.label}</span>
              {column.sortable && (
                <ApperIcon 
                  name={
                    sortField === column.key 
                      ? sortDirection === "asc" ? "ChevronUp" : "ChevronDown"
                      : "ChevronsUpDown"
                  }
                  className="w-4 h-4 text-primary-600"
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;