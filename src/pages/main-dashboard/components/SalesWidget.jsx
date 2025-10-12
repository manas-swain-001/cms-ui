import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SalesWidget = ({ userRole, salesData }) => {
  const navigate = useNavigate();

  const getRoleSpecificData = () => {
    switch (userRole) {
      case 'admin':
        return {
          title: 'Sales Pipeline Overview',
          metrics: [
            { label: 'Total Pipeline', value: `₹${salesData?.totalPipeline}L`, color: 'text-primary' },
            { label: 'Conversion Rate', value: `${salesData?.conversionRate}%`, color: 'text-success' },
            { label: 'Active Leads', value: salesData?.activeLeads, color: 'text-warning' },
            { label: 'Closed Deals', value: salesData?.closedDeals, color: 'text-success' }
          ],
          showFunnel: true
        };
      case 'manager':
        return {
          title: 'Team Sales Performance',
          metrics: [
            { label: 'Team Pipeline', value: `₹${salesData?.teamPipeline}L`, color: 'text-primary' },
            { label: 'Team Target', value: `${salesData?.teamTargetProgress}%`, color: 'text-success' }
          ],
          showFunnel: true
        };
      case 'sales':
        return {
          title: 'My Sales Performance',
          metrics: [
            { label: 'My Pipeline', value: `₹${salesData?.myPipeline}L`, color: 'text-primary' },
            { label: 'Target Progress', value: `${salesData?.myTargetProgress}%`, color: 'text-success' },
            { label: 'Active Leads', value: salesData?.myActiveLeads, color: 'text-warning' },
            { label: 'This Month', value: `₹${salesData?.monthlyRevenue}L`, color: 'text-success' }
          ],
          showQuickActions: true
        };
      default:
        return {
          title: 'Sales Overview',
          metrics: [
            { label: 'Total Revenue', value: `₹${salesData?.totalRevenue}L`, color: 'text-success' },
            { label: 'Active Deals', value: salesData?.activeDeals, color: 'text-primary' }
          ]
        };
    }
  };

  const roleData = getRoleSpecificData();

  const funnelStages = [
    { name: 'Leads', value: salesData?.leads, color: 'bg-blue-500' },
    { name: 'Qualified', value: salesData?.qualified, color: 'bg-yellow-500' },
    { name: 'Proposal', value: salesData?.proposal, color: 'bg-orange-500' },
    { name: 'Negotiation', value: salesData?.negotiation, color: 'bg-red-500' },
    { name: 'Closed', value: salesData?.closed, color: 'bg-green-500' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sales/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-sales" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{roleData?.title}</h3>
            <p className="text-sm text-muted-foreground">Pipeline tracking</p>
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
      {roleData?.showFunnel && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Sales Funnel</span>
            <span className="text-xs text-muted-foreground">Current pipeline</span>
          </div>
          <div className="space-y-2">
            {funnelStages?.map((stage, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-16 text-xs text-muted-foreground">
                  {stage?.name}
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stage?.color} transition-all duration-300`}
                    style={{ width: `${(stage?.value / Math.max(...funnelStages?.map(s => s?.value))) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-xs font-medium text-foreground">
                  {stage?.value}
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
            iconName="Plus"
            iconPosition="left"
          >
            Add New Lead
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Phone"
              iconPosition="left"
            >
              Follow Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="FileText"
              iconPosition="left"
            >
              Proposals
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="BarChart3"
            iconPosition="left"
          >
            View Pipeline
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Users"
            iconPosition="left"
          >
            Manage Leads
          </Button>
        </div>
      )}
    </div>
  );
};

export default SalesWidget;