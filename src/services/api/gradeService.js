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
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
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
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getByStudentId(studentId) {
    try {
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
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByAssignmentId(assignmentId) {
    try {
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
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(gradeData) {
    try {
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
        console.error(response.message);
        return null;
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
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, gradeData) {
    try {
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
        console.error(response.message);
        return null;
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
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
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
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const gradeService = new GradeService();