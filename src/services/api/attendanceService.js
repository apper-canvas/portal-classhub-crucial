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
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message);
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
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } }
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
        console.error(`Error fetching attendance with ID ${id}:`, error?.response?.data?.message);
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
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByClassId(classId) {
    try {
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
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByDate(date) {
    try {
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
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by date:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(attendanceData) {
    try {
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
        console.error(response.message);
        return null;
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
      if (error?.response?.data?.message) {
        console.error("Error creating attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, attendanceData) {
    try {
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
        console.error(response.message);
        return null;
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
      if (error?.response?.data?.message) {
        console.error("Error updating attendance:", error?.response?.data?.message);
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
          console.error(`Failed to delete attendance records:${JSON.stringify(failedDeletions)}`);
        }
        
        return failedDeletions.length === 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const attendanceService = new AttendanceService();