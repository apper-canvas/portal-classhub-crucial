import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
const StudentForm = ({ student, onSave, onCancel }) => {
// Data validation utility functions
  const validateEmail = (email) => {
    if (!email) return true; // Allow empty emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDate = (dateString) => {
    if (!dateString) return true; // Allow empty dates
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.length >= 10;
  };

  const parseNumericField = (value, fallback = null) => {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    const parsed = parseInt(value);
    return isNaN(parsed) ? fallback : parsed;
  };

  const parseCurrencyField = (value, fallback = null) => {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  };

  const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    enrollmentDate: "",
    status: "active",
    classes: "",
    classes1: "",
    classes2: "", // comma-separated string for checkbox values
    classes3: "", // currency value
    classes4: "",
    classes5: "",
    classes6: "",
    classes7: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(false);
useEffect(() => {
    const loadClasses = async () => {
      setClassesLoading(true);
      try {
        const classData = await classService.getAll();
        setClasses(classData);
      } catch (error) {
        console.error("Error loading classes:", error);
      } finally {
        setClassesLoading(false);
      }
    };

    loadClasses();
  }, []);

// Helper function to format date for HTML date input (YYYY-MM-DD)
const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";
    
    try {
      // Log the incoming date value for debugging
      console.log("Formatting date value:", dateValue, "Type:", typeof dateValue);
      
      let date;
      
      // Handle different date formats
      if (typeof dateValue === 'string') {
        // Handle ISO date strings, database date formats, etc.
        date = new Date(dateValue);
      } else if (typeof dateValue === 'number') {
        // Handle timestamp
        date = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        // Already a Date object
        date = dateValue;
      } else {
        // Try to convert whatever we received
        date = new Date(dateValue);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date value:", dateValue);
        return "";
      }
      
      // Convert to YYYY-MM-DD format required by HTML date input
      const formattedDate = date.toISOString().split('T')[0];
      console.log("Formatted date result:", formattedDate);
      return formattedDate;
    } catch (error) {
      console.error("Error formatting date:", error, "Original value:", dateValue);
      return "";
    }
  };

useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.first_name_c || "",
        lastName: student.last_name_c || "",
        email: student.email_c || "",
        dateOfBirth: formatDateForInput(student.date_of_birth_c),
        enrollmentDate: formatDateForInput(student.enrollment_date_c),
        status: student.status_c || "active",
        classes: parseNumericField(student.classes_c?.Id, ""),
        classes1: student.classes1_c || "",
        classes2: student.classes2_c || "", // checkbox data as comma-separated string
classes3: parseCurrencyField(student.classes3_c, ""), // currency value - direct value, not lookup
        classes4: parseCurrencyField(student.classes4_c, ""), // currency value - direct value, not lookup
        classes5: student.classes5_c || "", // email field - direct string value
        classes6: parseNumericField(student.classes6_c?.Id, ""),
        classes7: parseNumericField(student.classes7_c?.Id, "")
      });
    }
  }, [student]);

