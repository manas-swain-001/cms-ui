import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemHealthWidget = ({ userRole }) => {
  const [systemStatus, setSystemStatus] = useState({
    overall: 'healthy',
    biometric: 'healthy',
    sync: 'syncing',
    database: 'healthy',
    api: 'healthy'
  });

  // Mock system health updates
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ['healthy', 'warning', 'error'];
      const syncStatuses = ['synced', 'syncing', 'offline'];
      
      setSystemStatus(prev => ({
        ...prev,
        sync: syncStatuses?.[Math.floor(Math.random() * syncStatuses?.length)],
        biometric: Math.random() > 0.9 ? 'warning' : 'healthy'
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'healthy':
        return { color: 'text-success', bgColor: 'bg-success/10', icon: 'CheckCircle' };
      case 'warning':
        return { color: 'text-warning', bgColor: 'bg-warning/10', icon: 'AlertTriangle' };
      case 'error':
        return { color: 'text-error', bgColor: 'bg-error/10', icon: 'XCircle' };
      case 'syncing':
        return { color: 'text-warning', bgColor: 'bg-warning/10', icon: 'RefreshCw' };
      case 'synced':
        return { color: 'text-success', bgColor: 'bg-success/10', icon: 'Check' };
      case 'offline':
        return { color: 'text-error', bgColor: 'bg-error/10', icon: 'WifiOff' };
      default:
        return { color: 'text-muted-foreground', bgColor: 'bg-muted', icon: 'Circle' };
    }
  };

  const systemComponents = [
    { name: 'Biometric System', status: systemStatus?.biometric, description: 'Face recognition & enrollment' },
    { name: 'Data Sync', status: systemStatus?.sync, description: 'Real-time synchronization' },
    { name: 'Database', status: systemStatus?.database, description: 'Data storage & retrieval' },
    { name: 'API Services', status: systemStatus?.api, description: 'Backend connectivity' }
  ];

  const getOverallStatus = () => {
    const statuses = Object.values(systemStatus);
    if (statuses?.includes('error') || statuses?.includes('offline')) return 'error';
    if (statuses?.includes('warning') || statuses?.includes('syncing')) return 'warning';
    return 'healthy';
  };

  const overallConfig = getStatusConfig(getOverallStatus());

  // Only show to admin users
  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${overallConfig?.bgColor} rounded-lg flex items-center justify-center`}>
            <Icon name={overallConfig?.icon} size={20} className={overallConfig?.color} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">System Health</h3>
            <p className="text-sm text-muted-foreground">Real-time monitoring</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {}}
        >
          <Icon name="Settings" size={16} />
        </Button>
      </div>
      <div className="space-y-3 mb-4">
        {systemComponents?.map((component, index) => {
          const config = getStatusConfig(component?.status);
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 ${config?.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon 
                    name={config?.icon} 
                    size={12} 
                    className={`${config?.color} ${component?.status === 'syncing' ? 'animate-spin' : ''}`} 
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{component?.name}</div>
                  <div className="text-xs text-muted-foreground">{component?.description}</div>
                </div>
              </div>
              <div className={`text-xs font-medium capitalize ${config?.color}`}>
                {component?.status}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">System Uptime</span>
        </div>
        <span className="text-sm font-bold text-primary">99.8%</span>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          iconName="BarChart3"
          iconPosition="left"
          onClick={() => {}}
        >
          View Logs
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          iconPosition="left"
          onClick={() => {}}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default SystemHealthWidget;