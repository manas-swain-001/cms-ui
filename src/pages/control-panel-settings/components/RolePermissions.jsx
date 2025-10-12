import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const RolePermissions = () => {
  const [permissions, setPermissions] = useState({
    // Dashboard & Analytics
    'dashboard.view': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: true,
      sales: true,
      field: true
    },
    'dashboard.analytics': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: false,
      sales: true,
      field: false
    },
    'dashboard.reports': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: false,
      sales: true,
      field: false
    },
    
    // Attendance Management
    'attendance.view': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: true,
      sales: true,
      field: true
    },
    'attendance.punch': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: true,
      sales: true,
      field: true
    },
    'attendance.override': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: false,
      sales: false,
      field: false
    },
    'attendance.reports': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: false,
      sales: false,
      field: false
    },
    
    // Task Management
    'tasks.view': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: true,
      sales: false,
      field: false
    },
    'tasks.create': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: false,
      sales: false,
      field: false
    },
    'tasks.update': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: true,
      sales: false,
      field: false
    },
    'tasks.delete': {
      admin: true,
      officeAdmin: false,
      manager: false,
      developer: false,
      sales: false,
      field: false
    },
    
    // Sales Management
    'sales.view': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: false,
      sales: true,
      field: false
    },
    'sales.create': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: false,
      sales: true,
      field: false
    },
    'sales.update': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: false,
      sales: true,
      field: false
    },
    'sales.reports': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: false,
      sales: true,
      field: false
    },
    
    // Field Operations
    'field.view': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: false,
      sales: false,
      field: true
    },
    'field.visits': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: false,
      sales: false,
      field: true
    },
    'field.reports': {
      admin: true,
      officeAdmin: true,
      manager: true,
      developer: false,
      sales: false,
      field: false
    },
    
    // User Management
    'users.view': {
      admin: true,
      officeAdmin: true,
      manager: false,
      developer: false,
      sales: false,
      field: false
    },
    'users.create': {
      admin: true,
      officeAdmin: true,
      manager: false,
      developer: false,
      sales: false,
      field: false
    },
    'users.update': {
      admin: true,
      officeAdmin: true,
      manager: false,
      developer: false,
      sales: false,
      field: false
    },
    'users.delete': {
      admin: true,
      officeAdmin: false,
      manager: false,
      developer: false,
      sales: false,
      field: false
    },
    
    // System Administration
    'system.settings': {
      admin: true,
      officeAdmin: false,
      manager: false,
      developer: false,
      sales: false,
      field: false
    },
    'system.audit': {
      admin: true,
      officeAdmin: false,
      manager: false,
      developer: false,
      sales: false,
      field: false
    },
    'system.backup': {
      admin: true,
      officeAdmin: false,
      manager: false,
      developer: false,
      sales: false,
      field: false
    }
  });

  const roles = [
    { key: 'admin', name: 'Admin', color: 'text-admin', description: 'Full system access' },
    { key: 'officeAdmin', name: 'Office Admin', color: 'text-primary', description: 'Office-level management' },
    { key: 'manager', name: 'Manager', color: 'text-warning', description: 'Team management' },
    { key: 'developer', name: 'Developer', color: 'text-developer', description: 'Development tasks' },
    { key: 'sales', name: 'Sales', color: 'text-sales', description: 'Sales operations' },
    { key: 'field', name: 'Field', color: 'text-muted-foreground', description: 'Field operations' }
  ];

  const permissionCategories = [
    {
      name: 'Dashboard & Analytics',
      icon: 'LayoutDashboard',
      permissions: [
        { key: 'dashboard.view', name: 'View Dashboard', description: 'Access to main dashboard' },
        { key: 'dashboard.analytics', name: 'View Analytics', description: 'Access to analytics and charts' },
        { key: 'dashboard.reports', name: 'Generate Reports', description: 'Create and export reports' }
      ]
    },
    {
      name: 'Attendance Management',
      icon: 'Clock',
      permissions: [
        { key: 'attendance.view', name: 'View Attendance', description: 'View attendance records' },
        { key: 'attendance.punch', name: 'Punch In/Out', description: 'Record attendance' },
        { key: 'attendance.override', name: 'Override Attendance', description: 'Modify attendance records' },
        { key: 'attendance.reports', name: 'Attendance Reports', description: 'Generate attendance reports' }
      ]
    },
    {
      name: 'Task Management',
      icon: 'CheckSquare',
      permissions: [
        { key: 'tasks.view', name: 'View Tasks', description: 'View task assignments' },
        { key: 'tasks.create', name: 'Create Tasks', description: 'Assign new tasks' },
        { key: 'tasks.update', name: 'Update Tasks', description: 'Modify task status' },
        { key: 'tasks.delete', name: 'Delete Tasks', description: 'Remove tasks' }
      ]
    },
    {
      name: 'Sales Management',
      icon: 'TrendingUp',
      permissions: [
        { key: 'sales.view', name: 'View Sales', description: 'View sales pipeline' },
        { key: 'sales.create', name: 'Create Leads', description: 'Add new leads' },
        { key: 'sales.update', name: 'Update Leads', description: 'Modify lead status' },
        { key: 'sales.reports', name: 'Sales Reports', description: 'Generate sales reports' }
      ]
    },
    {
      name: 'Field Operations',
      icon: 'MapPin',
      permissions: [
        { key: 'field.view', name: 'View Field Data', description: 'Access field operations' },
        { key: 'field.visits', name: 'Manage Visits', description: 'Start/end field visits' },
        { key: 'field.reports', name: 'Field Reports', description: 'Generate field reports' }
      ]
    },
    {
      name: 'User Management',
      icon: 'Users',
      permissions: [
        { key: 'users.view', name: 'View Users', description: 'View user profiles' },
        { key: 'users.create', name: 'Create Users', description: 'Add new users' },
        { key: 'users.update', name: 'Update Users', description: 'Modify user details' },
        { key: 'users.delete', name: 'Delete Users', description: 'Remove users' }
      ]
    },
    {
      name: 'System Administration',
      icon: 'Settings',
      permissions: [
        { key: 'system.settings', name: 'System Settings', description: 'Configure system settings' },
        { key: 'system.audit', name: 'Audit Logs', description: 'View system audit logs' },
        { key: 'system.backup', name: 'Backup & Restore', description: 'Manage system backups' }
      ]
    }
  ];

  const handlePermissionChange = (permissionKey, role, value) => {
    setPermissions(prev => ({
      ...prev,
      [permissionKey]: {
        ...prev?.[permissionKey],
        [role]: value
      }
    }));
  };

  const handleRoleToggleAll = (role, value) => {
    const updatedPermissions = { ...permissions };
    Object.keys(updatedPermissions)?.forEach(permissionKey => {
      updatedPermissions[permissionKey] = {
        ...updatedPermissions?.[permissionKey],
        [role]: value
      };
    });
    setPermissions(updatedPermissions);
  };

  const handleCategoryToggleAll = (category, role, value) => {
    const updatedPermissions = { ...permissions };
    category?.permissions?.forEach(permission => {
      updatedPermissions[permission.key] = {
        ...updatedPermissions?.[permission?.key],
        [role]: value
      };
    });
    setPermissions(updatedPermissions);
  };

  const getRolePermissionCount = (role) => {
    return Object.values(permissions)?.filter(perm => perm?.[role])?.length;
  };

  const getTotalPermissions = () => {
    return Object.keys(permissions)?.length;
  };

  const getCategoryPermissionCount = (category, role) => {
    return category?.permissions?.filter(perm => permissions?.[perm?.key]?.[role])?.length;
  };

  return (
    <div className="space-y-6">
      {/* Role Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Role Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles?.map((role) => (
            <div key={role?.key} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-medium ${role?.color}`}>{role?.name}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRoleToggleAll(role?.key, true)}
                >
                  Grant All
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{role?.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Permissions:</span>
                <span className="font-medium text-foreground">
                  {getRolePermissionCount(role?.key)}/{getTotalPermissions()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(getRolePermissionCount(role?.key) / getTotalPermissions()) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Permissions Matrix */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Permissions Matrix</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure role-based access control for different system features
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-foreground min-w-[300px]">
                  Permission
                </th>
                {roles?.map((role) => (
                  <th key={role?.key} className="text-center py-3 px-4 font-medium min-w-[100px]">
                    <div className={`${role?.color}`}>{role?.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionCategories?.map((category) => (
                <React.Fragment key={category?.name}>
                  {/* Category Header */}
                  <tr className="bg-muted/30 border-t border-border">
                    <td className="py-3 px-6">
                      <div className="flex items-center space-x-3">
                        <Icon name={category?.icon} size={16} className="text-primary" />
                        <span className="font-medium text-foreground">{category?.name}</span>
                      </div>
                    </td>
                    {roles?.map((role) => (
                      <td key={role?.key} className="text-center py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCategoryToggleAll(
                            category,
                            role?.key,
                            getCategoryPermissionCount(category, role?.key) !== category?.permissions?.length
                          )}
                          className="text-xs"
                        >
                          {getCategoryPermissionCount(category, role?.key)}/{category?.permissions?.length}
                        </Button>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Category Permissions */}
                  {category?.permissions?.map((permission) => (
                    <tr key={permission?.key} className="border-b border-border hover:bg-muted/20">
                      <td className="py-3 px-6 pl-12">
                        <div>
                          <div className="font-medium text-foreground text-sm">{permission?.name}</div>
                          <div className="text-xs text-muted-foreground">{permission?.description}</div>
                        </div>
                      </td>
                      {roles?.map((role) => (
                        <td key={role?.key} className="text-center py-3 px-4">
                          <Checkbox
                            checked={permissions?.[permission?.key]?.[role?.key]}
                            onChange={(e) => handlePermissionChange(permission?.key, role?.key, e?.target?.checked)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Permission Templates */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Permission Templates</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Quick setup templates for common role configurations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Minimal Access</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Basic dashboard and attendance access only
            </p>
            <Button variant="outline" size="sm" fullWidth>
              Apply Template
            </Button>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Team Lead</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Team management with reporting capabilities
            </p>
            <Button variant="outline" size="sm" fullWidth>
              Apply Template
            </Button>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Department Head</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Full departmental access with user management
            </p>
            <Button variant="outline" size="sm" fullWidth>
              Apply Template
            </Button>
          </div>
        </div>
      </div>
      {/* Save Changes */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">
          Reset to Defaults
        </Button>
        <Button>
          Save Permission Changes
        </Button>
      </div>
    </div>
  );
};

export default RolePermissions;