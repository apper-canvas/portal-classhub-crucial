class GradeService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'grade_c';
  }

async getAll() {
    try {
      if (!navigator.onLine) {
        console.error("Network error fetching grades - no internet connection");
        return [];
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Grade API error:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error fetching grades - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
      } else {
        console.error("Grade service error:", error.message || 'Unknown error');
      }
      return [];
    }
  }

  async getById(id) {
try {
      if (!navigator.onLine) {
        console.error(`Network error fetching grade ${id} - no internet connection`);
        return null;
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error("Grade API error:", response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error(`Network error fetching grade ${id} - please check your internet connection`);
      } else if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Grade service error for ID ${id}:`, error.message || 'Unknown error');
      }
      return null;
    }
  }

  async getByStudentId(studentId) {
try {
      if (!navigator.onLine) {
        console.error("Network error fetching grades by student - no internet connection");
        return [];
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } }
        ],
        where: [
          {
            FieldName: "student_id_c",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Grade API error:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error fetching grades by student - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching grades by student:", error?.response?.data?.message);
      } else {
        console.error("Grade service error by student:", error.message || 'Unknown error');
      }
      return [];
    }
  }

async getByAssignmentId(assignmentId) {
    try {
      if (!navigator.onLine) {
        console.error("Network error fetching grades by assignment - no internet connection");
        return [];
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } }
        ],
        where: [
          {
            FieldName: "assignment_id_c",
            Operator: "EqualTo",
            Values: [parseInt(assignmentId)]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Grade API error:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error fetching grades by assignment - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching grades by assignment:", error?.response?.data?.message);
      } else {
        console.error("Grade service error by assignment:", error.message || 'Unknown error');
      }
      return [];
    }
  }

  async create(gradeData) {
try {
      if (!navigator.onLine) {
        console.error("Network error creating grade - no internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      }

      const params = {
        records: [{
          Name: gradeData.Name || `Grade for Student ${gradeData.student_id_c || gradeData.studentId}`,
          Tags: gradeData.Tags || "",
          Owner: gradeData.Owner ? parseInt(gradeData.Owner) || null : null,
          student_id_c: gradeData.student_id_c || gradeData.studentId ? 
            parseInt(gradeData.student_id_c || gradeData.studentId) || null : null,
          assignment_id_c: gradeData.assignment_id_c || gradeData.assignmentId ? 
            parseInt(gradeData.assignment_id_c || gradeData.assignmentId) || null : null,
          score_c: gradeData.score_c || gradeData.score ? 
            parseFloat(gradeData.score_c || gradeData.score) || 0 : 0,
          submitted_date_c: gradeData.submitted_date_c || gradeData.submittedDate
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Grade API error:", response.message);
        throw new Error(response.message || 'Failed to create grade');
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create grade records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error creating grade - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
        throw error;
      } else {
        console.error("Grade service create error:", error.message || 'Unknown error');
        throw error;
      }
    }
  }

async update(id, gradeData) {
    try {
      if (!navigator.onLine) {
        console.error("Network error updating grade - no internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      }

      const params = {
        records: [{
          Id: id,
          Name: gradeData.Name || `Grade for Student ${gradeData.student_id_c || gradeData.studentId}`,
          Tags: gradeData.Tags,
          Owner: gradeData.Owner ? parseInt(gradeData.Owner) || null : null,
          student_id_c: gradeData.student_id_c || gradeData.studentId ? 
            parseInt(gradeData.student_id_c || gradeData.studentId) || null : null,
          assignment_id_c: gradeData.assignment_id_c || gradeData.assignmentId ? 
            parseInt(gradeData.assignment_id_c || gradeData.assignmentId) || null : null,
          score_c: gradeData.score_c || gradeData.score ? 
            parseFloat(gradeData.score_c || gradeData.score) || 0 : 0,
          submitted_date_c: gradeData.submitted_date_c || gradeData.submittedDate
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Grade API error:", response.message);
        throw new Error(response.message || 'Failed to update grade');
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update grade records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error updating grade - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
        throw error;
      } else {
        console.error("Grade service update error:", error.message || 'Unknown error');
        throw error;
      }
    }
  }

  async delete(id) {
try {
      if (!navigator.onLine) {
        console.error("Network error deleting grade - no internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      }

      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Grade API error:", response.message);
        throw new Error(response.message || 'Failed to delete grade');
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete grade records:${JSON.stringify(failedDeletions)}`);
        }
        
        return failedDeletions.length === 0;
      }
      
      return true;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error deleting grade - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
        throw error;
      } else {
        console.error("Grade service delete error:", error.message || 'Unknown error');
        throw error;
      }
    }
  }
}

export const gradeService = new GradeService();