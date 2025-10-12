import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FieldVisitWidget = ({ userRole, fieldData }) => {
  const navigate = useNavigate();

  const getRoleSpecificData = () => {
    switch (userRole) {
      case 'admin':
        return {
          title: 'Field Operations Overview',
          metrics: [
            { label: 'Active Visits', value: fieldData?.activeVisits, color: 'text-primary' },
            { label: 'Completed Today', value: fieldData?.completedToday, color: 'text-success' },
            { label: 'Total Distance', value: `${fieldData?.totalDistance} km`, color: 'text-warning' },
            { label: 'Leads Generated', value: fieldData?.leadsGenerated, color: 'text-sales' }
          ],
          showMap: true
        };
      case 'manager':
        return {
          title: 'Team Field Activities',
          metrics: [
            { label: 'Team Active', value: fieldData?.teamActive, color: 'text-primary' },
            { label: 'Avg Distance', value: `${fieldData?.avgDistance} km`, color: 'text-warning' }
          ],
          showMap: true
        };
      case 'field':
        return {
          title: 'My Field Activities',
          metrics: [
            { label: 'Current Status', value: fieldData?.currentStatus, color: fieldData?.currentStatus === 'On Visit' ? 'text-success' : 'text-muted-foreground' },
            { label: 'Today Distance', value: `${fieldData?.todayDistance} km`, color: 'text-warning' },
            { label: 'Visits Completed', value: fieldData?.visitsCompleted, color: 'text-success' },
            { label: 'Leads Created', value: fieldData?.leadsCreated, color: 'text-sales' }
          ],
          showQuickActions: true
        };
      default:
        return {
          title: 'Field Activities',
          metrics: [
            { label: 'Active Visits', value: fieldData?.activeVisits, color: 'text-primary' },
            { label: 'Completed', value: fieldData?.completed, color: 'text-success' }
          ]
        };
    }
  };

  const roleData = getRoleSpecificData();

  const recentVisits = [
    { id: 1, client: 'ABC Corp', location: 'Mumbai', status: 'Completed', time: '2 hours ago' },
    { id: 2, client: 'XYZ Ltd', location: 'Bhubaneswar', status: 'In Progress', time: '30 mins ago' },
    { id: 3, client: 'Tech Solutions', location: 'Pune', status: 'Scheduled', time: 'Tomorrow' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-success';
      case 'In Progress': return 'text-warning';
      case 'Scheduled': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return 'CheckCircle';
      case 'In Progress': return 'Clock';
      case 'Scheduled': return 'Calendar';
      default: return 'MapPin';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-field/10 rounded-lg flex items-center justify-center">
            <Icon name="MapPin" size={20} className="text-field" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{roleData?.title}</h3>
            <p className="text-sm text-muted-foreground">GPS tracking</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/main-dashboard')}
        >
          <Icon name="ExternalLink" size={16} />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {roleData?.metrics?.map((metric, index) => (
          <div key={index} className="text-center">
            <div className={`text-2xl font-bold ${metric?.color}`}>
              {metric?.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {metric?.label}
            </div>
          </div>
        ))}
      </div>
      {roleData?.showMap && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Recent Activities</span>
            <span className="text-xs text-muted-foreground">Live tracking</span>
          </div>
          <div className="space-y-2">
            {recentVisits?.slice(0, 3)?.map((visit) => (
              <div key={visit?.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={getStatusIcon(visit?.status)} 
                    size={14} 
                    className={getStatusColor(visit?.status)} 
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground">{visit?.client}</div>
                    <div className="text-xs text-muted-foreground">{visit?.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium ${getStatusColor(visit?.status)}`}>
                    {visit?.status}
                  </div>
                  <div className="text-xs text-muted-foreground">{visit?.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {roleData?.showQuickActions ? (
        <div className="space-y-2">
          <Button
            variant="default"
            fullWidth
            iconName="Play"
            iconPosition="left"
          >
            Start Visit
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              iconPosition="left"
            >
              Create Lead
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Navigation"
              iconPosition="left"
            >
              Navigate
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Map"
            iconPosition="left"
          >
            View Map
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Route"
            iconPosition="left"
          >
            Track Routes
          </Button>
        </div>
      )}
    </div>
  );
};

export default FieldVisitWidget;