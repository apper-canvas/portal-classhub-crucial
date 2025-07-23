import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import AttendanceStatus from "@/components/molecules/AttendanceStatus";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { attendanceService } from "@/services/api/attendanceService";

const AttendanceCalendar = ({ students, classId, selectedDate, onDateSelect }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadAttendance();
  }, [classId, currentMonth]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const attendanceData = await attendanceService.getAll();
      setAttendance(attendanceData);
    } catch (error) {
      toast.error("Error loading attendance");
      console.error("Error loading attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceForDate = (studentId, date) => {
    return attendance.find(a => 
      a.studentId === studentId && 
      isSameDay(new Date(a.date), date)
    );
  };

  const handleAttendanceChange = async (studentId, date, status) => {
    setSaving(true);
    
    try {
      const dateString = format(date, "yyyy-MM-dd");
      const existingRecord = getAttendanceForDate(studentId, date);
      
      let updatedRecord;
      if (existingRecord) {
        updatedRecord = await attendanceService.update(existingRecord.Id, {
          ...existingRecord,
          status
        });
      } else {
        updatedRecord = await attendanceService.create({
          studentId,
          classId,
          date: dateString,
          status
        });
      }
      
      setAttendance(prev => {
        const filtered = prev.filter(a => !(a.studentId === studentId && isSameDay(new Date(a.date), date)));
        return [...filtered, updatedRecord];
      });
      
      toast.success("Attendance updated successfully");
    } catch (error) {
      toast.error("Error updating attendance");
      console.error("Error updating attendance:", error);
    } finally {
      setSaving(false);
    }
  };

  const getMonthDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getAttendanceStats = (studentId) => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    const total = studentAttendance.length;
    const present = studentAttendance.filter(a => a.status === "present").length;
    const late = studentAttendance.filter(a => a.status === "late").length;
    
    return {
      total,
      present,
      late,
      percentage: total > 0 ? Math.round(((present + late) / total) * 100) : 0
    };
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-900">
            Attendance Calendar - {format(currentMonth, "MMMM yyyy")}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              icon="ChevronLeft"
              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon="ChevronRight"
              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
            />
          </div>
        </div>
      </Card>

      {/* Selected Date Attendance */}
      {selectedDate && (
        <Card className="p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-primary-900 mb-2">
              Attendance for {format(selectedDate, "EEEE, MMMM dd, yyyy")}
            </h4>
          </div>
          
          <div className="space-y-3">
            {students.map(student => {
              const attendanceRecord = getAttendanceForDate(student.Id, selectedDate);
              const currentStatus = attendanceRecord?.status || "absent";
              
              return (
                <div key={student.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center mr-4">
                      <span className="text-white font-medium text-sm">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-primary-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-secondary-400">
                        ID: {student.Id}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {["present", "absent", "late", "excused"].map(status => (
                      <Button
                        key={status}
                        size="sm"
                        variant={currentStatus === status ? "primary" : "outline"}
                        onClick={() => handleAttendanceChange(student.Id, selectedDate, status)}
                        disabled={saving}
                        className="capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Student Attendance Summary */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-primary-900">Attendance Summary</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-primary-50 to-primary-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Student</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-primary-900">Present</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-primary-900">Late</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-primary-900">Total Days</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-primary-900">Percentage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => {
                const stats = getAttendanceStats(student.Id);
                
                return (
                  <tr
                    key={student.Id}
                    className={`hover:bg-gradient-to-r hover:from-primary-25 hover:to-primary-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="success">{stats.present}</Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="warning">{stats.late}</Badge>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-primary-900">
                      {stats.total}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`font-semibold ${
                        stats.percentage >= 90 ? "text-success" :
                        stats.percentage >= 80 ? "text-warning" :
                        "text-error"
                      }`}>
                        {stats.percentage}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mini Calendar */}
      <Card className="p-4">
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-2 text-xs font-semibold text-secondary-400">
              {day}
            </div>
          ))}
          
          {getMonthDays().map(date => {
            const hasAttendance = attendance.some(a => isSameDay(new Date(a.date), date));
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => onDateSelect(date)}
                className={`p-2 text-sm rounded-lg transition-all duration-200 hover:bg-primary-100 ${
                  isSelected
                    ? "bg-primary-600 text-white shadow-md"
                    : isToday(date)
                    ? "bg-primary-100 text-primary-900 font-semibold"
                    : hasAttendance
                    ? "bg-success/10 text-success font-medium"
                    : "text-primary-900 hover:bg-primary-50"
                }`}
              >
                {format(date, "d")}
                {hasAttendance && !isSelected && (
                  <div className="w-1 h-1 bg-success rounded-full mx-auto mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AttendanceCalendar;