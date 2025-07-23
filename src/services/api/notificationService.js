class NotificationService {
  constructor() {
    this.storageKey = 'classhub_notifications';
    this.notifications = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.notifications];
  }

  async getUnread() {
    await this.delay();
    return this.notifications.filter(n => !n.read).map(n => ({ ...n }));
  }

  async create(notificationData) {
    await this.delay();
    const maxId = this.notifications.length > 0 
      ? Math.max(...this.notifications.map(n => n.Id), 0) 
      : 0;

    const newNotification = {
      ...notificationData,
      Id: maxId + 1,
      read: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.unshift(newNotification);
    this.saveToStorage();
    return { ...newNotification };
  }

  async markAsRead(id) {
    await this.delay();
    const notification = this.notifications.find(n => n.Id === id);
    if (!notification) {
      throw new Error("Notification not found");
    }

    notification.read = true;
    this.saveToStorage();
    return { ...notification };
  }

  async markAllAsRead() {
    await this.delay();
    this.notifications.forEach(n => n.read = true);
    this.saveToStorage();
    return true;
  }

  async delete(id) {
    await this.delay();
    const index = this.notifications.findIndex(n => n.Id === id);
    if (index === -1) {
      throw new Error("Notification not found");
    }

    const deletedNotification = this.notifications.splice(index, 1)[0];
    this.saveToStorage();
    return { ...deletedNotification };
  }

  async deleteAll() {
    await this.delay();
    this.notifications = [];
    this.saveToStorage();
    return true;
  }
}

export const notificationService = new NotificationService();