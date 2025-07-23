import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import GradeGrid from "@/components/organisms/GradeGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";

const Grades = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    name: "",
    dueDate: "",
    totalPoints: "",
    category: "Homework"
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadClassData();
    }
  }, [selectedClass]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const classData = await classService.getAll();
      setClasses(classData);
      
      if (classData.length > 0) {
        setSelectedClass(classData[0].Id.toString());
      }
    } catch (err) {
      setError(err.message);
      console.error("Error loading initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadClassData = async () => {
    if (!selectedClass) return;
    
    try {
      const classId = parseInt(selectedClass);
      const [studentsData, assignmentsData] = await Promise.all([
        studentService.getByClassId(classId),
        assignmentService.getByClassId(classId)
      ]);
      
      setStudents(studentsData);
      setAssignments(assignmentsData);
    } catch (err) {
      toast.error("Error loading class data");
      console.error("Error loading class data:", err);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    
    if (!newAssignment.name.trim() || !newAssignment.totalPoints || !selectedClass) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const assignment = await assignmentService.create({
        ...newAssignment,
        classId: parseInt(selectedClass),
        totalPoints: parseInt(newAssignment.totalPoints)
      });
      
      setAssignments(prev => [...prev, assignment]);
      setNewAssignment({
        name: "",
        dueDate: "",
        totalPoints: "",
        category: "Homework"
      });
      setShowAddAssignment(false);
      toast.success("Assignment added successfully");
    } catch (error) {
      toast.error("Error adding assignment");
      console.error("Error adding assignment:", error);
    }
  };

  const handleGradeUpdate = () => {
    // This function is called when grades are updated
    // You could add any additional logic here if needed
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={loadInitialData} />;
  }

  if (classes.length === 0) {
    return (
      <Empty
        title="No classes found"
        message="You need to create classes before you can manage grades. Set up your first class to get started."
        icon="BookOpen"
        actionLabel="Set Up Classes"
        onAction={() => toast.info("Navigate to Classes page to add classes")}
      />
    );
  }

  const selectedClassData = classes.find(c => c.Id === parseInt(selectedClass));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
            Grades
          </h1>
          <p className="text-secondary-400 mt-1">
            Manage assignments and enter grades for your classes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="Plus"
            onClick={() => setShowAddAssignment(true)}
            disabled={!selectedClass}
          >
            Add Assignment
          </Button>
          <Button
            icon="Download"
            onClick={() => toast.info("Export functionality coming soon!")}
            disabled={!selectedClass}
          >
            Export Grades
          </Button>
        </div>
      </div>

      {/* Class Selection */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="classSelect">Select Class</Label>
            <Select
              id="classSelect"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Choose a class...</option>
              {classes.map((cls) => (
                <option key={cls.Id} value={cls.Id}>
                  {cls.name} - {cls.subject} ({cls.period})
                </option>
              ))}
            </Select>
          </div>
          
          {selectedClassData && (
            <div className="flex items-center space-x-4 text-sm text-secondary-400">
              <div>
                <span className="font-medium">{students.length}</span> students
              </div>
              <div>
                <span className="font-medium">{assignments.length}</span> assignments
              </div>
              <div>
                Room {selectedClassData.room}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Add Assignment Form */}
      {showAddAssignment && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Add New Assignment</h3>
          <form onSubmit={handleAddAssignment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignmentName">Assignment Name *</Label>
                <input
                  id="assignmentName"
                  type="text"
                  className="w-full mt-1 p-2 border-2 border-gray-200 rounded-md focus:border-primary-600 focus:outline-none"
                  value={newAssignment.name}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter assignment name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="totalPoints">Total Points *</Label>
                <input
                  id="totalPoints"
                  type="number"
                  min="1"
                  className="w-full mt-1 p-2 border-2 border-gray-200 rounded-md focus:border-primary-600 focus:outline-none"
                  value={newAssignment.totalPoints}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, totalPoints: e.target.value }))}
                  placeholder="100"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <input
                  id="dueDate"
                  type="date"
                  className="w-full mt-1 p-2 border-2 border-gray-200 rounded-md focus:border-primary-600 focus:outline-none"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  value={newAssignment.category}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="Homework">Homework</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Test">Test</option>
                  <option value="Exam">Exam</option>
                  <option value="Project">Project</option>
                  <option value="Lab">Lab</option>
                  <option value="Essay">Essay</option>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddAssignment(false)}
              >
                Cancel
              </Button>
              <Button type="submit" icon="Plus">
                Add Assignment
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Grades Grid */}
      {selectedClass && students.length > 0 && assignments.length > 0 ? (
        <GradeGrid
          students={students}
          assignments={assignments}
          classId={parseInt(selectedClass)}
          onGradeUpdate={handleGradeUpdate}
        />
      ) : selectedClass && (
        <Empty
          title={students.length === 0 ? "No students enrolled" : "No assignments created"}
          message={
            students.length === 0 
              ? "This class doesn't have any enrolled students yet. Add students to the class to start entering grades."
              : "Create your first assignment to start tracking grades for this class."
          }
          icon={students.length === 0 ? "Users" : "FileText"}
          actionLabel={students.length === 0 ? "Manage Students" : "Add Assignment"}
          onAction={() => {
            if (students.length === 0) {
              toast.info("Navigate to Students page to manage class enrollment");
            } else {
              setShowAddAssignment(true);
            }
          }}
        />
      )}
    </div>
  );
};

export default Grades;