import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AttendanceCalendar = ({ attendanceData, selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)?.getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)?.getDay();
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getAttendanceStatus = (date) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    const record = attendanceData?.find(record => record?.date === dateStr);
    
    if (!record) return 'no-data';
    
    if (record?.status === 'present') {
      if (record?.isLate) return 'late';
      if (record?.isEarlyOut) return 'early-out';
      return 'present';
    }
    
    if (record?.status === 'absent') return 'absent';
    if (record?.status === 'holiday') return 'holiday';
    if (record?.status === 'weekend') return 'weekend';
    if (record?.status === 'leave') return 'leave';
    
    return 'no-data';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-success text-success-foreground';
      case 'late': return 'bg-warning text-warning-foreground';
      case 'early-out': return 'bg-warning text-warning-foreground';
      case 'absent': return 'bg-error text-error-foreground';
      case 'holiday': return 'bg-primary text-primary-foreground';
      case 'weekend': return 'bg-secondary text-secondary-foreground';
      case 'leave': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return 'CheckCircle';
      case 'late': return 'Clock';
      case 'early-out': return 'Clock';
      case 'absent': return 'XCircle';
      case 'holiday': return 'Calendar';
      case 'weekend': return 'Calendar';
      case 'leave': return 'Plane';
      default: return null;
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days?.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const status = getAttendanceStatus(date);
      const isSelected = selectedDate && 
        selectedDate?.toDateString() === date?.toDateString();
      const isToday = new Date()?.toDateString() === date?.toDateString();

      days?.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          className={`h-12 w-full rounded-lg text-sm font-medium transition-all duration-200 relative ${
            isSelected 
              ? 'ring-2 ring-primary ring-offset-2' :'hover:bg-muted'
          } ${
            isToday ? 'ring-1 ring-primary/50' : ''
          }`}
        >
          <div className={`w-full h-full rounded-lg flex flex-col items-center justify-center ${
            status !== 'no-data' ? getStatusColor(status) : ''
          }`}>
            <span className={`text-xs ${status === 'no-data' ? 'text-foreground' : ''}`}>
              {day}
            </span>
            {status !== 'no-data' && getStatusIcon(status) && (
              <Icon 
                name={getStatusIcon(status)} 
                size={10} 
                className="mt-0.5" 
              />
            )}
          </div>
        </button>
      );
    }

    return days;
  };

  const getMonthStats = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const monthData = attendanceData?.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= monthStart && recordDate <= monthEnd;
    });

    const stats = {
      present: monthData?.filter(r => r?.status === 'present')?.length,
      absent: monthData?.filter(r => r?.status === 'absent')?.length,
      late: monthData?.filter(r => r?.status === 'present' && r?.isLate)?.length,
      leaves: monthData?.filter(r => r?.status === 'leave')?.length
    };

    const workingDays = monthData?.filter(r => 
      !['weekend', 'holiday']?.includes(r?.status)
    )?.length;

    stats.attendance = workingDays > 0 ? ((stats?.present / workingDays) * 100)?.toFixed(1) : 0;

    return stats;
  };

  const monthStats = getMonthStats();

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Attendance Calendar</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(-1)}
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <span className="text-sm font-medium text-foreground min-w-[120px] text-center">
            {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(1)}
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
      {/* Month Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-success/10 rounded-lg">
          <div className="text-lg font-semibold text-success">{monthStats?.attendance}%</div>
          <div className="text-xs text-muted-foreground">Attendance</div>
        </div>
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-lg font-semibold text-primary">{monthStats?.present}</div>
          <div className="text-xs text-muted-foreground">Present</div>
        </div>
        <div className="text-center p-3 bg-warning/10 rounded-lg">
          <div className="text-lg font-semibold text-warning">{monthStats?.late}</div>
          <div className="text-xs text-muted-foreground">Late</div>
        </div>
        <div className="text-center p-3 bg-error/10 rounded-lg">
          <div className="text-lg font-semibold text-error">{monthStats?.absent}</div>
          <div className="text-xs text-muted-foreground">Absent</div>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="mb-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']?.map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-warning rounded-full"></div>
          <span className="text-muted-foreground">Late/Early</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-error rounded-full"></div>
          <span className="text-muted-foreground">Absent</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <span className="text-muted-foreground">Leave</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-muted-foreground">Holiday</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;