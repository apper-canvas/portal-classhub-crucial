import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import GradeCell from "@/components/molecules/GradeCell";
import { gradeService } from "@/services/api/gradeService";

const GradeGrid = ({ students, assignments, classId, onGradeUpdate }) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGrades();
  }, [classId]);

  const loadGrades = async () => {
    try {
      setLoading(true);
      const gradeData = await gradeService.getAll();
      setGrades(gradeData);
    } catch (error) {
      toast.error("Error loading grades");
      console.error("Error loading grades:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGrade = (studentId, assignmentId) => {
    return grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
  };

  const handleGradeChange = async (studentId, assignmentId, score) => {
    setSaving(true);
    
    try {
      const existingGrade = getGrade(studentId, assignmentId);
      let updatedGrade;
      
      if (existingGrade) {
        updatedGrade = await gradeService.update(existingGrade.Id, {
          ...existingGrade,
          score,
          submittedDate: new Date().toISOString().split("T")[0]
        });
      } else {
        updatedGrade = await gradeService.create({
          studentId,
          assignmentId,
          score,
          submittedDate: new Date().toISOString().split("T")[0]
        });
      }
      
      setGrades(prev => {
        const filtered = prev.filter(g => !(g.studentId === studentId && g.assignmentId === assignmentId));
        return [...filtered, updatedGrade];
      });
      
      if (onGradeUpdate) {
        onGradeUpdate();
      }
      
      toast.success("Grade updated successfully");
    } catch (error) {
      toast.error("Error updating grade");
      console.error("Error updating grade:", error);
    } finally {
      setSaving(false);
    }
  };

  const calculateStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId && g.score !== null);
    if (studentGrades.length === 0) return 0;
    
    const totalPoints = studentGrades.reduce((sum, grade) => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      return sum + (assignment ? assignment.totalPoints : 0);
    }, 0);
    
    const earnedPoints = studentGrades.reduce((sum, grade) => sum + grade.score, 0);
    
    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-900">Grade Book</h3>
          <Badge variant="info" className="text-xs">
            {assignments.length} assignments • {students.length} students
          </Badge>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-b border-gray-200">
            <div className="flex">
              <div className="w-64 px-6 py-4 font-semibold text-primary-900">Student</div>
              {assignments.map(assignment => (
                <div key={assignment.Id} className="w-24 px-2 py-4 text-center">
                  <div className="font-semibold text-primary-900 text-sm truncate" title={assignment.name}>
                    {assignment.name}
                  </div>
                  <div className="text-xs text-secondary-400 mt-1">
                    {assignment.totalPoints}pts
                  </div>
                </div>
              ))}
              <div className="w-32 px-4 py-4 text-center font-semibold text-primary-900">
                Average
              </div>
            </div>
          </div>
          
          {/* Students and Grades */}
          <div className="bg-white">
            {students.map((student, index) => {
              const average = calculateStudentAverage(student.Id);
              const letterGrade = getLetterGrade(average);
              
              return (
                <div
                  key={student.Id}
                  className={`flex border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary-25 hover:to-primary-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <div className="w-64 px-6 py-4 flex items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-medium">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-primary-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-xs text-secondary-400">
                          ID: {student.Id}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {assignments.map(assignment => {
                    const grade = getGrade(student.Id, assignment.Id);
                    return (
                      <div key={assignment.Id} className="w-24 px-2 py-4 flex items-center justify-center">
                        <GradeCell
                          score={grade?.score || null}
                          totalPoints={assignment.totalPoints}
                          editable={true}
                          onChange={(score) => handleGradeChange(student.Id, assignment.Id, score)}
                        />
                      </div>
                    );
                  })}
                  
                  <div className="w-32 px-4 py-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        letterGrade === "A" ? "text-success" :
                        letterGrade === "B" ? "text-blue-600" :
                        letterGrade === "C" ? "text-yellow-600" :
                        letterGrade === "D" ? "text-orange-600" :
                        "text-error"
                      }`}>
                        {average}%
                      </div>
                      <div className="text-xs text-secondary-400 mt-1">
                        {letterGrade}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {students.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-secondary-400">
            No students enrolled in this class
          </div>
        </div>
      )}
      
      {saving && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-lg">
            <div className="animate-spin w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full"></div>
            <span className="text-sm text-primary-900">Saving...</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default GradeGrid;