import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";

const StudentForm = ({ student, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    enrollmentDate: "",
    classIds: [],
    status: "active"
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        dateOfBirth: student.dateOfBirth || "",
        enrollmentDate: student.enrollmentDate || "",
        classIds: student.classIds || [],
        status: student.status || "active"
      });
    }
  }, [student]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const classData = await classService.getAll();
      setClasses(classData);
    } catch (error) {
      console.error("Error loading classes:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    
    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = "Enrollment date is required";
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
      let savedStudent;
      if (student) {
        savedStudent = await studentService.update(student.Id, formData);
        toast.success("Student updated successfully");
      } else {
        savedStudent = await studentService.create(formData);
        toast.success("Student created successfully");
      }
      
      onSave(savedStudent);
    } catch (error) {
      toast.error("Error saving student");
      console.error("Error saving student:", error);
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

  const handleClassToggle = (classId) => {
    setFormData(prev => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter(id => id !== classId)
        : [...prev.classIds, classId]
    }));
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary-900 mb-2">
          {student ? "Edit Student" : "Add New Student"}
        </h2>
        <p className="text-secondary-400">
          {student ? "Update student information" : "Enter student details to add them to your roster"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="First Name"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            error={errors.firstName}
            placeholder="Enter first name"
          />
          
          <FormField
            label="Last Name"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            error={errors.lastName}
            placeholder="Enter last name"
          />
        </div>

        <FormField
          label="Email Address"
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
          placeholder="Enter email address"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Date of Birth"
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            error={errors.dateOfBirth}
          />
          
          <FormField
            label="Enrollment Date"
            id="enrollmentDate"
            type="date"
            value={formData.enrollmentDate}
            onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
            error={errors.enrollmentDate}
          />
        </div>

        <div className="space-y-3">
          <Label>Student Status</Label>
          <Select
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Enrolled Classes</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {classes.map((classItem) => (
              <label
                key={classItem.Id}
                className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:border-primary-300 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.classIds.includes(classItem.Id)}
                  onChange={() => handleClassToggle(classItem.Id)}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-primary-900">{classItem.name}</div>
                  <div className="text-sm text-secondary-400">{classItem.subject} - {classItem.period}</div>
                </div>
              </label>
            ))}
          </div>
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
            {student ? "Update Student" : "Add Student"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default StudentForm;