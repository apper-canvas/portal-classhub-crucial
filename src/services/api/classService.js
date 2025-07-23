import classesData from "@/services/mockData/classes.json";

class ClassService {
  constructor() {
    this.classes = [...classesData];
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.classes];
  }

  async getById(id) {
    await this.delay();
    const classItem = this.classes.find(c => c.Id === id);
    if (!classItem) {
      throw new Error("Class not found");
    }
    return { ...classItem };
  }

  async create(classData) {
    await this.delay();
    const maxId = Math.max(...this.classes.map(c => c.Id), 0);
    const newClass = {
      ...classData,
      Id: maxId + 1,
      studentIds: classData.studentIds || []
    };
    this.classes.push(newClass);
    return { ...newClass };
  }

  async update(id, classData) {
    await this.delay();
    const index = this.classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    
    const updatedClass = {
      ...this.classes[index],
      ...classData,
      Id: id
    };
    
    this.classes[index] = updatedClass;
    return { ...updatedClass };
  }

  async delete(id) {
    await this.delay();
    const index = this.classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    
    const deletedClass = this.classes.splice(index, 1)[0];
    return { ...deletedClass };
  }
}

export const classService = new ClassService();