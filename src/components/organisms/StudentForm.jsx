import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import { studentService } from "@/services/api/studentService";

const StudentForm = ({ student, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    enrollmentDate: "",
    status: "active"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.first_name_c || "",
        lastName: student.last_name_c || "",
        email: student.email_c || "",
        dateOfBirth: student.date_of_birth_c || "",
        enrollmentDate: student.enrollment_date_c || "",
        status: student.status_c || "active"
      });
    }
  }, [student]);
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
      // Map form data to database field names
      const studentData = {
        first_name_c: formData.firstName,
        last_name_c: formData.lastName,
        email_c: formData.email,
        date_of_birth_c: formData.dateOfBirth,
        enrollment_date_c: formData.enrollmentDate,
        status_c: formData.status
      };
      
      let savedStudent;
      if (student) {
        savedStudent = await studentService.update(student.Id, studentData);
        toast.success("Student updated successfully");
      } else {
        savedStudent = await studentService.create(studentData);
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