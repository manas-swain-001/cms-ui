import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Route mapping for breadcrumb generation
  const routeMap = {
    '/main-dashboard': { label: 'Dashboard', parent: null },
    '/attendance-management': { label: 'Attendance Management', parent: '/main-dashboard' },
    '/task-compliance-tracking': { label: 'Task Compliance', parent: '/main-dashboard' },
    '/control-panel-settings': { label: 'Administration', parent: '/main-dashboard' },
    '/user-profile-management': { label: 'Profile Settings', parent: '/main-dashboard' },
    '/login-authentication': { label: 'Authentication', parent: null },
    '/manage-employees': { label: 'Manage Employees', parent: '/main-dashboard' },
    '/sms': { label: 'SMS', parent: '/main-dashboard' }
  };

  const generateBreadcrumbs = () => {
    const currentPath = location?.pathname;
    const breadcrumbs = [];
    
    // Build breadcrumb chain
    let path = currentPath;
    while (path && routeMap?.[path]) {
      const route = routeMap?.[path];
      breadcrumbs?.unshift({
        label: route?.label,
        path: path,
        isActive: path === currentPath
      });
      path = route?.parent;
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on login page or if only one item
  if (location?.pathname === '/login-authentication' || breadcrumbs?.length <= 1) {
    return null;
  }

  const handleNavigation = (path) => {
    if (path !== location?.pathname) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={crumb?.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
          )}
          
          {crumb?.isActive ? (
            <span className="text-foreground font-medium">
              {crumb?.label}
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(crumb?.path)}
              className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {crumb?.label}
            </Button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;