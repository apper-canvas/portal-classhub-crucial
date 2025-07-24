class AssignmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'assignment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "total_points_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "class_id_c" } }
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
        console.error("Error fetching assignments:", error?.response?.data?.message);
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
          { field: { Name: "due_date_c" } },
          { field: { Name: "total_points_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "class_id_c" } }
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
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getByClassId(classId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "total_points_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "class_id_c" } }
        ],
        where: [
          {
            FieldName: "class_id_c",
            Operator: "EqualTo",
            Values: [parseInt(classId)]
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
        console.error("Error fetching assignments by class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(assignmentData) {
    try {
      const params = {
records: [{
          Name: assignmentData.Name || assignmentData.name,
          Tags: assignmentData.Tags || "",
          Owner: assignmentData.Owner ? parseInt(assignmentData.Owner) || null : null,
          due_date_c: assignmentData.due_date_c || assignmentData.dueDate,
          total_points_c: assignmentData.total_points_c || assignmentData.totalPoints ? 
            parseFloat(assignmentData.total_points_c || assignmentData.totalPoints) || 0 : 0,
          category_c: assignmentData.category_c || assignmentData.category,
          class_id_c: assignmentData.class_id_c || assignmentData.classId ? 
            parseInt(assignmentData.class_id_c || assignmentData.classId) || null : null
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
          console.error(`Failed to create assignment records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

async update(id, assignmentData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: assignmentData.Name || assignmentData.name,
          Tags: assignmentData.Tags,
          Owner: assignmentData.Owner ? parseInt(assignmentData.Owner) || null : null,
          due_date_c: assignmentData.due_date_c || assignmentData.dueDate,
          total_points_c: assignmentData.total_points_c || assignmentData.totalPoints ? 
            parseFloat(assignmentData.total_points_c || assignmentData.totalPoints) || 0 : 0,
          category_c: assignmentData.category_c || assignmentData.category,
          class_id_c: (assignmentData.class_id_c || assignmentData.classId) ? 
            parseInt(assignmentData.class_id_c || assignmentData.classId) || null : null
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
          console.error(`Failed to update assignment records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
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
          console.error(`Failed to delete assignment records:${JSON.stringify(failedDeletions)}`);
        }
        
        return failedDeletions.length === 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async checkDueSoon(daysAhead = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "total_points_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "class_id_c" } }
        ],
        where: [
          {
            FieldName: "due_date_c",
            Operator: "LessThanOrEqualTo",
            Values: [cutoffDate.toISOString().split("T")[0]]
          },
          {
            FieldName: "due_date_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [new Date().toISOString().split("T")[0]]
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
        console.error("Error checking due assignments:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
}

export const assignmentService = new AssignmentService();