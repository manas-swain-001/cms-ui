import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isOfficeDropdownOpen, setIsOfficeDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState('New York Office');
  const [notificationCount, setNotificationCount] = useState(3);
  
  const officeDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const location = useLocation();

  // Mock user data - in real app this would come from auth context
  const user = {
    name: 'John Smith',
    role: 'System Administrator',
    avatar: '/assets/images/avatar.jpg',
    email: 'john.smith@smartxalgo.com'
  };

  const offices = [
    { id: 1, name: 'New York Office', address: '123 Broadway, NY 10001', status: 'active' },
    { id: 2, name: 'Los Angeles Office', address: '456 Sunset Blvd, LA 90028', status: 'active' },
    { id: 3, name: 'Chicago Office', address: '789 Michigan Ave, Chicago 60611', status: 'active' },
    { id: 4, name: 'Miami Office', address: '321 Ocean Drive, Miami 33139', status: 'maintenance' }
  ];

  const notifications = [
    {
      id: 1,
      type: 'attendance',
      title: 'Attendance Alert',
      message: '5 employees are late for check-in',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'task',
      title: 'Task Compliance',
      message: 'Development team has 3 overdue tasks',
      time: '15 minutes ago',
      unread: true
    },
    {
      id: 3,
      type: 'system',
      title: 'System Update',
      message: 'Biometric system maintenance scheduled',
      time: '1 hour ago',
      unread: false
    }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (officeDropdownRef?.current && !officeDropdownRef?.current?.contains(event?.target)) {
        setIsOfficeDropdownOpen(false);
      }
      if (userDropdownRef?.current && !userDropdownRef?.current?.contains(event?.target)) {
        setIsUserDropdownOpen(false);
      }
      if (notificationRef?.current && !notificationRef?.current?.contains(event?.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOfficeSelect = (office) => {
    setSelectedOffice(office?.name);
    setIsOfficeDropdownOpen(false);
  };

  const handleNotificationClick = (notification) => {
    if (notification?.unread) {
      setNotificationCount(prev => Math.max(0, prev - 1));
    }
    setIsNotificationOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'attendance': return 'Clock';
      case 'task': return 'CheckSquare';
      case 'system': return 'Settings';
      default: return 'Bell';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-200">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Office Selector */}
        <div className="flex items-center space-x-4">
          <div className="relative" ref={officeDropdownRef}>
            <Button
              variant="ghost"
              onClick={() => setIsOfficeDropdownOpen(!isOfficeDropdownOpen)}
              className="flex items-center space-x-2 text-sm font-medium"
            >
              <Icon name="Building2" size={16} />
              <span>{selectedOffice}</span>
              <Icon name="ChevronDown" size={14} />
            </Button>

            {isOfficeDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg animate-fade-in">
                <div className="p-3 border-b border-border">
                  <h3 className="text-sm font-medium text-foreground">Select Office Location</h3>
                </div>
                <div className="py-2">
                  {offices?.map((office) => (
                    <button
                      key={office?.id}
                      onClick={() => handleOfficeSelect(office)}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors duration-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-foreground">{office?.name}</div>
                        <div className="text-xs text-muted-foreground">{office?.address}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${office?.status === 'active' ? 'bg-success' : 'bg-warning'}`} />
                        {selectedOffice === office?.name && (
                          <Icon name="Check" size={14} className="text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Notifications and User */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>

            {isNotificationOpen && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-popover border border-border rounded-lg shadow-lg animate-fade-in">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">Notifications</h3>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Mark all read
                    </Button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <button
                      key={notification?.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full p-4 text-left hover:bg-muted transition-colors duration-200 border-b border-border last:border-b-0 ${
                        notification?.unread ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          notification?.type === 'attendance' ? 'bg-warning/10 text-warning' :
                          notification?.type === 'task'? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon name={getNotificationIcon(notification?.type)} size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground truncate">
                              {notification?.title}
                            </p>
                            {notification?.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full ml-2" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification?.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification?.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" fullWidth>
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userDropdownRef}>
            <Button
              variant="ghost"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-3 px-3 py-2"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {user?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-foreground">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.role}</div>
              </div>
              <Icon name="ChevronDown" size={14} />
            </Button>

            {isUserDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg animate-fade-in">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {user?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{user?.name}</div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                      <div className="text-xs text-primary font-medium">{user?.role}</div>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-200 flex items-center space-x-3">
                    <Icon name="User" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-200 flex items-center space-x-3">
                    <Icon name="Settings" size={16} />
                    <span>Preferences</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-200 flex items-center space-x-3">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                </div>
                <div className="py-2 border-t border-border">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-200 flex items-center space-x-3 text-error">
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;