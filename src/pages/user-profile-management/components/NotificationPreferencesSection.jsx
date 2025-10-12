import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const NotificationPreferencesSection = ({ preferences, onUpdatePreferences }) => {
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const notificationCategories = [
    {
      id: 'attendance',
      label: 'Attendance & Time Tracking',
      icon: 'Clock',
      description: 'Check-in reminders, overtime alerts, and attendance summaries',
      settings: [
        { key: 'checkInReminder', label: 'Check-in Reminders', email: true, push: true, inApp: true },
        { key: 'overtimeAlert', label: 'Overtime Alerts', email: true, push: false, inApp: true },
        { key: 'attendanceSummary', label: 'Weekly Attendance Summary', email: true, push: false, inApp: false }
      ]
    },
    {
      id: 'tasks',
      label: 'Task Management',
      icon: 'CheckSquare',
      description: 'Task assignments, deadlines, and completion updates',
      settings: [
        { key: 'taskAssignment', label: 'New Task Assignments', email: true, push: true, inApp: true },
        { key: 'taskDeadline', label: 'Task Deadline Reminders', email: true, push: true, inApp: true },
        { key: 'taskCompletion', label: 'Task Completion Updates', email: false, push: false, inApp: true }
      ]
    },
    {
      id: 'system',
      label: 'System Updates',
      icon: 'Settings',
      description: 'System maintenance, security alerts, and feature updates',
      settings: [
        { key: 'systemMaintenance', label: 'System Maintenance Notices', email: true, push: false, inApp: true },
        { key: 'securityAlert', label: 'Security Alerts', email: true, push: true, inApp: true },
        { key: 'featureUpdate', label: 'New Feature Announcements', email: false, push: false, inApp: true }
      ]
    },
    {
      id: 'social',
      label: 'Team & Social',
      icon: 'Users',
      description: 'Team updates, announcements, and social activities',
      settings: [
        { key: 'teamAnnouncement', label: 'Team Announcements', email: true, push: false, inApp: true },
        { key: 'socialEvent', label: 'Social Events & Activities', email: false, push: false, inApp: true },
        { key: 'birthdayReminder', label: 'Birthday Reminders', email: false, push: false, inApp: true }
      ]
    }
  ];

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly Digest' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Digest' }
  ];

  const quietHoursOptions = [
    { value: 'none', label: 'No Quiet Hours' },
    { value: '22:00-08:00', label: '10:00 PM - 8:00 AM' },
    { value: '23:00-07:00', label: '11:00 PM - 7:00 AM' },
    { value: '21:00-09:00', label: '9:00 PM - 9:00 AM' }
  ];

  const handleSettingChange = (categoryId, settingKey, channel, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      categories: {
        ...prev?.categories,
        [categoryId]: {
          ...prev?.categories?.[categoryId],
          [settingKey]: {
            ...prev?.categories?.[categoryId]?.[settingKey],
            [channel]: value
          }
        }
      }
    }));
    setHasChanges(true);
  };

  const handleGlobalSettingChange = (key, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdatePreferences(localPreferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  };

  const toggleCategoryAll = (categoryId, enabled) => {
    const category = notificationCategories?.find(cat => cat?.id === categoryId);
    const updatedCategory = {};
    
    category?.settings?.forEach(setting => {
      updatedCategory[setting.key] = {
        email: enabled,
        push: enabled,
        inApp: enabled
      };
    });

    setLocalPreferences(prev => ({
      ...prev,
      categories: {
        ...prev?.categories,
        [categoryId]: updatedCategory
      }
    }));
    setHasChanges(true);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Bell" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Notification Preferences</h2>
            <p className="text-sm text-muted-foreground">Customize how and when you receive notifications</p>
          </div>
        </div>
        
        {hasChanges && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="default" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
      {/* Global Settings */}
      <div className="mb-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-medium text-foreground mb-4">Global Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Email Frequency"
            description="How often to send email notifications"
            options={frequencyOptions}
            value={localPreferences?.emailFrequency}
            onChange={(value) => handleGlobalSettingChange('emailFrequency', value)}
          />
          
          <Select
            label="Quiet Hours"
            description="No push notifications during these hours"
            options={quietHoursOptions}
            value={localPreferences?.quietHours}
            onChange={(value) => handleGlobalSettingChange('quietHours', value)}
          />
        </div>
        
        <div className="mt-4 space-y-3">
          <Checkbox
            label="Enable push notifications on mobile devices"
            checked={localPreferences?.pushEnabled}
            onChange={(e) => handleGlobalSettingChange('pushEnabled', e?.target?.checked)}
          />
          
          <Checkbox
            label="Show notification previews on lock screen"
            checked={localPreferences?.showPreviews}
            onChange={(e) => handleGlobalSettingChange('showPreviews', e?.target?.checked)}
          />
          
          <Checkbox
            label="Play sound for important notifications"
            checked={localPreferences?.soundEnabled}
            onChange={(e) => handleGlobalSettingChange('soundEnabled', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Category Settings */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-foreground">Notification Categories</h3>
        
        {notificationCategories?.map((category) => (
          <div key={category?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name={category?.icon} size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-foreground">{category?.label}</h4>
                  <p className="text-sm text-muted-foreground">{category?.description}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCategoryAll(category?.id, true)}
                >
                  Enable All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCategoryAll(category?.id, false)}
                >
                  Disable All
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Header Row */}
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                <div>Notification Type</div>
                <div className="text-center">Email</div>
                <div className="text-center">Push</div>
                <div className="text-center">In-App</div>
              </div>
              
              {/* Setting Rows */}
              {category?.settings?.map((setting) => (
                <div key={setting?.key} className="grid grid-cols-4 gap-4 items-center py-2">
                  <div className="text-sm text-foreground">{setting?.label}</div>
                  
                  <div className="flex justify-center">
                    <Checkbox
                      checked={localPreferences?.categories?.[category?.id]?.[setting?.key]?.email ?? setting?.email}
                      onChange={(e) => handleSettingChange(category?.id, setting?.key, 'email', e?.target?.checked)}
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <Checkbox
                      checked={localPreferences?.categories?.[category?.id]?.[setting?.key]?.push ?? setting?.push}
                      onChange={(e) => handleSettingChange(category?.id, setting?.key, 'push', e?.target?.checked)}
                      disabled={!localPreferences?.pushEnabled}
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <Checkbox
                      checked={localPreferences?.categories?.[category?.id]?.[setting?.key]?.inApp ?? setting?.inApp}
                      onChange={(e) => handleSettingChange(category?.id, setting?.key, 'inApp', e?.target?.checked)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Test Notifications */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-3">Test Notifications</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Send test notifications to verify your settings are working correctly
        </p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" iconName="Mail">
            Test Email
          </Button>
          <Button variant="outline" size="sm" iconName="Smartphone">
            Test Push
          </Button>
          <Button variant="outline" size="sm" iconName="Bell">
            Test In-App
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferencesSection;