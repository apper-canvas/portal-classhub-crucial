import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "skeleton" }) => {
  if (type === "spinner") {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-primary-100"></div>
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48"></div>
        <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md w-32"></div>
      </div>
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Table skeleton */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4">
          <div className="flex space-x-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-20"></div>
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="flex space-x-6">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className={cn(
                    "h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded",
                    j === 0 ? "w-32" : j === 1 ? "w-40" : "w-16"
                  )}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;