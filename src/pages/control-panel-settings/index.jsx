import React, { useState } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import OrganizationSettings from './components/OrganizationSettings';
import OfficeManagement from './components/OfficeManagement';
import RolePermissions from './components/RolePermissions';
import FeatureFlags from './components/FeatureFlags';
import AuditLogs from './components/AuditLogs';
import Header from 'components/ui/Header';

const ControlPanelSettings = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('organization');

  const tabs = [
    {
      id: 'organization',
      name: 'Organization',
      icon: 'Building2',
      description: 'Company profile and basic settings'
    },
    {
      id: 'offices',
      name: 'Office Management',
      icon: 'MapPin',
      description: 'Manage office locations and settings'
    },
    {
      id: 'permissions',
      name: 'Role Permissions',
      icon: 'Shield',
      description: 'Configure role-based access control'
    },
    {
      id: 'features',
      name: 'Feature Flags',
      icon: 'Flag',
      description: 'Enable/disable system features'
    },
    {
      id: 'audit',
      name: 'Audit Logs',
      icon: 'FileText',
      description: 'View system activity logs'
    }
  ];

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'organization':
        return <OrganizationSettings />;
      case 'offices':
        return <OfficeManagement />;
      case 'permissions':
        return <RolePermissions />;
      case 'features':
        return <FeatureFlags />;
      case 'audit':
        return <AuditLogs />;
      default:
        return <OrganizationSettings />;
    }
  };

  const getActiveTabInfo = () => {
    return tabs?.find(tab => tab?.id === activeTab);
  };

  const activeTabInfo = getActiveTabInfo();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Settings" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Control Panel Settings</h1>
                <p className="text-muted-foreground">
                  Comprehensive system administration and configuration management
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Building2" size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">3</div>
                    <div className="text-sm text-muted-foreground">Active Offices</div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="Users" size={16} className="text-success" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">6</div>
                    <div className="text-sm text-muted-foreground">User Roles</div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="Flag" size={16} className="text-warning" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">18</div>
                    <div className="text-sm text-muted-foreground">Feature Flags</div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center">
                    <Icon name="Activity" size={16} className="text-error" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">127</div>
                    <div className="text-sm text-muted-foreground">Audit Entries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-card border border-border rounded-lg mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Active Tab Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={activeTabInfo?.icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{activeTabInfo?.name}</h2>
                    <p className="text-sm text-muted-foreground">{activeTabInfo?.description}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" iconName="RotateCcw" size="sm">
                    Reset
                  </Button>
                  <Button variant="outline" iconName="Download" size="sm">
                    Export
                  </Button>
                  <Button iconName="Save" size="sm">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>

          {/* System Status Footer */}
          <div className="mt-8 bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-muted-foreground">System Status: Operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Last Updated: {new Date()?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">Version: 2.1.0</span>
                <Button variant="ghost" size="sm" iconName="HelpCircle">
                  Help
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ControlPanelSettings;