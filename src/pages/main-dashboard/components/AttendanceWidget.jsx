import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AttendanceWidget = ({ userRole, attendanceData }) => {
  const navigate = useNavigate();

  const getRoleSpecificData = () => {
    switch (userRole) {
      case 'admin':
        return {
          title: 'Organization Attendance',
          metrics: [
            { label: 'Present Today', value: attendanceData?.totalPresent, color: 'text-success' },
            { label: 'Late Arrivals', value: attendanceData?.lateArrivals, color: 'text-warning' },
            { label: 'Absent', value: attendanceData?.absent, color: 'text-error' },
            { label: 'On Leave', value: attendanceData?.onLeave, color: 'text-muted-foreground' }
          ],
          showHeatmap: true
        };
      case 'manager':
        return {
          title: 'Team Attendance',
          metrics: [
            { label: 'Team Present', value: attendanceData?.teamPresent, color: 'text-success' },
            { label: 'Pending Approvals', value: attendanceData?.pendingApprovals, color: 'text-warning' }
          ],
          showHeatmap: true
        };
      default:
        return {
          title: 'My Attendance',
          metrics: [
            { label: 'This Month', value: `${attendanceData?.monthlyPercentage}%`, color: 'text-success' },
            { label: 'Status', value: attendanceData?.todayStatus, color: attendanceData?.todayStatus === 'Present' ? 'text-success' : 'text-error' }
          ],
          showPunchButton: true
        };
    }
  };

  const roleData = getRoleSpecificData();

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{roleData?.title}</h3>
            <p className="text-sm text-muted-foreground">Real-time tracking</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/attendance-management')}
        >
          <Icon name="ExternalLink" size={16} />
        </Button>
      </div>
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
      {roleData?.showHeatmap && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Weekly Trend</span>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="flex space-x-1">
            {[85, 92, 78, 95, 88, 90, 87]?.map((percentage, index) => (
              <div
                key={index}
                className="flex-1 h-2 rounded-full bg-muted relative overflow-hidden"
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    percentage >= 90 ? 'bg-success' :
                    percentage >= 75 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {roleData?.showPunchButton && (
        <Button
          variant="default"
          fullWidth
          iconName="Clock"
          iconPosition="left"
          onClick={() => navigate('/attendance-management')}
        >
          Punch Attendance
        </Button>
      )}
      {(userRole === 'admin' || userRole === 'manager') && (
        <div className="flex space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            iconName="Users"
            iconPosition="left"
            onClick={() => navigate('/attendance-management')}
          >
            View Details
          </Button>
          {userRole === 'manager' && attendanceData?.pendingApprovals > 0 && (
            <Button
              variant="secondary"
              size="sm"
              iconName="CheckSquare"
              iconPosition="left"
            >
              Approvals ({attendanceData?.pendingApprovals})
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceWidget;