class ClassService {
  constructor() {
    // Check if ApperSDK is available
    if (typeof window === 'undefined' || !window.ApperSDK) {
      console.error('Apper SDK not loaded. Please ensure the SDK script is included in index.html');
      throw new Error('Apper SDK not available. Network operations will fail.');
    }
    
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'class_c';
  }

async getAll() {
    try {
      if (!navigator.onLine) {
        console.error("Network error fetching classes - no internet connection");
        return [];
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "period_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "student_ids_c" } },
          { field: { Name: "fee_c" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Class API error:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error fetching classes - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching classes:", error?.response?.data?.message);
      } else {
        console.error("Class service error:", error.message || 'Unknown error');
      }
      return [];
    }
  }

  async getById(id) {
try {
      if (!navigator.onLine) {
        console.error(`Network error fetching class ${id} - no internet connection`);
        return null;
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "period_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "student_ids_c" } },
          { field: { Name: "fee_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error("Class API error:", response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error(`Network error fetching class ${id} - please check your internet connection`);
      } else if (error?.response?.data?.message) {
        console.error(`Error fetching class with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Class service error for ID ${id}:`, error.message || 'Unknown error');
      }
      return null;
    }
  }

async create(classData) {
    try {
      if (!navigator.onLine) {
        console.error("Network error creating class - no internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      }

      const params = {
        records: [{
          Name: classData.Name,
          Tags: classData.Tags || "",
          Owner: parseInt(classData.Owner) || null,
          subject_c: classData.subject_c,
          period_c: classData.period_c,
          room_c: classData.room_c,
          student_ids_c: classData.student_ids_c || "",
          fee_c: parseInt(classData.fee_c) || 0
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Class API error:", response.message);
        throw new Error(response.message || 'Failed to create class');
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create class records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error creating class - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error creating class:", error?.response?.data?.message);
        throw error;
      } else {
        console.error("Class service create error:", error.message || 'Unknown error');
        throw error;
      }
    }
  }

async update(id, classData) {
    try {
      if (!navigator.onLine) {
        console.error("Network error updating class - no internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      }

      const params = {
        records: [{
          Id: id,
          Name: classData.Name,
          Tags: classData.Tags,
          Owner: classData.Owner ? parseInt(classData.Owner) || null : null,
          subject_c: classData.subject_c,
          period_c: classData.period_c,
          room_c: classData.room_c,
          student_ids_c: classData.student_ids_c,
          fee_c: classData.fee_c ? parseFloat(classData.fee_c) || 0 : null
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Class API error:", response.message);
        throw new Error(response.message || 'Failed to update class');
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update class records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error updating class - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error updating class:", error?.response?.data?.message);
        throw error;
      } else {
        console.error("Class service update error:", error.message || 'Unknown error');
        throw error;
      }
    }
  }

async delete(id) {
    try {
      if (!navigator.onLine) {
        console.error("Network error deleting class - no internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      }

      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Class API error:", response.message);
        throw new Error(response.message || 'Failed to delete class');
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete class records:${JSON.stringify(failedDeletions)}`);
        }
        
        return failedDeletions.length === 0;
      }
      
      return true;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error deleting class - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error deleting class:", error?.response?.data?.message);
        throw error;
      } else {
        console.error("Class service delete error:", error.message || 'Unknown error');
        throw error;
      }
    }
  }
}

export const classService = new ClassService();