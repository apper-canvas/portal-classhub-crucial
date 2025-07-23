import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import { classService } from "@/services/api/classService";

const ClassForm = ({ classItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    period: "",
    room: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (classItem) {
      setFormData({
        name: classItem.Name || "",
        subject: classItem.subject_c || "",
        period: classItem.period_c || "",
        room: classItem.room_c || ""
      });
    }
  }, [classItem]);

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
      const classData = {
        Name: formData.name,
        subject_c: formData.subject,
        period_c: formData.period,
        room_c: formData.room,
        student_ids_c: ""
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