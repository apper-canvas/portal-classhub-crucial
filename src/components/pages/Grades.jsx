import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNotifications } from "@/contexts/NotificationContext";
import { assignmentService } from "@/services/api/assignmentService";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { classService } from "@/services/api/classService";
import ApperIcon from "@/components/ApperIcon";
import GradeGrid from "@/components/organisms/GradeGrid";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
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
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedAssignmentForReminder, setSelectedAssignmentForReminder] = useState(null);
  const [showBulkReminderModal, setShowBulkReminderModal] = useState(false);
  const [reminderDays, setReminderDays] = useState(3);
  const { addNotification } = useNotifications();
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

  const handleSetReminder = async (assignment) => {
    setSelectedAssignmentForReminder(assignment);
    setShowReminderModal(true);
  };

  const handleCreateReminder = async () => {
    if (!selectedAssignmentForReminder) return;

    try {
      await addNotification({
        type: 'assignment_reminder',
        title: 'Assignment Reminder Set',
        message: `Reminder set for "${selectedAssignmentForReminder.name}" due ${selectedAssignmentForReminder.dueDate}`,
        assignmentId: selectedAssignmentForReminder.Id,
        priority: 'medium'
      });

      toast.success('Reminder set successfully');
      setShowReminderModal(false);
      setSelectedAssignmentForReminder(null);
    } catch (error) {
      toast.error('Error setting reminder');
      console.error('Error creating reminder:', error);
    }
  };

  const handleBulkReminders = async () => {
    if (!selectedClass) return;

    try {
      const upcomingAssignments = assignments.filter(assignment => {
        if (!assignment.dueDate) return false;
        const dueDate = new Date(assignment.dueDate);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() + reminderDays);
        return dueDate <= cutoffDate && dueDate >= new Date();
      });

      for (const assignment of upcomingAssignments) {
        await addNotification({
          type: 'assignment_reminder',
          title: 'Bulk Reminder Set',
          message: `Reminder set for "${assignment.name}" due ${assignment.dueDate}`,
          assignmentId: assignment.Id,
          priority: 'medium'
        });
      }

      toast.success(`Reminders set for ${upcomingAssignments.length} assignments`);
      setShowBulkReminderModal(false);
    } catch (error) {
      toast.error('Error setting bulk reminders');
      console.error('Error creating bulk reminders:', error);
    }
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
            variant="outline"
            icon="Bell"
            onClick={() => setShowBulkReminderModal(true)}
            disabled={!selectedClass || assignments.length === 0}
          >
            Set Reminders
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
      {/* Assignment Reminders */}
      {selectedClass && assignments.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary-900">Assignment Deadlines</h3>
            <Button
              variant="outline"
              size="sm"
              icon="Bell"
              onClick={() => setShowBulkReminderModal(true)}
            >
              Set All Reminders
            </Button>
          </div>
          
          <div className="space-y-3">
            {assignments
              .filter(a => a.dueDate)
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 5)
              .map((assignment) => {
                const dueDate = new Date(assignment.dueDate);
                const today = new Date();
                const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={assignment.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        daysUntilDue <= 1 ? 'bg-error text-white' :
                        daysUntilDue <= 3 ? 'bg-warning text-white' :
                        'bg-info text-white'
                      }`}>
                        <ApperIcon name="Clock" size={14} />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-900">{assignment.name}</h4>
                        <p className="text-sm text-secondary-400">
                          Due: {dueDate.toLocaleDateString()} 
                          {daysUntilDue === 0 ? ' (Today)' :
                           daysUntilDue === 1 ? ' (Tomorrow)' :
                           daysUntilDue < 0 ? ` (${Math.abs(daysUntilDue)} days overdue)` :
                           ` (${daysUntilDue} days)`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Bell"
                      onClick={() => handleSetReminder(assignment)}
                    >
                      Set Reminder
                    </Button>
                  </div>
                );
              })}
            
            {assignments.filter(a => a.dueDate).length === 0 && (
              <p className="text-secondary-400 text-center py-4">
                No assignments with due dates yet. Add due dates to track deadlines.
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Reminder Modal */}
      {showReminderModal && selectedAssignmentForReminder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-900">Set Reminder</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReminderModal(false)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              
              <div className="mb-6">
                <p className="text-secondary-400 mb-2">Assignment:</p>
                <p className="font-medium text-primary-900">{selectedAssignmentForReminder.name}</p>
                <p className="text-sm text-secondary-400">
                  Due: {new Date(selectedAssignmentForReminder.dueDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowReminderModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateReminder} icon="Bell">
                  Set Reminder
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Reminder Modal */}
      {showBulkReminderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-900">Set Bulk Reminders</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBulkReminderModal(false)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="reminderDays">Remind me for assignments due within:</Label>
                <Select
                  id="reminderDays"
                  value={reminderDays}
                  onChange={(e) => setReminderDays(parseInt(e.target.value))}
                  className="mt-2"
                >
                  <option value={1}>1 day</option>
                  <option value={2}>2 days</option>
                  <option value={3}>3 days</option>
                  <option value={7}>1 week</option>
                  <option value={14}>2 weeks</option>
                </Select>
                
                <p className="text-sm text-secondary-400 mt-2">
                  This will set reminders for all assignments in this class due within the selected timeframe.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkReminderModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleBulkReminders} icon="Bell">
                  Set Reminders
                </Button>
              </div>
            </div>
          </div>
        </div>
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
  );
};

export default Grades;