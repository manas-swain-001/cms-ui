import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceStats = ({ 
  stats = {
    totalMembers: 0,
    completedUpdates: 0,
    pendingUpdates: 0,
    overdueUpdates: 0,
    compliancePercentage: 0
  },
  trends = {
    complianceChange: 0,
    completionRate: 0
  }
}) => {
  const statCards = [
    {
      title: 'Team Members',
      value: stats?.totalMembers,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Completed Updates',
      value: stats?.completedUpdates,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Pending Updates',
      value: stats?.pendingUpdates,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Overdue Updates',
      value: stats?.overdueUpdates,
      icon: 'AlertCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  const getTrendIcon = (change) => {
    if (change > 0) return 'TrendingUp';
    if (change < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const formatTrendValue = (value) => {
    const absValue = Math.abs(value);
    const sign = value > 0 ? '+' : value < 0 ? '-' : '';
    return `${sign}${absValue}%`;
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards?.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{stat?.value}</div>
                <div className="text-sm text-muted-foreground">{stat?.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Compliance */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Overall Compliance</h3>
            <div className={`flex items-center space-x-1 ${getTrendColor(trends?.complianceChange)}`}>
              <Icon name={getTrendIcon(trends?.complianceChange)} size={16} />
              <span className="text-sm font-medium">
                {formatTrendValue(trends?.complianceChange)}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">
                {stats?.compliancePercentage}%
              </span>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                stats?.compliancePercentage >= 80 ? 'bg-success/10 text-success' :
                stats?.compliancePercentage >= 60 ? 'bg-warning/10 text-warning': 'bg-error/10 text-error'
              }`}>
                {stats?.compliancePercentage >= 80 ? 'Excellent' :
                 stats?.compliancePercentage >= 60 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  stats?.compliancePercentage >= 80 ? 'bg-success' :
                  stats?.compliancePercentage >= 60 ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${stats?.compliancePercentage}%` }}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Based on completed task updates across all time slots
            </p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Today's Progress</h3>
            <div className={`flex items-center space-x-1 ${getTrendColor(trends?.completionRate)}`}>
              <Icon name={getTrendIcon(trends?.completionRate)} size={16} />
              <span className="text-sm font-medium">
                {formatTrendValue(trends?.completionRate)}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Time Slot Breakdown */}
            <div className="space-y-3">
              {[
                { slot: 'Morning', completed: Math.floor(stats?.completedUpdates * 0.4), total: stats?.totalMembers, icon: 'Sunrise' },
                { slot: 'Afternoon', completed: Math.floor(stats?.completedUpdates * 0.35), total: stats?.totalMembers, icon: 'Sun' },
                { slot: 'Evening', completed: Math.floor(stats?.completedUpdates * 0.25), total: stats?.totalMembers, icon: 'Sunset' }
              ]?.map((timeSlot, index) => {
                const percentage = stats?.totalMembers > 0 ? Math.round((timeSlot?.completed / timeSlot?.total) * 100) : 0;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon name={timeSlot?.icon} size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{timeSlot?.slot}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {timeSlot?.completed}/{timeSlot?.total}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceStats;