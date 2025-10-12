import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TimeWindowIndicator = ({ 
  currentSlot = 'morning', 
  timeRemaining = null,
  isWithinWindow = true 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getSlotWindows = () => ({
    morning: { start: '09:00', end: '12:00', label: 'Morning Update' },
    afternoon: { start: '12:00', end: '17:00', label: 'Afternoon Update' },
    evening: { start: '17:00', end: '20:00', label: 'Evening Update' }
  });

  const getCurrentSlotInfo = () => {
    const windows = getSlotWindows();
    const now = currentTime;
    const currentHour = now?.getHours();
    const currentMinute = now?.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Determine current active slot based on time
    if (currentTimeInMinutes >= 9 * 60 && currentTimeInMinutes < 12 * 60) {
      return { slot: 'morning', ...windows?.morning, isActive: true };
    } else if (currentTimeInMinutes >= 12 * 60 && currentTimeInMinutes < 17 * 60) {
      return { slot: 'afternoon', ...windows?.afternoon, isActive: true };
    } else if (currentTimeInMinutes >= 17 * 60 && currentTimeInMinutes < 20 * 60) {
      return { slot: 'evening', ...windows?.evening, isActive: true };
    } else {
      // Outside all windows
      let nextSlot;
      if (currentTimeInMinutes < 9 * 60) {
        nextSlot = { slot: 'morning', ...windows?.morning, isActive: false };
      } else if (currentTimeInMinutes < 12 * 60) {
        nextSlot = { slot: 'afternoon', ...windows?.afternoon, isActive: false };
      } else if (currentTimeInMinutes < 17 * 60) {
        nextSlot = { slot: 'evening', ...windows?.evening, isActive: false };
      } else {
        // After evening window, next is tomorrow morning
        nextSlot = { slot: 'morning', ...windows?.morning, isActive: false, nextDay: true };
      }
      return nextSlot;
    }
  };

  const formatTimeRemaining = (minutes) => {
    if (!minutes || minutes <= 0) return null;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getStatusColor = () => {
    if (!isWithinWindow) return 'text-error';
    if (timeRemaining && timeRemaining <= 30) return 'text-warning';
    return 'text-success';
  };

  const getStatusIcon = () => {
    if (!isWithinWindow) return 'AlertCircle';
    if (timeRemaining && timeRemaining <= 30) return 'Clock';
    return 'CheckCircle';
  };

  const currentSlotInfo = getCurrentSlotInfo();
  const formattedTime = currentTime?.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            currentSlotInfo?.isActive ? 'bg-success/10' : 'bg-muted'
          }`}>
            <Icon 
              name={currentSlotInfo?.slot === 'morning' ? 'Sunrise' : 
                    currentSlotInfo?.slot === 'afternoon' ? 'Sun' : 'Sunset'} 
              size={20} 
              className={currentSlotInfo?.isActive ? 'text-success' : 'text-muted-foreground'} 
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Current Time Window</h3>
            <p className="text-sm text-muted-foreground">
              {formattedTime} • {currentTime?.toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
          <Icon name={getStatusIcon()} size={16} />
          <span className="text-sm font-medium">
            {isWithinWindow ? 'Active' : 'Closed'}
          </span>
        </div>
      </div>
      {/* Current Slot Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <div className="font-medium text-foreground">{currentSlotInfo?.label}</div>
            <div className="text-sm text-muted-foreground">
              {currentSlotInfo?.start} - {currentSlotInfo?.end}
              {currentSlotInfo?.nextDay && ' (Tomorrow)'}
            </div>
          </div>
          <div className="text-right">
            {currentSlotInfo?.isActive && timeRemaining ? (
              <div className={`text-sm font-medium ${getStatusColor()}`}>
                {formatTimeRemaining(timeRemaining)} remaining
              </div>
            ) : currentSlotInfo?.isActive ? (
              <div className="text-sm font-medium text-success">Active Now</div>
            ) : (
              <div className="text-sm font-medium text-muted-foreground">
                {currentSlotInfo?.nextDay ? 'Opens Tomorrow' : 'Upcoming'}
              </div>
            )}
          </div>
        </div>

        {/* All Slots Overview */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(getSlotWindows())?.map(([slotKey, slotInfo]) => (
            <div 
              key={slotKey}
              className={`p-2 rounded text-center text-xs transition-all duration-200 ${
                currentSlotInfo?.slot === slotKey && currentSlotInfo?.isActive
                  ? 'bg-success/10 text-success border border-success/20' :'bg-muted text-muted-foreground'
              }`}
            >
              <div className="font-medium capitalize">{slotKey}</div>
              <div>{slotInfo?.start}-{slotInfo?.end}</div>
            </div>
          ))}
        </div>

        {/* Warning Messages */}
        {!isWithinWindow && (
          <div className="flex items-center space-x-2 p-3 bg-error/10 text-error rounded-lg">
            <Icon name="AlertTriangle" size={16} />
            <span className="text-sm">
              This time window is closed. Updates may require manager approval.
            </span>
          </div>
        )}

        {isWithinWindow && timeRemaining && timeRemaining <= 30 && (
          <div className="flex items-center space-x-2 p-3 bg-warning/10 text-warning rounded-lg">
            <Icon name="Clock" size={16} />
            <span className="text-sm">
              Time window closing soon! Please submit your update.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeWindowIndicator;