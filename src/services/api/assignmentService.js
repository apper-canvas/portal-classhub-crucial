class AssignmentService {
constructor() {
    this.tableName = 'assignment_c';
    this.initializeClient();
  }

  initializeClient() {
    try {
      if (!window.ApperSDK) {
        console.warn('Apper SDK not available');
        this.apperClient = null;
        return;
      }

      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
      this.apperClient = null;
    }
  }

  isClientReady() {
    if (!this.apperClient) {
      this.initializeClient();
    }
    return !!this.apperClient && navigator.onLine;
  }

async getAll() {
    try {
      if (!this.isClientReady()) {
        console.warn('Assignment service not ready - network or SDK unavailable');
        return [];
      }

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
        console.error('Assignment API error:', response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error fetching assignments - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
      } else {
        console.error('Assignment service error:', error.message || 'Unknown error');
      }
      return [];
    }
  }

async getById(id) {
    try {
      if (!this.isClientReady()) {
        console.warn('Assignment service not ready - network or SDK unavailable');
        return null;
      }

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
        console.error('Assignment API error:', response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error(`Network error fetching assignment ${id} - please check your internet connection`);
      } else if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Assignment service error for ID ${id}:`, error.message || 'Unknown error');
      }
      return null;
    }
  }

async getByClassId(classId) {
    try {
      if (!this.isClientReady()) {
        console.warn('Assignment service not ready - network or SDK unavailable');
        return [];
      }

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
        console.error('Assignment API error:', response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error fetching assignments by class - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching assignments by class:", error?.response?.data?.message);
      } else {
        console.error('Assignment service error by class:', error.message || 'Unknown error');
      }
      return [];
    }
  }

async create(assignmentData) {
    try {
      if (!this.isClientReady()) {
        console.warn('Assignment service not ready - network or SDK unavailable');
        throw new Error('Unable to create assignment - network or service unavailable');
      }

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
        console.error('Assignment API error:', response.message);
        throw new Error(response.message || 'Failed to create assignment');
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
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error creating assignment - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
        throw error;
      } else {
        console.error('Assignment service create error:', error.message || 'Unknown error');
        throw error;
      }
    }
  }

async update(id, assignmentData) {
    try {
      if (!this.isClientReady()) {
        console.warn('Assignment service not ready - network or SDK unavailable');
        throw new Error('Unable to update assignment - network or service unavailable');
      }

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
        console.error('Assignment API error:', response.message);
        throw new Error(response.message || 'Failed to update assignment');
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
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error updating assignment - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
        throw error;
      } else {
        console.error('Assignment service update error:', error.message || 'Unknown error');
        throw error;
      }
    }
  }

async delete(id) {
    try {
      if (!this.isClientReady()) {
        console.warn('Assignment service not ready - network or SDK unavailable');
        throw new Error('Unable to delete assignment - network or service unavailable');
      }

      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error('Assignment API error:', response.message);
        throw new Error(response.message || 'Failed to delete assignment');
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
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error deleting assignment - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
        throw error;
      } else {
        console.error('Assignment service delete error:', error.message || 'Unknown error');
        throw error;
      }
    }
  }

async checkDueSoon(daysAhead = 7) {
    try {
      if (!this.isClientReady()) {
        console.warn('Assignment service not ready - network or SDK unavailable');
        return [];
      }

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
        console.error('Assignment API error:', response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error checking due assignments - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error checking due assignments:", error?.response?.data?.message);
      } else {
        console.error('Assignment service checkDueSoon error:', error.message || 'Unknown error');
      }
      return [];
    }
  }
}

export const assignmentService = new AssignmentService();