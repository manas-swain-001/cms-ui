import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PermissionGuard = ({ children, requiredRoles = [], fallbackPath = '/main-dashboard' }) => {
  const location = useLocation();
  
  // Mock user data - in real app this would come from auth context
  const user = {
    role: 'admin', // admin, manager, employee, sales, field
    permissions: ['read', 'write', 'delete', 'admin'],
    isAuthenticated: true
  };

  // Role hierarchy for permission inheritance
  const roleHierarchy = {
    admin: ['admin', 'manager', 'employee', 'sales', 'field'],
    manager: ['manager', 'employee', 'sales', 'field'],
    employee: ['employee'],
    sales: ['sales'],
    field: ['field']
  };

  // Check if user is authenticated
  if (!user?.isAuthenticated) {
    return <Navigate to="/login-authentication" state={{ from: location }} replace />;
  }

  // If no roles required, allow access
  if (requiredRoles?.length === 0) {
    return children;
  }

  // Check if user has required role
  const userAllowedRoles = roleHierarchy?.[user?.role] || [user?.role];
  const hasRequiredRole = requiredRoles?.some(role => userAllowedRoles?.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

// Higher-order component for route protection
export const withPermissionGuard = (WrappedComponent, requiredRoles = []) => {
  return (props) => (
    <PermissionGuard requiredRoles={requiredRoles}>
      <WrappedComponent {...props} />
    </PermissionGuard>
  );
};

// Hook for checking permissions in components
export const usePermissions = () => {
  // Mock user data - in real app this would come from auth context
  const user = {
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'admin'],
    isAuthenticated: true
  };

  const roleHierarchy = {
    admin: ['admin', 'manager', 'employee', 'sales', 'field'],
    manager: ['manager', 'employee', 'sales', 'field'],
    employee: ['employee'],
    sales: ['sales'],
    field: ['field']
  };

  const hasRole = (requiredRoles) => {
    if (!Array.isArray(requiredRoles)) {
      requiredRoles = [requiredRoles];
    }
    
    const userAllowedRoles = roleHierarchy?.[user?.role] || [user?.role];
    return requiredRoles?.some(role => userAllowedRoles?.includes(role));
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission);
  };

  const canAccess = (requiredRoles = [], requiredPermissions = []) => {
    const hasRequiredRole = requiredRoles?.length === 0 || hasRole(requiredRoles);
    const hasRequiredPermission = requiredPermissions?.length === 0 || 
      requiredPermissions?.every(permission => hasPermission(permission));
    
    return hasRequiredRole && hasRequiredPermission;
  };

  return {
    user,
    hasRole,
    hasPermission,
    canAccess,
    isAuthenticated: user?.isAuthenticated
  };
};

export default PermissionGuard;