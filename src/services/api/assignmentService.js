import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData];
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.assignments];
  }

  async getById(id) {
    await this.delay();
    const assignment = this.assignments.find(a => a.Id === id);
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  }

  async getByClassId(classId) {
    await this.delay();
    return this.assignments.filter(a => a.classId === classId).map(a => ({ ...a }));
  }

  async create(assignmentData) {
    await this.delay();
    const maxId = Math.max(...this.assignments.map(a => a.Id), 0);
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1
    };
    this.assignments.push(newAssignment);
    return { ...newAssignment };
  }

  async update(id, assignmentData) {
    await this.delay();
    const index = this.assignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    const updatedAssignment = {
      ...this.assignments[index],
      ...assignmentData,
      Id: id
    };
    
    this.assignments[index] = updatedAssignment;
    return { ...updatedAssignment };
  }

  async delete(id) {
    await this.delay();
    const index = this.assignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    const deletedAssignment = this.assignments.splice(index, 1)[0];
    return { ...deletedAssignment };
  }
}

export const assignmentService = new AssignmentService();