import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatCard from "@/components/molecules/StatCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { format, isToday, parseISO } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeClasses: 0,
    averageGrade: 0,
    attendanceRate: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [students, classes, grades, attendance] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);

      // Calculate stats
      const activeStudents = students.filter(s => s.status === "active").length;
      
      const validGrades = grades.filter(g => g.score !== null);
      const totalGradePoints = validGrades.reduce((sum, grade) => sum + grade.score, 0);
      const averageGrade = validGrades.length > 0 ? Math.round(totalGradePoints / validGrades.length) : 0;
      
      const presentToday = attendance.filter(a => 
        isToday(parseISO(a.date)) && (a.status === "present" || a.status === "late")
      ).length;
      const totalTodayRecords = attendance.filter(a => isToday(parseISO(a.date))).length;
      const attendanceRate = totalTodayRecords > 0 ? Math.round((presentToday / totalTodayRecords) * 100) : 0;

      setStats({
        totalStudents: activeStudents,
        activeClasses: classes.length,
        averageGrade,
        attendanceRate
      });

      // Get today's attendance for quick view
      const todayRecords = attendance
        .filter(a => isToday(parseISO(a.date)))
        .slice(0, 5);
      
      const attendanceWithStudents = await Promise.all(
        todayRecords.map(async (record) => {
          const student = students.find(s => s.Id === record.studentId);
          const classInfo = classes.find(c => c.Id === record.classId);
          return {
            ...record,
            studentName: student ? `${student.firstName} ${student.lastName}` : "Unknown",
            className: classInfo ? classInfo.name : "Unknown Class"
          };
        })
      );

      setTodayAttendance(attendanceWithStudents);

      // Create recent activities
      const activities = [
        {
          id: 1,
          type: "grade",
          description: `${validGrades.length} grades entered today`,
          time: "2 hours ago",
          icon: "GraduationCap"
        },
        {
          id: 2,
          type: "attendance",
          description: `Attendance taken for ${classes.length} classes`,
          time: "3 hours ago",
          icon: "Calendar"
        },
        {
          id: 3,
          type: "student",
          description: `${activeStudents} active students enrolled`,
          time: "1 day ago",
          icon: "Users"
        }
      ];

      setRecentActivities(activities);
    } catch (err) {
      setError(err.message);
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Teacher!</h1>
          <p className="text-primary-100 text-lg">
            Here's what's happening in your classes today - {format(new Date(), "EEEE, MMMM dd, yyyy")}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          change="+2 this week"
          changeType="positive"
          icon="Users"
          iconColor="text-primary-600"
        />
        <StatCard
          title="Active Classes"
          value={stats.activeClasses}
          icon="BookOpen"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          change={stats.averageGrade >= 80 ? "Above target" : "Needs attention"}
          changeType={stats.averageGrade >= 80 ? "positive" : "negative"}
          icon="GraduationCap"
          iconColor="text-accent-600"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          change={stats.attendanceRate >= 90 ? "Excellent" : "Monitor closely"}
          changeType={stats.attendanceRate >= 90 ? "positive" : "negative"}
          icon="Calendar"
          iconColor="text-success"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="UserPlus"
                onClick={() => navigate("/students")}
              >
                Add New Student
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Calendar"
                onClick={() => navigate("/attendance")}
              >
                Take Attendance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="GraduationCap"
                onClick={() => navigate("/grades")}
              >
                Enter Grades
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="BookOpen"
                onClick={() => navigate("/classes")}
              >
                Manage Classes
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-900">Recent Activity</h3>
              <Button variant="ghost" size="sm" icon="RefreshCw" onClick={loadDashboardData}>
                Refresh
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors">
                  <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full mr-4">
                    <ApperIcon name={activity.icon} className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary-900">{activity.description}</p>
                    <p className="text-xs text-secondary-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Today's Attendance Overview */}
      {todayAttendance.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Today's Attendance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayAttendance.map((record) => (
              <div key={record.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-primary-900">{record.studentName}</div>
                  <div className="text-sm text-secondary-400">{record.className}</div>
                </div>
                <Badge 
                  variant={
                    record.status === "present" ? "success" :
                    record.status === "late" ? "warning" :
                    record.status === "excused" ? "info" : "error"
                  }
                >
                  {record.status}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => navigate("/attendance")}
              icon="ArrowRight"
              iconPosition="right"
            >
              View Full Attendance
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;