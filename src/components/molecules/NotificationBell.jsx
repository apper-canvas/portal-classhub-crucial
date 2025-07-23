import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.Id);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      default: return 'text-info';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <ApperIcon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-primary-900">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-secondary-400">
                  <ApperIcon name="Bell" size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.Id}
                    className={cn(
                      "p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors",
                      !notification.read && "bg-blue-50"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <ApperIcon
                            name={notification.type === 'assignment_due' ? 'Clock' : 'Info'}
                            size={14}
                            className={getPriorityColor(notification.priority)}
                          />
                          <h4 className="font-medium text-sm text-primary-900">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-info rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-secondary-400 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-secondary-400">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.Id);
                        }}
                        className="p-1 hover:bg-gray-200"
                      >
                        <ApperIcon name="X" size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {notifications.length > 10 && (
              <div className="p-3 border-t border-gray-100 text-center">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all notifications
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;