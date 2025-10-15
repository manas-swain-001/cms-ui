import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ComplianceMatrix = ({ 
  teamData = [], 
  selectedDate = new Date(), 
  onDateChange,
  userRole = 'employee' 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [sortBy, setSortBy] = useState('name');
  const [filterCompliance, setFilterCompliance] = useState('all');

  const timeSlots = ['morning', 'afternoon', 'evening'];
  
  const getSlotIcon = (slotType) => {
    switch (slotType) {
      case 'morning': return 'Sunrise';
      case 'afternoon': return 'Sun';
      case 'evening': return 'Sunset';
      default: return 'Clock';
    }
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'partial': return 'bg-warning text-warning-foreground';
      case 'overdue': return 'bg-error text-error-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const getCompliancePercentage = (member) => {
    const completed = member?.slots?.filter(slot => slot?.status === 'completed')?.length;
    return Math.round((completed / timeSlots?.length) * 100);
  };

  const sortedAndFilteredData = teamData?.filter(member => {
      if (filterCompliance === 'all') return true;
      const percentage = getCompliancePercentage(member);
      switch (filterCompliance) {
        case 'high': return percentage >= 80;
        case 'medium': return percentage >= 50 && percentage < 80;
        case 'low': return percentage < 50;
        default: return true;
      }
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'compliance':
          return getCompliancePercentage(b) - getCompliancePercentage(a);
        case 'role':
          return a?.role?.localeCompare(b?.role);
        default:
          return 0;
      }
    });

  const overallCompliance = teamData?.length > 0 
    ? Math.round(teamData?.reduce((sum, member) => sum + getCompliancePercentage(member), 0) / teamData?.length)
    : 0;

  const viewModeOptions = [
    { value: 'grid', label: 'Grid View' },
    { value: 'list', label: 'List View' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'compliance', label: 'Compliance %' },
    { value: 'role', label: 'Role' }
  ];

  const complianceOptions = [
    { value: 'all', label: 'All Members' },
    { value: 'high', label: 'High (80%+)' },
    { value: 'medium', label: 'Medium (50-79%)' },
    { value: 'low', label: 'Low (&lt;50%)' }
  ];

  const renderGridView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-semibold text-foreground min-w-[200px]">
              Team Member
            </th>
            {timeSlots?.map(slot => (
              <th key={slot} className="text-center p-4 font-semibold text-foreground min-w-[120px]">
                <div className="flex items-center justify-center space-x-2">
                  <Icon name={getSlotIcon(slot)} size={16} />
                  <span className="capitalize">{slot}</span>
                </div>
              </th>
            ))}
            <th className="text-center p-4 font-semibold text-foreground min-w-[100px]">
              Compliance
            </th>
            {(userRole === 'manager' || userRole === 'admin') && (
              <th className="text-center p-4 font-semibold text-foreground min-w-[100px]">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedAndFilteredData?.map(member => (
            <tr key={member?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {member?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{member?.name}</div>
                    <div className="text-sm text-muted-foreground">{member?.role}</div>
                  </div>
                </div>
              </td>
              {timeSlots?.map(slotType => {
                const slot = member?.slots?.find(s => s?.type === slotType);
                return (
                  <td key={slotType} className="p-4 text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getComplianceColor(slot?.status || 'pending')}`}>
                      {slot?.status === 'completed' ? (
                        <Icon name="Check" size={14} />
                      ) : slot?.status === 'overdue' ? (
                        <Icon name="X" size={14} />
                      ) : (
                        <Icon name="Clock" size={14} />
                      )}
                    </div>
                  </td>
                );
              })}
              <td className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`text-sm font-semibold ${
                    getCompliancePercentage(member) >= 80 ? 'text-success' :
                    getCompliancePercentage(member) >= 50 ? 'text-warning' : 'text-error'
                  }`}>
                    {getCompliancePercentage(member)}%
                  </div>
                </div>
              </td>
              {(userRole === 'manager' || userRole === 'admin') && (
                <td className="p-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreHorizontal"
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {sortedAndFilteredData?.map(member => (
        <div key={member?.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {member?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                </span>
              </div>
              <div>
                <div className="font-medium text-foreground">{member?.name}</div>
                <div className="text-sm text-muted-foreground">{member?.role}</div>
              </div>
            </div>
            <div className={`text-lg font-bold ${
              getCompliancePercentage(member) >= 80 ? 'text-success' :
              getCompliancePercentage(member) >= 50 ? 'text-warning' : 'text-error'
            }`}>
              {getCompliancePercentage(member)}%
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {timeSlots?.map(slotType => {
              const slot = member?.slots?.find(s => s?.type === slotType);
              return (
                <div key={slotType} className="flex items-center space-x-2">
                  <Icon name={getSlotIcon(slotType)} size={16} className="text-muted-foreground" />
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getComplianceColor(slot?.status || 'pending')}`}>
                    {slot?.status === 'completed' ? (
                      <Icon name="Check" size={12} />
                    ) : slot?.status === 'overdue' ? (
                      <Icon name="X" size={12} />
                    ) : (
                      <Icon name="Clock" size={12} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Team Compliance Matrix</h2>
            <p className="text-sm text-muted-foreground">
              Overall compliance: <span className={`font-semibold ${
                overallCompliance >= 80 ? 'text-success' :
                overallCompliance >= 50 ? 'text-warning' : 'text-error'
              }`}>{overallCompliance}%</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select
              options={viewModeOptions}
              value={viewMode}
              onChange={setViewMode}
              className="w-32"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              onClick={() => window.location?.reload()}
            >
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <Select
            label="Sort by"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            className="w-40"
          />
          <Select
            label="Filter by compliance"
            options={complianceOptions}
            value={filterCompliance}
            onChange={setFilterCompliance}
            className="w-48"
          />
          <div className="text-sm text-muted-foreground">
            Showing {sortedAndFilteredData?.length} of {teamData?.length} members
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        {sortedAndFilteredData?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No team members found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
          </div>
        ) : viewMode === 'grid' ? (
          renderGridView()
        ) : (
          renderListView()
        )}
      </div>
    </div>
  );
};

export default ComplianceMatrix;