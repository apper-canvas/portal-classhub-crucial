class AttendanceService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'attendance_c';
  }

async getAll() {
    try {
      if (!navigator.onLine) {
        console.error("Network error fetching attendance - no internet connection");
        return [];
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Attendance API error:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error fetching attendance - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message);
      } else {
        console.error("Attendance service error:", error.message || 'Unknown error');
      }
      return [];
    }
  }

  async getById(id) {
try {
      if (!navigator.onLine) {
        console.error(`Network error fetching attendance ${id} - no internet connection`);
        return null;
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error("Attendance API error:", response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error(`Network error fetching attendance ${id} - please check your internet connection`);
      } else if (error?.response?.data?.message) {
        console.error(`Error fetching attendance with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Attendance service error for ID ${id}:`, error.message || 'Unknown error');
      }
      return null;
    }
  }

  async getByStudentId(studentId) {
try {
      if (!navigator.onLine) {
        console.error("Network error fetching attendance by student - no internet connection");
        return [];
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } }
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
        console.error("Attendance API error:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error fetching attendance by student - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching attendance by student:", error?.response?.data?.message);
      } else {
        console.error("Attendance service error by student:", error.message || 'Unknown error');
      }
      return [];
    }
  }

async getByClassId(classId) {
    try {
      if (!navigator.onLine) {
        console.error("Network error fetching attendance by class - no internet connection");
        return [];
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } }
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
        console.error("Attendance API error:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error fetching attendance by class - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching attendance by class:", error?.response?.data?.message);
      } else {
        console.error("Attendance service error by class:", error.message || 'Unknown error');
      }
      return [];
    }
  }

  async getByDate(date) {
try {
      if (!navigator.onLine) {
        console.error("Network error fetching attendance by date - no internet connection");
        return [];
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [date]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Attendance API error:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error fetching attendance by date - please check your internet connection");
      } else if (error?.response?.data?.message) {
        console.error("Error fetching attendance by date:", error?.response?.data?.message);
      } else {
        console.error("Attendance service error by date:", error.message || 'Unknown error');
      }
      return [];
    }
  }

  async create(attendanceData) {
try {
      if (!navigator.onLine) {
        console.error("Network error creating attendance - no internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      }

      const params = {
        records: [{
          Name: attendanceData.Name || `Attendance for ${attendanceData.date_c || attendanceData.date}`,
          Tags: attendanceData.Tags || "",
          Owner: attendanceData.Owner ? parseInt(attendanceData.Owner) || null : null,
          student_id_c: attendanceData.student_id_c || attendanceData.studentId ? 
            parseInt(attendanceData.student_id_c || attendanceData.studentId) || null : null,
          class_id_c: attendanceData.class_id_c || attendanceData.classId ? 
            parseInt(attendanceData.class_id_c || attendanceData.classId) || null : null,
          date_c: attendanceData.date_c || attendanceData.date,
          status_c: attendanceData.status_c || attendanceData.status
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Attendance API error:", response.message);
        throw new Error(response.message || 'Failed to create attendance');
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create attendance records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error creating attendance - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error creating attendance:", error?.response?.data?.message);
        throw error;
      } else {
        console.error("Attendance service create error:", error.message || 'Unknown error');
        throw error;
      }
    }
  }

async update(id, attendanceData) {
    try {
      if (!navigator.onLine) {
        console.error("Network error updating attendance - no internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      }

      const params = {
        records: [{
          Id: id,
          Name: attendanceData.Name || `Attendance for ${attendanceData.date_c || attendanceData.date}`,
          Tags: attendanceData.Tags,
          Owner: attendanceData.Owner ? parseInt(attendanceData.Owner) || null : null,
          student_id_c: attendanceData.student_id_c || attendanceData.studentId ? 
            parseInt(attendanceData.student_id_c || attendanceData.studentId) || null : null,
          class_id_c: attendanceData.class_id_c || attendanceData.classId ? 
            parseInt(attendanceData.class_id_c || attendanceData.classId) || null : null,
          date_c: attendanceData.date_c || attendanceData.date,
          status_c: attendanceData.status_c || attendanceData.status
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Attendance API error:", response.message);
        throw new Error(response.message || 'Failed to update attendance');
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update attendance records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error updating attendance - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error updating attendance:", error?.response?.data?.message);
        throw error;
      } else {
        console.error("Attendance service update error:", error.message || 'Unknown error');
        throw error;
      }
    }
  }

async delete(id) {
    try {
      if (!navigator.onLine) {
        console.error("Network error deleting attendance - no internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      }

      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Attendance API error:", response.message);
        throw new Error(response.message || 'Failed to delete attendance');
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete attendance records:${JSON.stringify(failedDeletions)}`);
        }
        
        return failedDeletions.length === 0;
      }
      
      return true;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error deleting attendance - please check your internet connection");
        throw new Error('Network error - please check your internet connection and try again');
      } else if (error?.response?.data?.message) {
        console.error("Error deleting attendance:", error?.response?.data?.message);
        throw error;
      } else {
        console.error("Attendance service delete error:", error.message || 'Unknown error');
        throw error;
      }
    }
  }
}

export const attendanceService = new AttendanceService();