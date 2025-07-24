import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";

const ClassForm = ({ classItem, students = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    period: "",
    room: "",
    selectedStudents: []
  });
const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [studentSearch, setStudentSearch] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  useEffect(() => {
    if (classItem) {
      // Parse existing student assignments
      const existingStudentIds = classItem.student_ids_c 
        ? classItem.student_ids_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
        : [];
      
      const existingStudents = students.filter(student => 
        existingStudentIds.includes(student.Id)
      );

      setFormData({
        name: classItem.Name || "",
        subject: classItem.subject_c || "",
        period: classItem.period_c || "",
        room: classItem.room_c || "",
        selectedStudents: existingStudents
      });
    }
  }, [classItem, students]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Class name is required";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.period.trim()) {
      newErrors.period = "Period is required";
    }
    
    if (!formData.room.trim()) {
      newErrors.room = "Room is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setLoading(true);
    
try {
      // Map form data to database field names
      const studentIds = formData.selectedStudents.map(student => student.Id).join(',');
      const classData = {
        Name: formData.name,
        subject_c: formData.subject,
        period_c: formData.period,
        room_c: formData.room,
        student_ids_c: studentIds
      };
      
      let savedClass;
      if (classItem) {
        savedClass = await classService.update(classItem.Id, classData);
      } else {
        savedClass = await classService.create(classData);
      }
      
      if (savedClass) {
        onSave(savedClass);
      } else {
        toast.error("Error saving class");
      }
    } catch (error) {
      toast.error("Error saving class");
      console.error("Error saving class:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
};

  const handleStudentSelect = (student) => {
    const isAlreadySelected = formData.selectedStudents.some(s => s.Id === student.Id);
    if (!isAlreadySelected) {
      setFormData(prev => ({
        ...prev,
        selectedStudents: [...prev.selectedStudents, student]
      }));
    }
    setStudentSearch("");
    setShowStudentDropdown(false);
  };

  const handleStudentRemove = (studentId) => {
    setFormData(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.filter(s => s.Id !== studentId)
    }));
  };

  const filteredStudents = students.filter(student => {
    const searchTerm = studentSearch.toLowerCase();
    const isAlreadySelected = formData.selectedStudents.some(s => s.Id === student.Id);
    const matchesSearch = !searchTerm || 
      student.Name.toLowerCase().includes(searchTerm) ||
      student.first_name_c?.toLowerCase().includes(searchTerm) ||
      student.last_name_c?.toLowerCase().includes(searchTerm) ||
      student.email_c?.toLowerCase().includes(searchTerm);
    return !isAlreadySelected && matchesSearch;
  });

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary-900 mb-2">
          {classItem ? "Edit Class" : "Add New Class"}
        </h2>
        <p className="text-secondary-400">
          {classItem ? "Update class information" : "Enter class details to add it to your roster"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Class Name"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={errors.name}
          placeholder="Enter class name"
        />

        <FormField
          label="Subject"
          id="subject"
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          error={errors.subject}
          placeholder="Enter subject (e.g., Mathematics, English)"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Period"
            id="period"
            value={formData.period}
            onChange={(e) => handleInputChange("period", e.target.value)}
            error={errors.period}
            placeholder="Enter period (e.g., 1st, 2nd)"
          />
          
          <FormField
            label="Room"
            id="room"
            value={formData.room}
            onChange={(e) => handleInputChange("room", e.target.value)}
            error={errors.room}
            placeholder="Enter room number"
          />
        </div>

        {/* Student Selection Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Students ({formData.selectedStudents.length})
            </label>
            
            {/* Student Search Input */}
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setShowStudentDropdown(true);
                  }}
                  onFocus={() => setShowStudentDropdown(true)}
                  placeholder="Search and add students..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                />
                <ApperIcon 
                  name="Search" 
                  size={20} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
              
              {/* Student Dropdown */}
              {showStudentDropdown && studentSearch && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                      <button
                        key={student.Id}
                        type="button"
                        onClick={() => handleStudentSelect(student)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center space-x-3"
                      >
                        <ApperIcon name="User" size={16} className="text-gray-400" />
                        <div>
                          <div className="font-medium text-primary-900">{student.Name}</div>
                          {student.email_c && (
                            <div className="text-sm text-gray-500">{student.email_c}</div>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-center">
                      No students found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Selected Students */}
          {formData.selectedStudents.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Selected Students:</p>
              <div className="flex flex-wrap gap-2">
                {formData.selectedStudents.map(student => (
                  <div
                    key={student.Id}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                  >
                    <ApperIcon name="User" size={14} />
                    <span>{student.Name}</span>
                    <button
                      type="button"
                      onClick={() => handleStudentRemove(student.Id)}
                      className="hover:text-primary-900 focus:outline-none"
                    >
                      <ApperIcon name="X" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon="Save"
          >
            {classItem ? "Update Class" : "Add Class"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ClassForm;