import React from "react";
import { cn } from "@/utils/cn";

const GradeCell = ({ score, totalPoints, className, editable = false, onChange }) => {
  const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
  
  const getGradeClass = (percent) => {
    if (percent >= 90) return "grade-a";
    if (percent >= 80) return "grade-b";
    if (percent >= 70) return "grade-c";
    if (percent >= 60) return "grade-d";
    return "grade-f";
  };

  const displayScore = score !== null ? score : "-";
  const displayPercentage = score !== null ? `${Math.round(percentage)}%` : "-";

  if (editable) {
    return (
      <div className={cn("relative", className)}>
        <input
          type="number"
          min="0"
          max={totalPoints}
          value={score || ""}
          onChange={(e) => onChange && onChange(e.target.value ? Number(e.target.value) : null)}
          className={cn(
            "w-full text-center py-2 px-3 rounded-md border-2 border-gray-200 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
            score !== null && getGradeClass(percentage)
          )}
          placeholder="0"
        />
        {score !== null && (
          <div className="text-xs mt-1 text-center opacity-75">
            {displayPercentage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("text-center", className)}>
      <div className={cn(
        "inline-flex flex-col items-center justify-center px-3 py-2 rounded-md min-w-[60px]",
        score !== null ? getGradeClass(percentage) : "bg-gray-100 text-gray-500"
      )}>
        <span className="font-semibold">{displayScore}</span>
        <span className="text-xs opacity-75">{displayPercentage}</span>
      </div>
    </div>
  );
};

export default GradeCell;