import attendanceData from "@/services/mockData/attendance.json";

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.attendance];
  }

  async getById(id) {
    await this.delay();
    const record = this.attendance.find(a => a.Id === id);
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  }

  async getByStudentId(studentId) {
    await this.delay();
    return this.attendance.filter(a => a.studentId === studentId).map(a => ({ ...a }));
  }

  async getByClassId(classId) {
    await this.delay();
    return this.attendance.filter(a => a.classId === classId).map(a => ({ ...a }));
  }

  async getByDate(date) {
    await this.delay();
    return this.attendance.filter(a => a.date === date).map(a => ({ ...a }));
  }

  async create(attendanceData) {
    await this.delay();
    const maxId = Math.max(...this.attendance.map(a => a.Id), 0);
    const newRecord = {
      ...attendanceData,
      Id: maxId + 1
    };
    this.attendance.push(newRecord);
    return { ...newRecord };
  }

  async update(id, attendanceData) {
    await this.delay();
    const index = this.attendance.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    const updatedRecord = {
      ...this.attendance[index],
      ...attendanceData,
      Id: id
    };
    
    this.attendance[index] = updatedRecord;
    return { ...updatedRecord };
  }

  async delete(id) {
    await this.delay();
    const index = this.attendance.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    const deletedRecord = this.attendance.splice(index, 1)[0];
    return { ...deletedRecord };
  }
}

export const attendanceService = new AttendanceService();