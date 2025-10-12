import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPanel = ({ userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock notifications based on user role
  useEffect(() => {
    const generateNotifications = () => {
      const baseNotifications = [
        {
          id: 1,
          type: 'attendance',
          title: 'Attendance Alert',
          message: '5 employees are late for check-in today',
          time: new Date(Date.now() - 120000),
          priority: 'medium',
          unread: true,
          roles: ['admin', 'manager']
        },
        {
          id: 2,
          type: 'task',
          title: 'Task Deadline',
          message: 'Evening slot task update deadline in 2 hours',
          time: new Date(Date.now() - 300000),
          priority: 'high',
          unread: true,
          roles: ['developer', 'manager']
        },
        {
          id: 3,
          type: 'system',
          title: 'System Maintenance',
          message: 'Biometric system maintenance scheduled for tonight',
          time: new Date(Date.now() - 900000),
          priority: 'low',
          unread: false,
          roles: ['admin']
        },
        {
          id: 4,
          type: 'sales',
          title: 'Lead Follow-up',
          message: '3 leads require immediate follow-up',
          time: new Date(Date.now() - 1800000),
          priority: 'high',
          unread: true,
          roles: ['sales', 'manager']
        },
        {
          id: 5,
          type: 'field',
          title: 'Visit Reminder',
          message: 'Scheduled visit to ABC Corp in 30 minutes',
          time: new Date(Date.now() - 600000),
          priority: 'medium',
          unread: true,
          roles: ['field', 'manager']
        },
        {
          id: 6,
          type: 'approval',
          title: 'Pending Approval',
          message: '2 attendance exceptions require your approval',
          time: new Date(Date.now() - 3600000),
          priority: 'medium',
          unread: true,
          roles: ['manager', 'admin']
        }
      ];

      return baseNotifications?.filter(notification => 
        notification?.roles?.includes(userRole)
      );
    };

    setNotifications(generateNotifications());
  }, [userRole]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'attendance': return 'Clock';
      case 'task': return 'CheckSquare';
      case 'system': return 'Settings';
      case 'sales': return 'TrendingUp';
      case 'field': return 'MapPin';
      case 'approval': return 'UserCheck';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    if (priority === 'medium') return 'text-warning';
    
    switch (type) {
      case 'attendance': return 'text-warning';
      case 'task': return 'text-primary';
      case 'system': return 'text-muted-foreground';
      case 'sales': return 'text-sales';
      case 'field': return 'text-field';
      case 'approval': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <div className="w-2 h-2 bg-error rounded-full" />;
      case 'medium':
        return <div className="w-2 h-2 bg-warning rounded-full" />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return timestamp?.toLocaleDateString();
  };

  const handleNotificationClick = (notificationId) => {
    setNotifications(prev => 
      prev?.map(notification => 
        notification?.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const unreadCount = notifications?.filter(n => n?.unread)?.length;
  const displayNotifications = isExpanded ? notifications : notifications?.slice(0, 3);

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center relative">
            <Icon name="Bell" size={20} className="text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Recent alerts & updates</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
        </Button>
      </div>
      <div className="space-y-3 mb-4">
        {displayNotifications?.length > 0 ? (
          displayNotifications?.map((notification) => (
            <button
              key={notification?.id}
              onClick={() => handleNotificationClick(notification?.id)}
              className={`w-full p-3 text-left rounded-lg transition-colors duration-200 hover:bg-muted/50 ${
                notification?.unread ? 'bg-muted/30' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  notification?.priority === 'high' ? 'bg-error/10' :
                  notification?.priority === 'medium' ? 'bg-warning/10' : 'bg-muted'
                }`}>
                  <Icon 
                    name={getNotificationIcon(notification?.type)} 
                    size={14} 
                    className={getNotificationColor(notification?.type, notification?.priority)} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {notification?.title}
                    </p>
                    <div className="flex items-center space-x-2 ml-2">
                      {getPriorityBadge(notification?.priority)}
                      {notification?.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notification?.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(notification?.time)}
                  </p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Bell" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        )}
      </div>
      {notifications?.length > 3 && (
        <div className="flex justify-between items-center pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {isExpanded ? 'Showing all' : `${notifications?.length - 3} more`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'View All'}
          </Button>
        </div>
      )}
      {unreadCount > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => setNotifications(prev => prev?.map(n => ({ ...n, unread: false })))}
          >
            Mark All as Read
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;