const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    const firstNameError = validateRequired(formData.firstName, "First name");
    if (firstNameError) newErrors.firstName = firstNameError;
    
    const lastNameError = validateRequired(formData.lastName, "Last name");
    if (lastNameError) newErrors.lastName = lastNameError;
    
    const emailError = validateRequired(formData.email, "Email");
    if (emailError) newErrors.email = emailError;
    else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Date validation
    if (formData.dateOfBirth && !validateDate(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "Please enter a valid date of birth";
    }
    
    if (formData.enrollmentDate && !validateDate(formData.enrollmentDate)) {
      newErrors.enrollmentDate = "Please enter a valid enrollment date";
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
      // Map form data to database field names with proper type validation
      const studentData = {
        first_name_c: formData.firstName?.trim() || null,
        last_name_c: formData.lastName?.trim() || null,
        email_c: formData.email?.trim() || null,
        date_of_birth_c: formData.dateOfBirth || null,
        enrollment_date_c: formData.enrollmentDate || null,
        status_c: formData.status || "active",
        classes_c: parseNumericField(formData.classes),
        classes1_c: formData.classes1?.trim() || null,
        classes2_c: formData.classes2?.trim() || null, // checkbox data as comma-separated string
classes3_c: parseCurrencyField(formData.classes3), // currency value
        classes4_c: parseCurrencyField(formData.classes4), // currency value
        classes5_c: formData.classes5?.trim() || null, // email field - direct string value
        classes6_c: parseNumericField(formData.classes6),
        classes7_c: parseNumericField(formData.classes7)
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
          <Label>Classes</Label>
          <Select
            value={formData.classes}
            onChange={(e) => handleInputChange("classes", e.target.value)}
            disabled={classesLoading}
          >
            <option value="">Select a class (optional)</option>
            {classesLoading ? (
              <option value="">Loading classes...</option>
            ) : (
              classes.map((classItem) => (
                <option key={classItem.Id} value={classItem.Id}>
                  {classItem.Name} - {classItem.subject_c}
                </option>
              ))
            )}
          </Select>
        </div>

<FormField
          label="Classes1"
          id="classes1"
          value={formData.classes1}
          onChange={(e) => handleInputChange("classes1", e.target.value)}
          placeholder="Enter class information (optional)"
        />

<div className="space-y-3">
          <Label>Classes2</Label>
          <div className="space-y-2">
            {classesLoading ? (
              <div className="text-sm text-secondary-400">Loading classes...</div>
            ) : (
              classes.map((classItem) => {
                const selectedClasses = formData.classes2 ? formData.classes2.split(',') : [];
                const isChecked = selectedClasses.includes(classItem.Id.toString());
                
                return (
                  <label key={classItem.Id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const currentClasses = formData.classes2 ? formData.classes2.split(',').filter(id => id) : [];
                        let updatedClasses;
                        
                        if (e.target.checked) {
                          updatedClasses = [...currentClasses, classItem.Id.toString()];
                        } else {
                          updatedClasses = currentClasses.filter(id => id !== classItem.Id.toString());
                        }
                        
                        handleInputChange("classes2", updatedClasses.join(','));
                      }}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-primary-900">
                      {classItem.Name} - {classItem.subject_c}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>

<div className="space-y-3">
          <Label>Classes3 (Currency)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter amount (e.g., 99.99)"
            value={formData.classes3}
            onChange={(e) => handleInputChange("classes3", e.target.value)}
          />
        </div>

<div className="space-y-3">
          <Label>Classes4</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="Enter amount (e.g., 150.00)"
            value={formData.classes4}
            onChange={(e) => handleInputChange("classes4", e.target.value)}
          />
        </div>

<FormField
          label="Classes5 (Email)"
          id="classes5"
          type="email"
          value={formData.classes5}
          onChange={(e) => handleInputChange("classes5", e.target.value)}
          placeholder="Enter email address (optional)"
        />

        <div className="space-y-3">
          <Label>Classes6</Label>
          <Select
            value={formData.classes6}
            onChange={(e) => handleInputChange("classes6", e.target.value)}
            disabled={classesLoading}
          >
            <option value="">Select a class (optional)</option>
            {classesLoading ? (
              <option value="">Loading classes...</option>
            ) : (
              classes.map((classItem) => (
                <option key={classItem.Id} value={classItem.Id}>
                  {classItem.Name} - {classItem.subject_c}
                </option>
              ))
            )}
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Classes7</Label>
          <Select
            value={formData.classes7}
            onChange={(e) => handleInputChange("classes7", e.target.value)}
            disabled={classesLoading}
          >
            <option value="">Select a class (optional)</option>
            {classesLoading ? (
              <option value="">Loading classes...</option>
            ) : (
              classes.map((classItem) => (
                <option key={classItem.Id} value={classItem.Id}>
                  {classItem.Name} - {classItem.subject_c}
                </option>
              ))
            )}
          </Select>
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