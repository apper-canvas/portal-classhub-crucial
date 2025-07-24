import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import ClassForm from "@/components/organisms/ClassForm";

const Classes = () => {
const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [classes, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [classData, studentData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      setClasses(classData);
      setStudents(studentData);
    } catch (err) {
      setError(err.message);
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterClasses = () => {
    let filtered = [...classes];

if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cls =>
        cls.Name?.toLowerCase().includes(query) ||
        cls.subject_c?.toLowerCase().includes(query) ||
        cls.period_c?.toLowerCase().includes(query) ||
        cls.room_c?.toLowerCase().includes(query)
      );
    }
setFilteredClasses(filtered);
  };

  const handleSaveClass = async (savedClass) => {
    if (selectedClass) {
      // Update existing class
      setClasses(prev => prev.map(cls => cls.Id === savedClass.Id ? savedClass : cls));
      toast.success("Class updated successfully");
    } else {
      // Add new class
      setClasses(prev => [...prev, savedClass]);
      toast.success("Class created successfully");
    }
    setShowForm(false);
    setSelectedClass(null);
  };

  const handleEditClass = (classItem) => {
    setSelectedClass(classItem);
    setShowForm(true);
  };

const getClassStudents = (classId) => {
    return students.filter(student => student.class_ids_c?.split(',').map(id => parseInt(id.trim())).includes(classId));
  };
  const getSubjectIcon = (subject) => {
    const icons = {
      "Mathematics": "Calculator",
      "English": "BookOpen",
      "Science": "Microscope",
      "Social Studies": "Globe",
      "History": "Clock",
      "Art": "Palette",
      "Music": "Music",
      "Physical Education": "Activity"
    };
    return icons[subject] || "BookOpen";
  };

  const getSubjectColor = (subject) => {
    const colors = {
      "Mathematics": "from-blue-500 to-blue-700",
      "English": "from-green-500 to-green-700",
      "Science": "from-purple-500 to-purple-700",
      "Social Studies": "from-orange-500 to-orange-700",
      "History": "from-red-500 to-red-700",
      "Art": "from-pink-500 to-pink-700",
      "Music": "from-indigo-500 to-indigo-700",
      "Physical Education": "from-yellow-500 to-yellow-700"
    };
    return colors[subject] || "from-primary-500 to-primary-700";
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
            Classes
          </h1>
          <p className="text-secondary-400 mt-1">
            Manage your classes and view enrollment information
          </p>
        </div>
<Button
          icon="Plus"
          size="lg"
          className="shadow-lg"
          onClick={() => setShowForm(true)}
        >
          Add Class
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search classes by name, subject, or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
          />
        </div>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 && !loading ? (
        <Empty
          title="No classes found"
          message={
            searchQuery 
              ? "No classes match your search criteria. Try adjusting your search terms."
              : "You haven't set up any classes yet. Create your first class to get started."
          }
          icon="BookOpen"
actionLabel="Add First Class"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => {
const classStudents = getClassStudents(classItem.Id);
            const activeStudents = classStudents.filter(s => s.status_c === "active");
            
            return (
              <Card
                key={classItem.Id}
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                variant="elevated"
>
                {/* Class Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-br ${getSubjectColor(classItem.subject_c)} group-hover:scale-110 transition-transform duration-200`}>
                    <ApperIcon 
                      name={getSubjectIcon(classItem.subject_c)} 
                      className="w-6 h-6 text-white" 
                    />
                  </div>
                  <Badge variant="info" className="text-xs">
                    {classItem.period_c}
                  </Badge>
                </div>

                {/* Class Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-primary-900 mb-1 group-hover:text-primary-700 transition-colors">
                    {classItem.Name}
                  </h3>
                  <p className="text-secondary-400 text-sm mb-2">{classItem.subject_c}</p>
                  <div className="flex items-center text-secondary-400 text-sm">
                    <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                    {classItem.room_c}
                  </div>
                </div>

                {/* Enrollment Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-400">Total Enrolled</span>
<span className="font-semibold text-primary-900">{classStudents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-400">Active Students</span>
                    <span className="font-semibold text-success">{activeStudents.length}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 bg-gradient-to-r from-success to-accent-600 rounded-full transition-all duration-500"
                      style={{ 
                        width: classStudents.length > 0 ? `${(activeStudents.length / classStudents.length) * 100}%` : '0%' 
                      }}
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon="Users"
                    className="flex-1"
                    onClick={() => toast.info("View roster functionality coming soon!")}
                  >
                    Roster
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon="GraduationCap"
                    className="flex-1"
                    onClick={() => toast.info("View grades functionality coming soon!")}
                  >
                    Grades
                  </Button>
                </div>

                {/* Student Avatars */}
                {activeStudents.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="flex -space-x-2 overflow-hidden">
                        {activeStudents.slice(0, 4).map((student) => (
                          <div
                            key={student.Id}
                            className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 border-2 border-white flex items-center justify-center"
title={`${student.first_name_c} ${student.last_name_c}`}
                          >
                            <span className="text-white text-xs font-medium">
                              {student.first_name_c?.charAt(0)}{student.last_name_c?.charAt(0)}
                            </span>
                          </div>
                        ))}
                        {activeStudents.length > 4 && (
                          <div className="inline-block w-8 h-8 rounded-full bg-secondary-400 border-2 border-white flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              +{activeStudents.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="ml-3 text-xs text-secondary-400">
                        Recent students
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {!loading && filteredClasses.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-900 mb-1">
                {filteredClasses.length}
              </div>
              <div className="text-sm text-secondary-400">Total Classes</div>
</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-900 mb-1">
                {new Set(filteredClasses.map(c => c.subject_c)).size}
              </div>
              <div className="text-sm text-secondary-400">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-900 mb-1">
                {filteredClasses.reduce((sum, cls) => sum + getClassStudents(cls.Id).length, 0)}
              </div>
              <div className="text-sm text-secondary-400">Total Enrollment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-900 mb-1">
                {Math.round(
                  filteredClasses.reduce((sum, cls) => {
                    const classStudents = getClassStudents(cls.Id);
                    return sum + (classStudents.length > 0 ? classStudents.length : 0);
                  }, 0) / Math.max(filteredClasses.length, 1)
                )}
              </div>
              <div className="text-sm text-secondary-400">Avg. Class Size</div>
</div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
<ClassForm
              classItem={selectedClass}
              students={students}
              onSave={handleSaveClass}
              onCancel={() => {
                setShowForm(false);
                setSelectedClass(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;