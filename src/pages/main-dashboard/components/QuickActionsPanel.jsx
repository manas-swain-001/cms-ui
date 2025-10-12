import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = ({ userRole }) => {
  const navigate = useNavigate();

  const getRoleActions = () => {
    switch (userRole) {
      case 'admin':
        return [
          {
            label: 'System Settings',
            description: 'Configure organization settings',
            icon: 'Settings',
            color: 'bg-admin/10 text-admin',
            action: () => navigate('/control-panel-settings')
          },
          {
            label: 'User Management',
            description: 'Manage users and roles',
            icon: 'Users',
            color: 'bg-primary/10 text-primary',
            action: () => navigate('/user-profile-management')
          },
          {
            label: 'Reports',
            description: 'Generate system reports',
            icon: 'BarChart3',
            color: 'bg-success/10 text-success',
            action: () => navigate('/main-dashboard')
          },
          {
            label: 'Audit Logs',
            description: 'View system audit trail',
            icon: 'FileText',
            color: 'bg-warning/10 text-warning',
            action: () => navigate('/main-dashboard')
          }
        ];
      case 'manager':
        return [
          {
            label: 'Team Overview',
            description: 'Monitor team performance',
            icon: 'Users',
            color: 'bg-primary/10 text-primary',
            action: () => navigate('/main-dashboard')
          },
          {
            label: 'Approvals',
            description: 'Review pending requests',
            icon: 'CheckSquare',
            color: 'bg-warning/10 text-warning',
            action: () => navigate('/attendance-management')
          },
          {
            label: 'Team Reports',
            description: 'Generate team analytics',
            icon: 'BarChart3',
            color: 'bg-success/10 text-success',
            action: () => navigate('/main-dashboard')
          }
        ];
      case 'developer':
        return [
          {
            label: 'Update Tasks',
            description: 'Update three-slot tasks',
            icon: 'Code',
            color: 'bg-developer/10 text-developer',
            action: () => navigate('/task-compliance-tracking')
          },
          {
            label: 'Punch Attendance',
            description: 'Mark your attendance',
            icon: 'Clock',
            color: 'bg-success/10 text-success',
            action: () => navigate('/attendance-management')
          },
          {
            label: 'Team Dashboard',
            description: 'View team compliance',
            icon: 'BarChart3',
            color: 'bg-primary/10 text-primary',
            action: () => navigate('/task-compliance-tracking')
          }
        ];
      case 'sales':
        return [
          {
            label: 'Add Lead',
            description: 'Create new sales lead',
            icon: 'Plus',
            color: 'bg-sales/10 text-sales',
            action: () => navigate('/main-dashboard')
          },
          {
            label: 'Pipeline',
            description: 'Manage sales pipeline',
            icon: 'TrendingUp',
            color: 'bg-primary/10 text-primary',
            action: () => navigate('/main-dashboard')
          },
          {
            label: 'Follow-ups',
            description: 'Schedule client calls',
            icon: 'Phone',
            color: 'bg-warning/10 text-warning',
            action: () => navigate('/main-dashboard')
          },
          {
            label: 'Punch Attendance',
            description: 'Mark your attendance',
            icon: 'Clock',
            color: 'bg-success/10 text-success',
            action: () => navigate('/attendance-management')
          }
        ];
      case 'field':
        return [
          {
            label: 'Start Visit',
            description: 'Begin field visit',
            icon: 'Play',
            color: 'bg-field/10 text-field',
            action: () => navigate('/main-dashboard')
          },
          {
            label: 'Create Lead',
            description: 'Add lead from visit',
            icon: 'UserPlus',
            color: 'bg-sales/10 text-sales',
            action: () => navigate('/main-dashboard')
          },
          {
            label: 'Navigation',
            description: 'Get directions',
            icon: 'Navigation',
            color: 'bg-primary/10 text-primary',
            action: () => navigate('/main-dashboard')
          },
          {
            label: 'Punch Attendance',
            description: 'Mark your attendance',
            icon: 'Clock',
            color: 'bg-success/10 text-success',
            action: () => navigate('/attendance-management')
          }
        ];
      default:
        return [
          {
            label: 'Profile',
            description: 'Update your profile',
            icon: 'User',
            color: 'bg-primary/10 text-primary',
            action: () => navigate('/user-profile-management')
          },
          {
            label: 'Attendance',
            description: 'View attendance history',
            icon: 'Clock',
            color: 'bg-success/10 text-success',
            action: () => navigate('/attendance-management')
          }
        ];
    }
  };

  const actions = getRoleActions();

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Frequently used features</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {actions?.map((action, index) => (
          <button
            key={index}
            onClick={action?.action}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 text-left group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action?.color} group-hover:scale-105 transition-transform duration-200`}>
              <Icon name={action?.icon} size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                {action?.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {action?.description}
              </div>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors duration-200" />
          </button>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          iconName="Settings"
          iconPosition="left"
          onClick={() => navigate('/user-profile-management')}
        >
          Customize Dashboard
        </Button>
      </div>
    </div>
  );
};

export default QuickActionsPanel;