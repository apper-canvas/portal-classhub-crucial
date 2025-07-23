import studentsData from "@/services/mockData/students.json";

class StudentService {
  constructor() {
    this.students = [...studentsData];
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.students];
  }

  async getById(id) {
    await this.delay();
    const student = this.students.find(s => s.Id === id);
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  }

  async create(studentData) {
    await this.delay();
    const maxId = Math.max(...this.students.map(s => s.Id), 0);
    const newStudent = {
      ...studentData,
      Id: maxId + 1
    };
    this.students.push(newStudent);
    return { ...newStudent };
  }

  async update(id, studentData) {
    await this.delay();
    const index = this.students.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    
    const updatedStudent = {
      ...this.students[index],
      ...studentData,
      Id: id
    };
    
    this.students[index] = updatedStudent;
    return { ...updatedStudent };
  }

  async delete(id) {
    await this.delay();
    const index = this.students.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    
    const deletedStudent = this.students.splice(index, 1)[0];
    return { ...deletedStudent };
  }

  async getByClassId(classId) {
    await this.delay();
    return this.students.filter(s => s.classIds?.includes(classId)).map(s => ({ ...s }));
  }
}

export const studentService = new StudentService();