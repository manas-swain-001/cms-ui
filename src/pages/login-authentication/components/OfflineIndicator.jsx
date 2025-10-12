import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDetails, setShowDetails] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState([]);

  // Mock offline queue data
  const mockOfflineData = [
    { type: 'attendance', action: 'Check-in attempt', timestamp: new Date(Date.now() - 300000) },
    { type: 'task', action: 'Task update', timestamp: new Date(Date.now() - 600000) },
    { type: 'profile', action: 'Profile sync', timestamp: new Date(Date.now() - 900000) }
  ];

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Simulate queue processing
      if (offlineQueue?.length > 0) {
        setTimeout(() => {
          setOfflineQueue([]);
        }, 2000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineQueue(mockOfflineData);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineQueue?.length]);

  const getStatusConfig = () => {
    if (isOnline) {
      return {
        icon: 'Wifi',
        color: 'text-success',
        bgColor: 'bg-success/10',
        label: 'Online',
        description: 'Connected to SmartXAlgo servers'
      };
    } else {
      return {
        icon: 'WifiOff',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        label: 'Offline Mode',
        description: 'Limited functionality available'
      };
    }
  };

  const config = getStatusConfig();

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const getQueueIcon = (type) => {
    switch (type) {
      case 'attendance': return 'Clock';
      case 'task': return 'CheckSquare';
      case 'profile': return 'User';
      default: return 'Database';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {/* Main Indicator */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-200 ${config?.bgColor} hover:shadow-xl`}
        >
          <Icon name={config?.icon} size={16} className={config?.color} />
          <span className={`text-sm font-medium ${config?.color}`}>
            {config?.label}
          </span>
          {offlineQueue?.length > 0 && (
            <span className="bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded-full">
              {offlineQueue?.length}
            </span>
          )}
          <Icon 
            name={showDetails ? 'ChevronUp' : 'ChevronDown'} 
            size={14} 
            className="text-muted-foreground" 
          />
        </button>

        {/* Details Panel */}
        {showDetails && (
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-card border border-border rounded-lg shadow-xl animate-fade-in">
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={config?.icon} size={16} className={config?.color} />
                <span className={`font-medium ${config?.color}`}>{config?.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{config?.description}</p>
            </div>

            {/* Connection Status */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Server Status</span>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-warning'}`} />
                  <span className={isOnline ? 'text-success' : 'text-warning'}>
                    {isOnline ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Last Sync</span>
                <span className="text-foreground">
                  {isOnline ? 'Just now' : '5 minutes ago'}
                </span>
              </div>
            </div>

            {/* Offline Queue */}
            {offlineQueue?.length > 0 && (
              <div className="p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Pending Sync ({offlineQueue?.length})
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {offlineQueue?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <Icon name={getQueueIcon(item?.type)} size={12} className="text-muted-foreground" />
                      <span className="flex-1 text-foreground">{item?.action}</span>
                      <span className="text-muted-foreground">{formatTimestamp(item?.timestamp)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    {isOnline ? 
                      'Syncing data automatically...' : 'Data will sync when connection is restored'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Offline Capabilities */}
            {!isOnline && (
              <div className="p-4 bg-muted/50">
                <h4 className="text-sm font-medium text-foreground mb-2">Available Offline</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={10} className="text-success" />
                    <span>View cached data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={10} className="text-success" />
                    <span>Record attendance (queued)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="X" size={10} className="text-error" />
                    <span>Real-time sync</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;