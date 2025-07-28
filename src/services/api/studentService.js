class StudentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'student_c';
  }

  async getAll() {
try {
      if (!navigator.onLine) {
        console.error("Network error fetching students - no internet connection");
        return [];
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "class_ids_c" } },
          { field: { Name: "status_c" } },
          { 
            field: { Name: "classes_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "classes1_c" }
          },
          { 
            field: { Name: "classes2_c" }
          },
          { 
            field: { Name: "classes3_c" }
          },
          { 
            field: { Name: "classes4_c" }
          },
          {
            field: { Name: "classes5_c" }
          },
          {
            field: { Name: "classes6_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "classes7_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Student API error:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error fetching students - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
      } else {
        console.error("Student service error:", error.message || 'Unknown error');
      }
      return [];
    }
  }

  async getById(id) {
try {
      if (!navigator.onLine) {
        console.error(`Network error fetching student ${id} - no internet connection`);
        return null;
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "class_ids_c" } },
          { field: { Name: "status_c" } },
          { 
            field: { Name: "classes_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "classes1_c" }
          },
          { 
            field: { Name: "classes2_c" }
          },
          { 
            field: { Name: "classes3_c" }
          },
          { 
            field: { Name: "classes4_c" }
          },
          { 
            field: { Name: "classes5_c" }
          },
          {
            field: { Name: "classes6_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "classes7_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error("Student API error:", response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error(`Network error fetching student ${id} - please check your internet connection`);
      } else if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Student service error for ID ${id}:`, error.message || 'Unknown error');
      }
      return null;
    }
  }
async create(studentData) {
    try {
      if (!navigator.onLine) {
        console.error("Network error creating student - no internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      }

      const params = {
        records: [{
          Name: studentData.Name || `${studentData.first_name_c} ${studentData.last_name_c}`,
          Tags: studentData.Tags || "",
          Owner: studentData.Owner ? parseInt(studentData.Owner) || null : null,
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          date_of_birth_c: studentData.date_of_birth_c,
          enrollment_date_c: studentData.enrollment_date_c,
          class_ids_c: studentData.class_ids_c || "",
          status_c: studentData.status_c || "active",
          classes_c: studentData.classes_c ? parseInt(studentData.classes_c) || null : null,
          classes1_c: studentData.classes1_c || null,
          classes2_c: studentData.classes2_c || null,
          classes3_c: studentData.classes3_c ? parseFloat(studentData.classes3_c) || null : null,
          classes4_c: studentData.classes4_c ? parseFloat(studentData.classes4_c) || null : null,
          classes5_c: studentData.classes5_c || null, // email field - direct string value
          // Handle lookup fields - convert to integer IDs
          classes6_c: studentData.classes6_c ? parseInt(studentData.classes6_c) || null : null,
          classes7_c: studentData.classes7_c ? parseInt(studentData.classes7_c) || null : null
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Student API error:", response.message);
        throw new Error(response.message || 'Failed to create student');
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create student records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error creating student - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
        throw error;
      } else {
        console.error("Student service create error:", error.message || 'Unknown error');
        throw error;
      }
    }
  }

async update(id, studentData) {
    try {
      if (!navigator.onLine) {
        console.error("Network error updating student - no internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      }

      const params = {
        records: [{
          Id: id,
          Name: studentData.Name || `${studentData.first_name_c} ${studentData.last_name_c}`,
          Tags: studentData.Tags,
          Owner: studentData.Owner ? parseInt(studentData.Owner) || null : null,
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          date_of_birth_c: studentData.date_of_birth_c,
          enrollment_date_c: studentData.enrollment_date_c,
          class_ids_c: studentData.class_ids_c,
          status_c: studentData.status_c,
          classes_c: studentData.classes_c ? parseInt(studentData.classes_c) || null : null,
          classes1_c: studentData.classes1_c || null,
          classes2_c: studentData.classes2_c || null,
          classes3_c: studentData.classes3_c ? parseFloat(studentData.classes3_c) || null : null,
          classes4_c: studentData.classes4_c ? parseFloat(studentData.classes4_c) || null : null,
          classes5_c: studentData.classes5_c || null, // email field - direct string value
          // Handle lookup fields - convert to integer IDs
          classes6_c: studentData.classes6_c ? parseInt(studentData.classes6_c) || null : null,
          classes7_c: studentData.classes7_c ? parseInt(studentData.classes7_c) || null : null
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Student API error:", response.message);
        throw new Error(response.message || 'Failed to update student');
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update student records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error updating student - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
        throw error;
      } else {
        console.error("Student service update error:", error.message || 'Unknown error');
        throw error;
      }
    }
  }

async delete(id) {
    try {
      if (!navigator.onLine) {
        console.error("Network error deleting student - no internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      }

      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Student API error:", response.message);
        throw new Error(response.message || 'Failed to delete student');
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete student records:${JSON.stringify(failedDeletions)}`);
        }
        
        return failedDeletions.length === 0;
      }
      
      return true;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error deleting student - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message);
        throw error;
      } else {
        console.error("Student service delete error:", error.message || 'Unknown error');
throw error;
      }
    }
  }

  async getByClassId(classId) {
    try {
      if (!navigator.onLine) {
        console.error("Network error fetching students by class - no internet connection");
        return [];
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "class_ids_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [
          {
            FieldName: "class_ids_c",
            Operator: "Contains",
            Values: [classId.toString()]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Student API error:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error fetching students by class - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching students by class:", error?.response?.data?.message);
      } else {
        console.error("Student service error by class:", error.message || 'Unknown error');
      }
      return [];
    }
  }
}

export const studentService = new StudentService();