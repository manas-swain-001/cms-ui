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
  ];

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
    </div>
  );
};

export default ComplianceStats;