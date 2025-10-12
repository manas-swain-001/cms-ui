import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const SyncStatusIndicator = ({ 
  status = 'synced', // synced, syncing, offline, error
  pendingCount = 0,
  lastSyncTime = null,
  showDetails = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'syncing':
        return {
          icon: 'RefreshCw',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Syncing',
          description: 'Synchronizing data...'
        };
      case 'offline':
        return {
          icon: 'WifiOff',
          color: 'text-error',
          bgColor: 'bg-error/10',
          label: 'Offline',
          description: 'No internet connection'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          color: 'text-error',
          bgColor: 'bg-error/10',
          label: 'Sync Error',
          description: 'Failed to sync data'
        };
      default:
        return {
          icon: 'Check',
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Synced',
          description: 'All data synchronized'
        };
    }
  };

  const config = getStatusConfig(status);

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const syncTime = new Date(timestamp);
    const diffMs = now - syncTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Auto-collapse expanded state after 5 seconds
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => setIsExpanded(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  if (!showDetails) {
    // Simple indicator version
    return (
      <div className={`flex items-center space-x-1 ${config?.color} ${className}`}>
        <Icon 
          name={config?.icon} 
          size={12} 
          className={status === 'syncing' ? 'animate-spin' : ''} 
        />
        {pendingCount > 0 && (
          <span className="text-xs bg-error text-error-foreground px-1.5 py-0.5 rounded-full">
            {pendingCount}
          </span>
        )}
      </div>
    );
  }

  // Detailed indicator version
  return (
    <div className={`${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${config?.bgColor} hover:opacity-80`}
      >
        <div className={`w-6 h-6 rounded-full ${config?.bgColor} flex items-center justify-center`}>
          <Icon 
            name={config?.icon} 
            size={12} 
            className={`${config?.color} ${status === 'syncing' ? 'animate-spin' : ''}`} 
          />
        </div>
        <div className="text-left">
          <div className={`text-sm font-medium ${config?.color}`}>
            {config?.label}
          </div>
          <div className="text-xs text-muted-foreground">
            {pendingCount > 0 ? `${pendingCount} pending` : formatLastSync(lastSyncTime)}
          </div>
        </div>
        {pendingCount > 0 && (
          <span className="bg-error text-error-foreground text-xs px-2 py-0.5 rounded-full">
            {pendingCount}
          </span>
        )}
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={14} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="mt-2 p-3 bg-muted rounded-lg animate-fade-in">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className={config?.color}>{config?.description}</span>
            </div>
            {lastSyncTime && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last sync:</span>
                <span className="text-foreground">{formatLastSync(lastSyncTime)}</span>
              </div>
            )}
            {pendingCount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending operations:</span>
                <span className="text-error font-medium">{pendingCount}</span>
              </div>
            )}
            {status === 'error' && (
              <button className="w-full mt-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors">
                Retry Sync
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncStatusIndicator;