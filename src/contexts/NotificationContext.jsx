import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { notificationService } from '@/services/api/notificationService';
import { assignmentService } from '@/services/api/assignmentService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [serviceError, setServiceError] = useState(false);
  useEffect(() => {
    loadNotifications();
    
    // Check for due assignments every 5 minutes
    const interval = setInterval(checkDueAssignments, 5 * 60 * 1000);
    
    // Initial check after 10 seconds
    setTimeout(checkDueAssignments, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
try {
      const allNotifications = await notificationService.getAll();
      const unread = allNotifications.filter(n => !n.read);
      
      setNotifications(allNotifications);
      setUnreadCount(unread.length);
      setServiceError(false);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setServiceError(true);
    } finally {
      setLoading(false);
    }
  };

  const checkDueAssignments = async () => {
try {
      // Only check due assignments if the service is available
      if (!navigator.onLine) {
        console.warn('Offline - skipping assignment due check');
        return;
      }

      const dueSoon = await assignmentService.checkDueSoon(3); // Check 3 days ahead
      const today = new Date().toDateString();
      
      // If no assignments returned (possibly due to network issues), fail gracefully
      if (!Array.isArray(dueSoon)) {
        console.warn('Assignment service returned invalid data');
        return;
      }
      
      for (const assignment of dueSoon) {
        try {
          // Check if we already have a notification for this assignment today
          const existingNotification = notifications.find(n => 
            n.type === 'assignment_due' && 
            n.assignmentId === assignment.Id &&
            new Date(n.createdAt).toDateString() === today
          );
          
          if (!existingNotification) {
            const dueDate = new Date(assignment.due_date_c || assignment.dueDate);
            const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
            
            let message;
            if (daysUntilDue === 0) {
              message = `Assignment "${assignment.Name || assignment.name}" is due today!`;
            } else if (daysUntilDue === 1) {
              message = `Assignment "${assignment.Name || assignment.name}" is due tomorrow!`;
            } else {
              message = `Assignment "${assignment.Name || assignment.name}" is due in ${daysUntilDue} days.`;
            }
            
            await addNotification({
              type: 'assignment_due',
              title: 'Assignment Due Soon',
              message,
              assignmentId: assignment.Id,
              priority: daysUntilDue <= 1 ? 'high' : 'medium'
            });
          }
        } catch (notificationError) {
          console.error('Error processing assignment notification:', notificationError);
          // Continue with other assignments even if one fails
        }
      }
    } catch (error) {
      if (error.message?.includes('network') || error.message?.includes('Network')) {
        console.warn('Network error checking due assignments - will retry later');
      } else {
        console.error('Error checking due assignments:', error);
      }
    }
  };

  const addNotification = async (notificationData) => {
    try {
      const newNotification = await notificationService.create(notificationData);
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      if (notificationData.priority === 'high') {
        toast.error(notificationData.message);
      } else {
        toast.info(notificationData.message);
      }
      
      return newNotification;
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.Id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.delete(notificationId);
      setNotifications(prev => prev.filter(n => n.Id !== notificationId));
      
      // Update unread count
      const wasUnread = notifications.find(n => n.Id === notificationId && !n.read);
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

const value = {
    notifications,
    unreadCount,
    loading,
    serviceError,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};