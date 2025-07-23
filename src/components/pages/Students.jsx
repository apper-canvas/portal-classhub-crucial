import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterAndSortStudents();
  }, [students, searchQuery, sortField, sortDirection]);

const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      
      // Map mock data field names to database field names
      const mappedData = data.map(student => ({
        ...student,
        first_name_c: student.firstName || student.first_name_c,
        last_name_c: student.lastName || student.last_name_c,
        email_c: student.email || student.email_c,
        date_of_birth_c: student.dateOfBirth || student.date_of_birth_c,
        enrollment_date_c: student.enrollmentDate || student.enrollment_date_c,
        status_c: student.status || student.status_c,
        class_ids_c: Array.isArray(student.classIds) 
          ? student.classIds.join(',') 
          : (student.class_ids_c || '')
      }));
      
      setStudents(mappedData);
    } catch (err) {
      setError(err.message);
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    let filtered = [...students];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
filtered = filtered.filter(student =>
        student.first_name_c?.toLowerCase().includes(query) ||
        student.last_name_c?.toLowerCase().includes(query) ||
        student.email_c?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
case "name":
          aValue = `${a.first_name_c} ${a.last_name_c}`.toLowerCase();
          bValue = `${b.first_name_c} ${b.last_name_c}`.toLowerCase();
          break;
case "email":
          aValue = a.email_c?.toLowerCase() || '';
          bValue = b.email_c?.toLowerCase() || '';
          break;
case "enrollmentDate":
          aValue = new Date(a.enrollment_date_c);
          bValue = new Date(b.enrollment_date_c);
          break;
case "status":
          aValue = a.status_c;
          bValue = b.status_c;
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredStudents(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await studentService.delete(studentId);
      setStudents(prev => prev.filter(s => s.Id !== studentId));
      toast.success("Student deleted successfully");
    } catch (error) {
      toast.error("Error deleting student");
      console.error("Error deleting student:", error);
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  const handleFormSave = (savedStudent) => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.Id === savedStudent.Id ? savedStudent : s));
    } else {
      setStudents(prev => [...prev, savedStudent]);
    }
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <StudentForm
          student={editingStudent}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  if (selectedStudent) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            icon="ArrowLeft"
            onClick={() => setSelectedStudent(null)}
          >
            Back to Students
          </Button>
        </div>
        <StudentForm
          student={selectedStudent}
          onSave={(updatedStudent) => {
            setStudents(prev => prev.map(s => s.Id === updatedStudent.Id ? updatedStudent : s));
            setSelectedStudent(null);
          }}
          onCancel={() => setSelectedStudent(null)}
        />
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={loadStudents} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-secondary-400 mt-1">
            Manage your student roster and information
          </p>
        </div>
        <Button
          onClick={handleAddStudent}
          icon="UserPlus"
          size="lg"
          className="shadow-lg"
        >
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
          />
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 && !loading ? (
        <Empty
          title="No students found"
          message={
            searchQuery 
              ? "No students match your search criteria. Try adjusting your search terms."
              : "You haven't added any students yet. Start by adding your first student to build your class roster."
          }
          icon="Users"
          actionLabel="Add First Student"
          onAction={handleAddStudent}
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Stats Footer */}
      {!loading && filteredStudents.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-6">
              <div className="text-primary-900">
                <span className="font-semibold">{filteredStudents.length}</span> students
                {searchQuery && (
                  <span className="text-secondary-400 ml-1">
                    (filtered from {students.length})
                  </span>
                )}
              </div>
              <div className="text-primary-900">
                <span className="font-semibold">
                  {filteredStudents.filter(s => s.status === "active").length}
                </span> active
              </div>
            </div>
            <div className="text-secondary-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;