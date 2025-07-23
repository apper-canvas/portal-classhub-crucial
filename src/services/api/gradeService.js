import gradesData from "@/services/mockData/grades.json";

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.grades];
  }

  async getById(id) {
    await this.delay();
    const grade = this.grades.find(g => g.Id === id);
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  }

  async getByStudentId(studentId) {
    await this.delay();
    return this.grades.filter(g => g.studentId === studentId).map(g => ({ ...g }));
  }

  async getByAssignmentId(assignmentId) {
    await this.delay();
    return this.grades.filter(g => g.assignmentId === assignmentId).map(g => ({ ...g }));
  }

  async create(gradeData) {
    await this.delay();
    const maxId = Math.max(...this.grades.map(g => g.Id), 0);
    const newGrade = {
      ...gradeData,
      Id: maxId + 1
    };
    this.grades.push(newGrade);
    return { ...newGrade };
  }

  async update(id, gradeData) {
    await this.delay();
    const index = this.grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    const updatedGrade = {
      ...this.grades[index],
      ...gradeData,
      Id: id
    };
    
    this.grades[index] = updatedGrade;
    return { ...updatedGrade };
  }

  async delete(id) {
    await this.delay();
    const index = this.grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    const deletedGrade = this.grades.splice(index, 1)[0];
    return { ...deletedGrade };
  }
}

export const gradeService = new GradeService();