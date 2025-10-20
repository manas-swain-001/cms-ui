import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useGlobalContext } from 'context';

const Sidebar = ({ isCollapsed = false, onToggle }) => {

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced'); // synced, syncing, offline
  const location = useLocation();
  const navigate = useNavigate();
  const { userRoleContext: userRole } = useGlobalContext();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/main-dashboard',
      icon: 'LayoutDashboard',
      roles: ['admin', 'manager', 'employee', 'sales', 'field'],
      badge: null
    },
    {
      label: 'Attendance',
      path: '/attendance-management',
      icon: 'Clock',
      roles: ['admin', 'manager', 'employee', 'sales', 'field'],
      badge: syncStatus === 'syncing' ? 'sync' : null
    },
    {
      label: 'Tasks',
      path: '/task-compliance-tracking',
      icon: 'CheckSquare',
      roles: ['admin', 'manager', 'employee'],
      badge: 3 // pending tasks count
    },
    {
      label: 'Administration',
      path: '/control-panel-settings',
      icon: 'Settings',
      roles: ['admin'],
      badge: null
    },
    {
      label: 'Profile',
      path: '/user-profile-management',
      icon: 'User',
      roles: ['admin', 'manager', 'employee', 'sales', 'field'],
      badge: null
    },
    {
      label: 'Manage Employees',
      path: '/manage-employees',
      icon: 'Users',
      roles: ['admin'],
      badge: null
    },
    {
      label: 'SMS',
      path: '/sms',
      icon: 'MessageCircle',
      roles: ['admin'],
      badge: null
    }
  ];

  // Filter navigation items based on user role
  const visibleItems = navigationItems?.filter(item =>
    item?.roles?.includes(userRole)
  );

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location?.pathname]);

  // Mock sync status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ['synced', 'syncing', 'offline'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setSyncStatus(randomStatus);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActive = (path) => {
    return location?.pathname === path;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-admin';
      case 'employee': return 'text-employee';
      case 'sales': return 'text-sales';
      default: return 'text-primary';
    }
  };

  const getSyncIcon = (status) => {
    switch (status) {
      case 'syncing': return 'RefreshCw';
      case 'offline': return 'WifiOff';
      default: return 'Check';
    }
  };

  const getSyncColor = (status) => {
    switch (status) {
      case 'syncing': return 'text-warning';
      case 'offline': return 'text-error';
      default: return 'text-success';
    }
  };

  const renderBadge = (badge) => {
    if (!badge) return null;

    if (badge === 'sync') {
      return (
        <div className={`flex items-center space-x-1 ${getSyncColor(syncStatus)}`}>
          <Icon
            name={getSyncIcon(syncStatus)}
            size={12}
            className={syncStatus === 'syncing' ? 'animate-spin' : ''}
          />
        </div>
      );
    }

    if (typeof badge === 'number') {
      return (
        <span className="bg-error text-error-foreground text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
          {badge > 99 ? '99+' : badge}
        </span>
      );
    }

    return null;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center px-4 py-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} className="text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold text-foreground">SmartXAlgo</h1>
              <p className="text-xs text-muted-foreground">CRM Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {visibleItems?.map((item) => (
          <button
            key={item?.path}
            onClick={() => handleNavigation(item?.path)}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive(item?.path)
              ? `bg-primary text-primary-foreground ${getRoleColor(userRole)}`
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
          >
            <div className="flex items-center space-x-3">
              <Icon
                name={item?.icon}
                size={20}
                className={isActive(item?.path) ? 'text-primary-foreground' : ''}
              />
              {!isCollapsed && (
                <span>{item?.label}</span>
              )}
            </div>
            {!isCollapsed && renderBadge(item?.badge)}
          </button>
        ))}
      </nav>

      {/* Sync Status Indicator */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">System Status</span>
            <div className={`flex items-center space-x-1 ${getSyncColor(syncStatus)}`}>
              <Icon
                name={getSyncIcon(syncStatus)}
                size={12}
                className={syncStatus === 'syncing' ? 'animate-spin' : ''}
              />
              <span className="capitalize">{syncStatus}</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle (Desktop) */}
      <div className="hidden lg:block px-4 py-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center"
        >
          <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={16} />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-300 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border z-300 transform transition-transform duration-300 lg:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)] bg-card border-r border-border z-100 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
        }`}>
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-300 lg:hidden"
      >
        <Icon name="Menu" size={20} />
      </Button>
    </>
  );
};

export default Sidebar;