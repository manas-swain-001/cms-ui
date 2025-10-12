import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SyncStatusPanel = ({ onSyncAction }) => {
  const [syncStatus, setSyncStatus] = useState('synced'); // synced, syncing, offline, error
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [queuedPunches, setQueuedPunches] = useState([]);

  // Mock queued punches data
  const mockQueuedPunches = [
    {
      id: 1,
      type: 'check_in',
      timestamp: new Date(Date.now() - 3600000)?.toISOString(),
      location: 'Bhubaneswar Office',
      status: 'pending'
    },
    {
      id: 2,
      type: 'check_out',
      timestamp: new Date(Date.now() - 1800000)?.toISOString(),
      location: 'Bhubaneswar Office',
      status: 'pending'
    }
  ];

  useEffect(() => {
    // Simulate network status changes
    const interval = setInterval(() => {
      const statuses = ['synced', 'syncing', 'offline'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setSyncStatus(randomStatus);
      
      if (randomStatus === 'offline') {
        setPendingCount(mockQueuedPunches?.length);
        setQueuedPunches(mockQueuedPunches);
      } else if (randomStatus === 'synced') {
        setPendingCount(0);
        setQueuedPunches([]);
        setLastSyncTime(new Date());
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'syncing':
        return {
          icon: 'RefreshCw',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          label: 'Syncing',
          description: 'Synchronizing attendance data...'
        };
      case 'offline':
        return {
          icon: 'WifiOff',
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          label: 'Offline',
          description: 'No internet connection. Data will sync when online.'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          label: 'Sync Error',
          description: 'Failed to sync attendance data. Please retry.'
        };
      default:
        return {
          icon: 'Check',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          label: 'Synced',
          description: 'All attendance data is synchronized.'
        };
    }
  };

  const config = getStatusConfig();

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never';
    
    const now = new Date();
    const diffMs = now - lastSyncTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return lastSyncTime?.toLocaleDateString('en-IN');
  };

  const formatPunchTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRetrySync = () => {
    setSyncStatus('syncing');
    onSyncAction('retry');
    
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('synced');
      setPendingCount(0);
      setQueuedPunches([]);
      setLastSyncTime(new Date());
    }, 3000);
  };

  const handleForcSync = () => {
    setSyncStatus('syncing');
    onSyncAction('force');
    
    setTimeout(() => {
      setSyncStatus('synced');
      setPendingCount(0);
      setQueuedPunches([]);
      setLastSyncTime(new Date());
    }, 2000);
  };

  return (
    <div className={`bg-card rounded-lg border ${config?.borderColor} ${config?.bgColor} p-4`}>
      {/* Status Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full ${config?.bgColor} flex items-center justify-center`}>
            <Icon 
              name={config?.icon} 
              size={16} 
              className={`${config?.color} ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} 
            />
          </div>
          <div>
            <h3 className={`text-sm font-medium ${config?.color}`}>{config?.label}</h3>
            <p className="text-xs text-muted-foreground">{config?.description}</p>
          </div>
        </div>
        
        {pendingCount > 0 && (
          <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
            {pendingCount} pending
          </span>
        )}
      </div>
      {/* Sync Details */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Last sync:</span>
          <span className="text-foreground font-medium">{formatLastSync()}</span>
        </div>
        
        {syncStatus === 'syncing' && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress:</span>
            <span className="text-warning font-medium">Syncing data...</span>
          </div>
        )}
        
        {pendingCount > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Queued operations:</span>
            <span className="text-error font-medium">{pendingCount} items</span>
          </div>
        )}
      </div>
      {/* Queued Punches */}
      {queuedPunches?.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Pending Punches:</h4>
          <div className="space-y-2">
            {queuedPunches?.map((punch) => (
              <div key={punch?.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={punch?.type === 'check_in' ? 'LogIn' : 'LogOut'} 
                    size={12} 
                    className={punch?.type === 'check_in' ? 'text-success' : 'text-error'} 
                  />
                  <span className="text-foreground font-medium">
                    {punch?.type === 'check_in' ? 'Check In' : 'Check Out'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground">{formatPunchTime(punch?.timestamp)}</div>
                  <div className="text-muted-foreground">{punch?.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex space-x-2">
        {syncStatus === 'error' && (
          <Button
            onClick={handleRetrySync}
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            className="flex-1"
          >
            Retry Sync
          </Button>
        )}
        
        {(syncStatus === 'offline' || pendingCount > 0) && (
          <Button
            onClick={handleForcSync}
            variant="default"
            size="sm"
            iconName="Upload"
            iconPosition="left"
            className="flex-1"
          >
            Force Sync
          </Button>
        )}
        
        {syncStatus === 'synced' && (
          <Button
            onClick={() => onSyncAction('refresh')}
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            className="flex-1"
          >
            Refresh
          </Button>
        )}
      </div>
      {/* Network Status Indicator */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Network Status:</span>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              syncStatus === 'offline' ? 'bg-error' : 
              syncStatus === 'syncing' ? 'bg-warning' : 'bg-success'
            }`}></div>
            <span className={`font-medium ${
              syncStatus === 'offline' ? 'text-error' : 
              syncStatus === 'syncing' ? 'text-warning' : 'text-success'
            }`}>
              {syncStatus === 'offline' ? 'Offline' : 
               syncStatus === 'syncing' ? 'Syncing' : 'Online'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncStatusPanel;