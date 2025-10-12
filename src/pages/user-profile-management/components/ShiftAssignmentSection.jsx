import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ShiftAssignmentSection = ({ shiftData, onUpdateShift }) => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [showExceptionForm, setShowExceptionForm] = useState(false);
  const [exceptionData, setExceptionData] = useState({
    date: '',
    type: '',
    reason: '',
    shiftTime: ''
  });

  const weekOptions = [
    { value: 'current', label: 'Current Week' },
    { value: 'next', label: 'Next Week' },
    { value: 'week3', label: 'Week of Jan 22-28' },
    { value: 'week4', label: 'Week of Jan 29-Feb 4' }
  ];

  const exceptionTypes = [
    { value: 'early_in', label: 'Early Check-in' },
    { value: 'late_in', label: 'Late Check-in' },
    { value: 'early_out', label: 'Early Check-out' },
    { value: 'late_out', label: 'Late Check-out' },
    { value: 'half_day', label: 'Half Day' },
    { value: 'work_from_home', label: 'Work From Home' }
  ];

  const shiftTimeOptions = [
    { value: '09:00-18:00', label: '9:00 AM - 6:00 PM' },
    { value: '10:00-19:00', label: '10:00 AM - 7:00 PM' },
    { value: '08:00-17:00', label: '8:00 AM - 5:00 PM' },
    { value: '11:00-20:00', label: '11:00 AM - 8:00 PM' }
  ];

  const handleExceptionSubmit = () => {
    if (exceptionData?.date && exceptionData?.type && exceptionData?.reason) {
      onUpdateShift({
        type: 'exception',
        data: {
          ...exceptionData,
          id: `exc_${Date.now()}`,
          status: 'pending',
          submittedAt: new Date()?.toISOString()
        }
      });
      setExceptionData({
        date: '',
        type: '',
        reason: '',
        shiftTime: ''
      });
      setShowExceptionForm(false);
    }
  };

  const getShiftStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'upcoming': return 'text-primary bg-primary/10';
      case 'completed': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getExceptionStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'rejected': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Calendar" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Shift Assignment</h2>
            <p className="text-sm text-muted-foreground">View your schedule and request exceptions</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select
            options={weekOptions}
            value={selectedWeek}
            onChange={setSelectedWeek}
            className="w-48"
          />
          <Button
            variant="outline"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setShowExceptionForm(true)}
          >
            Request Exception
          </Button>
        </div>
      </div>
      {/* Current Shift Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Regular Shift</span>
          </div>
          <div className="text-lg font-semibold text-foreground">{shiftData?.regularShift}</div>
          <div className="text-xs text-muted-foreground">Monday to Friday</div>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="MapPin" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Location</span>
          </div>
          <div className="text-lg font-semibold text-foreground">{shiftData?.location}</div>
          <div className="text-xs text-muted-foreground">Primary workplace</div>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Users" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Team</span>
          </div>
          <div className="text-lg font-semibold text-foreground">{shiftData?.team}</div>
          <div className="text-xs text-muted-foreground">Reporting team</div>
        </div>
      </div>
      {/* Weekly Schedule */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Weekly Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {shiftData?.weeklySchedule?.map((day) => (
            <div key={day?.date} className="bg-muted p-3 rounded-lg">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{getDayName(day?.date)}</div>
                <div className="text-sm font-medium text-foreground mb-2">
                  {new Date(day.date)?.getDate()}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${getShiftStatusColor(day?.status)}`}>
                  {day?.status}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{day?.shift}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Exception Requests */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Exception Requests</h3>
          <span className="text-sm text-muted-foreground">
            {shiftData?.exceptions?.filter(e => e?.status === 'pending')?.length} pending
          </span>
        </div>
        
        <div className="space-y-3">
          {shiftData?.exceptions?.map((exception) => (
            <div key={exception?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="AlertCircle" size={16} className="text-warning" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {exception?.type?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())} - {exception?.date}
                  </div>
                  <div className="text-xs text-muted-foreground">{exception?.reason}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-xs px-2 py-1 rounded-full ${getExceptionStatusColor(exception?.status)}`}>
                  {exception?.status}
                </span>
                {exception?.status === 'pending' && (
                  <Button variant="ghost" size="sm" iconName="X">
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {shiftData?.exceptions?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Calendar" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No exception requests</p>
            </div>
          )}
        </div>
      </div>
      {/* Exception Form Modal */}
      {showExceptionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg border border-border w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">Request Exception</h3>
              <Button
                variant="ghost"
                size="icon"
                iconName="X"
                onClick={() => setShowExceptionForm(false)}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
                <input
                  type="date"
                  value={exceptionData?.date}
                  onChange={(e) => setExceptionData(prev => ({ ...prev, date: e?.target?.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                />
              </div>
              
              <Select
                label="Exception Type"
                options={exceptionTypes}
                value={exceptionData?.type}
                onChange={(value) => setExceptionData(prev => ({ ...prev, type: value }))}
              />
              
              {(exceptionData?.type === 'early_in' || exceptionData?.type === 'late_out') && (
                <Select
                  label="Preferred Shift Time"
                  options={shiftTimeOptions}
                  value={exceptionData?.shiftTime}
                  onChange={(value) => setExceptionData(prev => ({ ...prev, shiftTime: value }))}
                />
              )}
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Reason</label>
                <textarea
                  value={exceptionData?.reason}
                  onChange={(e) => setExceptionData(prev => ({ ...prev, reason: e?.target?.value }))}
                  placeholder="Please provide a reason for this exception..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground h-20 resize-none"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowExceptionForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleExceptionSubmit}
                className="flex-1"
                disabled={!exceptionData?.date || !exceptionData?.type || !exceptionData?.reason}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Shift Policies */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Shift Policies</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Exception requests must be submitted at least 24 hours in advance</li>
          <li>• Maximum 2 exceptions per week allowed</li>
          <li>• Work from home requires manager approval</li>
          <li>• Half day requests need 4 hours advance notice</li>
          <li>• Emergency exceptions can be requested through HR</li>
        </ul>
      </div>
    </div>
  );
};

export default ShiftAssignmentSection;