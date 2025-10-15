import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FeatureFlags = () => {
  const [features, setFeatures] = useState({
    // Core Features
    'attendance.biometric': {
      enabled: true,
      name: 'Biometric Attendance',
      description: 'Face recognition for attendance punching',
      category: 'Attendance',
      impact: 'high',
      dependencies: ['attendance.geofence'],
      rolloutPercentage: 100
    },
    'attendance.geofence': {
      enabled: true,
      name: 'Geofence Validation',
      description: 'Location-based attendance validation',
      category: 'Attendance',
      impact: 'high',
      dependencies: [],
      rolloutPercentage: 100
    },
    'attendance.offline': {
      enabled: true,
      name: 'Offline Attendance',
      description: 'Offline attendance with sync capability',
      category: 'Attendance',
      impact: 'medium',
      dependencies: ['attendance.biometric'],
      rolloutPercentage: 85
    },
    'attendance.manual_override': {
      enabled: false,
      name: 'Manual Attendance Override',
      description: 'Allow manual attendance corrections',
      category: 'Attendance',
      impact: 'medium',
      dependencies: [],
      rolloutPercentage: 0
    },

    // Task Management
    'tasks.three_slot': {
      enabled: true,
      name: 'Three-Slot Task Updates',
      description: 'Morning, Afternoon, Evening task slots',
      category: 'Tasks',
      impact: 'high',
      dependencies: [],
      rolloutPercentage: 100
    },
    'tasks.compliance_tracking': {
      enabled: true,
      name: 'Compliance Tracking',
      description: 'Track task compliance percentages',
      category: 'Tasks',
      impact: 'medium',
      dependencies: ['tasks.three_slot'],
      rolloutPercentage: 90
    },
    'tasks.auto_assignment': {
      enabled: false,
      name: 'Auto Task Assignment',
      description: 'Automatically assign tasks based on workload',
      category: 'Tasks',
      impact: 'low',
      dependencies: [],
      rolloutPercentage: 0
    },

    // Sales Features
    'sales.kanban_board': {
      enabled: true,
      name: 'Kanban Board View',
      description: 'Visual pipeline management',
      category: 'Sales',
      impact: 'high',
      dependencies: [],
      rolloutPercentage: 100
    },
    'sales.lead_scoring': {
      enabled: false,
      name: 'Lead Scoring',
      description: 'Automatic lead quality scoring',
      category: 'Sales',
      impact: 'medium',
      dependencies: [],
      rolloutPercentage: 25
    },
    'sales.email_integration': {
      enabled: false,
      name: 'Email Integration',
      description: 'Sync emails with lead communications',
      category: 'Sales',
      impact: 'low',
      dependencies: [],
      rolloutPercentage: 0
    },

    // Field Operations
    'field.gps_tracking': {
      enabled: true,
      name: 'GPS Tracking',
      description: 'Real-time field worker location tracking',
      category: 'Field',
      impact: 'high',
      dependencies: [],
      rolloutPercentage: 100
    },
    'field.visit_photos': {
      enabled: true,
      name: 'Visit Photo Capture',
      description: 'Capture photos during field visits',
      category: 'Field',
      impact: 'medium',
      dependencies: ['field.gps_tracking'],
      rolloutPercentage: 80
    },
    'field.expense_tracking': {
      enabled: false,
      name: 'Expense Tracking',
      description: 'Track field visit expenses',
      category: 'Field',
      impact: 'low',
      dependencies: [],
      rolloutPercentage: 0
    },

    // System Features
    'system.dark_mode': {
      enabled: true,
      name: 'Dark Mode',
      description: 'Dark theme support',
      category: 'System',
      impact: 'low',
      dependencies: [],
      rolloutPercentage: 100
    },
    'system.pwa': {
      enabled: true,
      name: 'Progressive Web App',
      description: 'PWA capabilities with offline support',
      category: 'System',
      impact: 'high',
      dependencies: [],
      rolloutPercentage: 100
    },
    'system.notifications': {
      enabled: true,
      name: 'Push Notifications',
      description: 'Real-time push notifications',
      category: 'System',
      impact: 'medium',
      dependencies: ['system.pwa'],
      rolloutPercentage: 95
    },
    'system.audit_logging': {
      enabled: true,
      name: 'Audit Logging',
      description: 'Comprehensive system audit trails',
      category: 'System',
      impact: 'high',
      dependencies: [],
      rolloutPercentage: 100
    },

    // Experimental Features
    'experimental.ai_insights': {
      enabled: false,
      name: 'AI Insights',
      description: 'AI-powered analytics and recommendations',
      category: 'Experimental',
      impact: 'low',
      dependencies: [],
      rolloutPercentage: 5
    },
    'experimental.voice_commands': {
      enabled: false,
      name: 'Voice Commands',
      description: 'Voice-controlled interface',
      category: 'Experimental',
      impact: 'low',
      dependencies: [],
      rolloutPercentage: 0
    },
    'experimental.advanced_reporting': {
      enabled: false,
      name: 'Advanced Reporting',
      description: 'Enhanced reporting with custom dashboards',
      category: 'Experimental',
      impact: 'medium',
      dependencies: [],
      rolloutPercentage: 15
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Attendance', 'Tasks', 'Sales', 'Field', 'System', 'Experimental'];

  const handleFeatureToggle = (featureKey) => {
    setFeatures(prev => ({
      ...prev,
      [featureKey]: {
        ...prev?.[featureKey],
        enabled: !prev?.[featureKey]?.enabled,
        rolloutPercentage: !prev?.[featureKey]?.enabled ? 100 : 0
      }
    }));
  };

  const handleRolloutChange = (featureKey, percentage) => {
    setFeatures(prev => ({
      ...prev,
      [featureKey]: {
        ...prev?.[featureKey],
        rolloutPercentage: percentage,
        enabled: percentage > 0
      }
    }));
  };

  const getFilteredFeatures = () => {
    const featureEntries = Object.entries(features);
    if (selectedCategory === 'All') {
      return featureEntries;
    }
    return featureEntries?.filter(([_, feature]) => feature?.category === selectedCategory);
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Attendance': return 'text-primary bg-primary/10';
      case 'Tasks': return 'text-employee bg-employee/10';
      case 'Sales': return 'text-sales bg-sales/10';
      case 'Field': return 'text-warning bg-warning/10';
      case 'System': return 'text-muted-foreground bg-muted';
      case 'Experimental': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getCategoryStats = () => {
    const stats = {};
    categories?.forEach(category => {
      if (category === 'All') return;
      const categoryFeatures = Object.values(features)?.filter(f => f?.category === category);
      const enabledCount = categoryFeatures?.filter(f => f?.enabled)?.length;
      stats[category] = {
        total: categoryFeatures?.length,
        enabled: enabledCount,
        percentage: categoryFeatures?.length > 0 ? Math.round((enabledCount / categoryFeatures?.length) * 100) : 0
      };
    });
    return stats;
  };

  const categoryStats = getCategoryStats();
  const filteredFeatures = getFilteredFeatures();

  const checkDependencies = (featureKey, targetState) => {
    const feature = features?.[featureKey];
    if (!targetState || !feature?.dependencies?.length) return [];
    
    const missingDeps = feature?.dependencies?.filter(dep => !features?.[dep]?.enabled);
    return missingDeps;
  };

  return (
    <div className="space-y-6">
      {/* Category Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Feature Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.slice(1)?.map((category) => (
            <div key={category} className="text-center">
              <div className={`w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center ${getCategoryColor(category)}`}>
                <span className="text-lg font-bold">
                  {categoryStats?.[category]?.enabled || 0}
                </span>
              </div>
              <div className="text-sm font-medium text-foreground">{category}</div>
              <div className="text-xs text-muted-foreground">
                {categoryStats?.[category]?.enabled}/{categoryStats?.[category]?.total} enabled
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Category Filter */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              {category !== 'All' && categoryStats?.[category] && (
                <span className="ml-2 text-xs opacity-70">
                  {categoryStats?.[category]?.enabled}/{categoryStats?.[category]?.total}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
      {/* Feature List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {selectedCategory === 'All' ? 'All Features' : `${selectedCategory} Features`}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage feature availability and rollout percentages
          </p>
        </div>

        <div className="divide-y divide-border">
          {filteredFeatures?.map(([featureKey, feature]) => {
            const missingDeps = checkDependencies(featureKey, !feature?.enabled);
            
            return (
              <div key={featureKey} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-base font-medium text-foreground">{feature?.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(feature?.category)}`}>
                        {feature?.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(feature?.impact)}`}>
                        {feature?.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{feature?.description}</p>
                    
                    {feature?.dependencies?.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs text-muted-foreground">Depends on: </span>
                        {feature?.dependencies?.map((dep, index) => (
                          <span key={dep} className="text-xs">
                            <span className={features?.[dep]?.enabled ? 'text-success' : 'text-error'}>
                              {features?.[dep]?.name || dep}
                            </span>
                            {index < feature?.dependencies?.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    )}

                    {missingDeps?.length > 0 && (
                      <div className="mb-3 p-2 bg-error/10 border border-error/20 rounded text-xs text-error">
                        <Icon name="AlertTriangle" size={12} className="inline mr-1" />
                        Missing dependencies: {missingDeps?.map(dep => features?.[dep]?.name || dep)?.join(', ')}
                      </div>
                    )}

                    {/* Rollout Percentage */}
                    {feature?.enabled && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">Rollout: {feature?.rolloutPercentage}%</span>
                          <span className="text-xs text-muted-foreground">
                            {feature?.rolloutPercentage === 100 ? 'Full rollout' : 'Gradual rollout'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={feature?.rolloutPercentage}
                            onChange={(e) => handleRolloutChange(featureKey, parseInt(e?.target?.value))}
                            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={feature?.rolloutPercentage}
                            onChange={(e) => handleRolloutChange(featureKey, parseInt(e?.target?.value) || 0)}
                            className="w-16 px-2 py-1 text-xs border border-border rounded bg-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${feature?.enabled ? 'text-success' : 'text-muted-foreground'}`}>
                        {feature?.enabled ? 'Enabled' : 'Disabled'}
                      </div>
                      {feature?.enabled && (
                        <div className="text-xs text-muted-foreground">
                          {feature?.rolloutPercentage}% rollout
                        </div>
                      )}
                    </div>
                    <Checkbox
                      checked={feature?.enabled}
                      onChange={() => handleFeatureToggle(featureKey)}
                      disabled={missingDeps?.length > 0}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Bulk Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Bulk Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              const updatedFeatures = { ...features };
              Object.keys(updatedFeatures)?.forEach(key => {
                if (updatedFeatures?.[key]?.category === 'Experimental') {
                  updatedFeatures[key].enabled = false;
                  updatedFeatures[key].rolloutPercentage = 0;
                }
              });
              setFeatures(updatedFeatures);
            }}
          >
            Disable All Experimental
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const updatedFeatures = { ...features };
              Object.keys(updatedFeatures)?.forEach(key => {
                if (updatedFeatures?.[key]?.impact === 'high') {
                  updatedFeatures[key].enabled = true;
                  updatedFeatures[key].rolloutPercentage = 100;
                }
              });
              setFeatures(updatedFeatures);
            }}
          >
            Enable All High Impact
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const updatedFeatures = { ...features };
              Object.keys(updatedFeatures)?.forEach(key => {
                if (updatedFeatures?.[key]?.category === selectedCategory || selectedCategory === 'All') {
                  updatedFeatures[key].rolloutPercentage = 50;
                  updatedFeatures[key].enabled = true;
                }
              });
              setFeatures(updatedFeatures);
            }}
          >
            Set 50% Rollout for {selectedCategory === 'All' ? 'All' : selectedCategory}
          </Button>
        </div>
      </div>
      {/* Save Changes */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">
          Reset to Defaults
        </Button>
        <Button>
          Apply Feature Changes
        </Button>
      </div>
    </div>
  );
};

export default FeatureFlags;