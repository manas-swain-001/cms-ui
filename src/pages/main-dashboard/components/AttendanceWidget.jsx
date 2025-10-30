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
        };
      case 'manager':
        return {
          title: 'Team Attendance',
        };
      default:
        return {
          title: 'My Attendance',
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
        <div className="text-center">
          <div className={`text-2xl font-bold text-success`}>
            {attendanceData?.presentAtOffice || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            {'Present'}
          </div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold text-error`}>
            {attendanceData?.absent || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            {'Absent'}
          </div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold text-warning`}>
            {attendanceData?.late || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            {'Late'}
          </div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold text-primary`}>
            {attendanceData?.workFromHome || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            Work From Home
          </div>
        </div>
      </div>
      {userRole === 'employee' && (
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
        </div>
      )}
    </div>
  );
};

export default AttendanceWidget;