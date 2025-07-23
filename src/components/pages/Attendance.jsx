import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import AttendanceCalendar from "@/components/organisms/AttendanceCalendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadClassStudents();
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

  const loadClassStudents = async () => {
    if (!selectedClass) return;
    
    try {
      const classId = parseInt(selectedClass);
      const studentsData = await studentService.getByClassId(classId);
      setStudents(studentsData.filter(s => s.status === "active"));
    } catch (err) {
      toast.error("Error loading class students");
      console.error("Error loading class students:", err);
    }
  };

  const handleQuickAttendance = async (status) => {
    if (!selectedClass || students.length === 0) {
      toast.error("Please select a class with students");
      return;
    }

    try {
      const dateString = selectedDate.toISOString().split("T")[0];
      const classId = parseInt(selectedClass);
      
      // Mark all students with the selected status
      const promises = students.map(student => 
        attendanceService.create({
          studentId: student.Id,
          classId,
          date: dateString,
          status
        })
      );
      
      await Promise.all(promises);
      toast.success(`Marked all students as ${status}`);
    } catch (error) {
      toast.error("Error taking attendance");
      console.error("Error taking attendance:", error);
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
        message="You need to create classes before you can take attendance. Set up your first class to get started."
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
            Attendance
          </h1>
          <p className="text-secondary-400 mt-1">
            Track and manage student attendance for your classes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="Download"
            onClick={() => toast.info("Export functionality coming soon!")}
            disabled={!selectedClass}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Class Selection and Quick Actions */}
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Selection */}
          <div>
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
            
            {selectedClassData && (
              <div className="mt-2 text-sm text-secondary-400">
                {students.length} active students • Room {selectedClassData.room}
              </div>
            )}
          </div>

          {/* Quick Attendance Actions */}
          <div className="lg:col-span-2">
            <Label>Quick Attendance for Today</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              <Button
                size="sm"
                variant="accent"
                onClick={() => handleQuickAttendance("present")}
                disabled={!selectedClass || students.length === 0}
                className="text-xs"
              >
                All Present
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickAttendance("absent")}
                disabled={!selectedClass || students.length === 0}
                className="text-xs"
              >
                All Absent
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickAttendance("late")}
                disabled={!selectedClass || students.length === 0}
                className="text-xs"
              >
                All Late
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickAttendance("excused")}
                disabled={!selectedClass || students.length === 0}
                className="text-xs"
              >
                All Excused
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Attendance Calendar */}
      {selectedClass && students.length > 0 ? (
        <AttendanceCalendar
          students={students}
          classId={parseInt(selectedClass)}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      ) : selectedClass && (
        <Empty
          title="No active students"
          message="This class doesn't have any active students enrolled. Add students to the class to start taking attendance."
          icon="Users"
          actionLabel="Manage Students"
          onAction={() => toast.info("Navigate to Students page to manage class enrollment")}
        />
      )}
    </div>
  );
};

export default Attendance;