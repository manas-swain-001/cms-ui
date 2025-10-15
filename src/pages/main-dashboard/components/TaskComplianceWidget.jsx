import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskComplianceWidget = ({ userRole, taskData }) => {
  const navigate = useNavigate();

  const getRoleSpecificData = () => {
    switch (userRole) {
      case 'admin':
        return {
          title: 'Task Compliance Overview',
          metrics: [
            { label: 'Overall Compliance', value: `${taskData?.overallCompliance}%`, color: 'text-primary' },
            { label: 'Overdue Tasks', value: taskData?.overdueTasks, color: 'text-error' },
            { label: 'Completed Today', value: taskData?.completedToday, color: 'text-success' },
            { label: 'In Progress', value: taskData?.inProgress, color: 'text-warning' }
          ],
          showGrid: true
        };
      case 'manager':
        return {
          title: 'Team Task Compliance',
          metrics: [
            { label: 'Team Compliance', value: `${taskData?.teamCompliance}%`, color: 'text-primary' },
            { label: 'Pending Reviews', value: taskData?.pendingReviews, color: 'text-warning' }
          ],
          showGrid: true
        };
      case 'employee':
        return {
          title: 'My Task Status',
          metrics: [
            { label: 'Morning Slot', value: taskData?.morningStatus, color: taskData?.morningStatus === 'Completed' ? 'text-success' : 'text-warning' },
            { label: 'Afternoon Slot', value: taskData?.afternoonStatus, color: taskData?.afternoonStatus === 'Completed' ? 'text-success' : 'text-warning' },
            { label: 'Evening Slot', value: taskData?.eveningStatus, color: taskData?.eveningStatus === 'Completed' ? 'text-success' : 'text-warning' },
            { label: 'Compliance', value: `${taskData?.personalCompliance}%`, color: 'text-primary' }
          ],
          showSlots: true
        };
      default:
        return {
          title: 'Task Overview',
          metrics: [
            { label: 'Assigned', value: taskData?.assigned, color: 'text-muted-foreground' },
            { label: 'Completed', value: taskData?.completed, color: 'text-success' }
          ]
        };
    }
  };

  const roleData = getRoleSpecificData();

  const getSlotIcon = (status) => {
    switch (status) {
      case 'Completed': return 'CheckCircle';
      case 'In Progress': return 'Clock';
      case 'Pending': return 'Circle';
      default: return 'AlertCircle';
    }
  };

  const getSlotColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-success';
      case 'In Progress': return 'text-warning';
      case 'Pending': return 'text-muted-foreground';
      default: return 'text-error';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="CheckSquare" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{roleData?.title}</h3>
            <p className="text-sm text-muted-foreground">Three-slot tracking</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/task-compliance-tracking')}
        >
          <Icon name="ExternalLink" size={16} />
        </Button>
      </div>
      {roleData?.showSlots ? (
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name={getSlotIcon(taskData?.morningStatus)} 
                size={16} 
                className={getSlotColor(taskData?.morningStatus)} 
              />
              <span className="text-sm font-medium">Morning Slot</span>
            </div>
            <span className={`text-sm ${getSlotColor(taskData?.morningStatus)}`}>
              {taskData?.morningStatus}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name={getSlotIcon(taskData?.afternoonStatus)} 
                size={16} 
                className={getSlotColor(taskData?.afternoonStatus)} 
              />
              <span className="text-sm font-medium">Afternoon Slot</span>
            </div>
            <span className={`text-sm ${getSlotColor(taskData?.afternoonStatus)}`}>
              {taskData?.afternoonStatus}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name={getSlotIcon(taskData?.eveningStatus)} 
                size={16} 
                className={getSlotColor(taskData?.eveningStatus)} 
              />
              <span className="text-sm font-medium">Evening Slot</span>
            </div>
            <span className={`text-sm ${getSlotColor(taskData?.eveningStatus)}`}>
              {taskData?.eveningStatus}
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {roleData?.metrics?.map((metric, index) => (
            <div key={index} className="text-center">
              <div className={`text-2xl font-bold ${metric?.color}`}>
                {metric?.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {metric?.label}
              </div>
            </div>
          ))}
        </div>
      )}
      {roleData?.showGrid && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Weekly Progress</span>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[95, 88, 92, 85, 90, 87, 93]?.map((percentage, index) => (
              <div
                key={index}
                className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                  percentage >= 90 ? 'bg-success text-success-foreground' :
                  percentage >= 75 ? 'bg-warning text-warning-foreground' : 'bg-error text-error-foreground'
                }`}
              >
                {percentage}%
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          iconName="BarChart3"
          iconPosition="left"
          onClick={() => navigate('/task-compliance-tracking')}
        >
          View Details
        </Button>
        {userRole === 'employee' && (
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => navigate('/task-compliance-tracking')}
          >
            Update Tasks
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskComplianceWidget;