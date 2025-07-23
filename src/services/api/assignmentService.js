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
// Reminder-related methods
  async addReminder(assignmentId, reminderData) {
    await this.delay();
    const assignment = this.assignments.find(a => a.Id === assignmentId);
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    
    if (!assignment.reminders) {
      assignment.reminders = [];
    }
    
    const maxId = assignment.reminders.length > 0 
      ? Math.max(...assignment.reminders.map(r => r.Id), 0) 
      : 0;
    
    const newReminder = {
      ...reminderData,
      Id: maxId + 1,
      assignmentId,
      createdAt: new Date().toISOString()
    };
    
    assignment.reminders.push(newReminder);
    return { ...newReminder };
  }
  
  async removeReminder(assignmentId, reminderId) {
    await this.delay();
    const assignment = this.assignments.find(a => a.Id === assignmentId);
    if (!assignment || !assignment.reminders) {
      throw new Error("Assignment or reminder not found");
    }
    
    const reminderIndex = assignment.reminders.findIndex(r => r.Id === reminderId);
    if (reminderIndex === -1) {
      throw new Error("Reminder not found");
    }
    
    const deletedReminder = assignment.reminders.splice(reminderIndex, 1)[0];
    return { ...deletedReminder };
  }
  
  async getAssignmentsWithReminders() {
    await this.delay();
    return this.assignments
      .filter(a => a.reminders && a.reminders.length > 0)
      .map(a => ({ ...a }));
  }
  
  async checkDueSoon(daysAhead = 7) {
    await this.delay();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
    
    return this.assignments
      .filter(a => {
        if (!a.dueDate) return false;
        const dueDate = new Date(a.dueDate);
        const today = new Date();
        return dueDate >= today && dueDate <= cutoffDate;
      })
      .map(a => ({ ...a }));
  }
}

export const assignmentService = new AssignmentService();