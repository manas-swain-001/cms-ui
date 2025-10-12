import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProfileInfoSection from './components/ProfileInfoSection';
import SecuritySettingsSection from './components/SecuritySettingsSection';
import BiometricEnrollmentSection from './components/BiometricEnrollmentSection';
import ShiftAssignmentSection from './components/ShiftAssignmentSection';
import NotificationPreferencesSection from './components/NotificationPreferencesSection';
import ThemePreferencesSection from './components/ThemePreferencesSection';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const UserProfileManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState({
    firstName: 'John',
    lastName: 'Smith',
    employeeId: 'EMP001',
    email: 'john.smith@smartxalgo.com',
    phone: '+91 9876543210',
    address: '123 Tech Park, Bhubaneswar, Odisha 751024',
    emergencyContact: '+91 9876543211',
    dateOfBirth: '1990-05-15',
    department: 'engineering',
    designation: 'senior_developer',
    reportingManager: 'Sarah Johnson',
    joinDate: '2022-03-15',
    officeLocation: 'Bhubaneswar Office',
    completionPercentage: 85
  });

  const [securitySettings, setSecuritySettings] = useState({
    lastPasswordChange: '15 Dec 2024',
    twoFactorEnabled: true,
    trustedDevices: [
      {
        id: 'device_1',
        name: 'MacBook Pro',
        type: 'desktop',
        location: 'Bhubaneswar, India',
        lastUsed: '2 hours ago',
        current: true
      },
      {
        id: 'device_2',
        name: 'iPhone 14',
        type: 'mobile',
        location: 'Bhubaneswar, India',
        lastUsed: '1 day ago',
        current: false
      },
      {
        id: 'device_3',
        name: 'iPad Air',
        type: 'tablet',
        location: 'Mumbai, India',
        lastUsed: '3 days ago',
        current: false
      }
    ]
  });

  const [biometricData, setBiometricData] = useState({
    templateId: 'bio_1703234567890',
    enrollmentDate: '2024-12-10T10:30:00Z',
    quality: 92
  });

  const [shiftData, setShiftData] = useState({
    regularShift: '9:00 AM - 6:00 PM',
    location: 'Bhubaneswar Office',
    team: 'Engineering Team A',
    weeklySchedule: [
      { date: '2025-01-13', status: 'completed', shift: '9:00-18:00' },
      { date: '2025-01-14', status: 'completed', shift: '9:00-18:00' },
      { date: '2025-01-15', status: 'completed', shift: '9:00-18:00' },
      { date: '2025-01-16', status: 'active', shift: '9:00-18:00' },
      { date: '2025-01-17', status: 'upcoming', shift: '9:00-18:00' },
      { date: '2025-01-18', status: 'upcoming', shift: 'Off' },
      { date: '2025-01-19', status: 'upcoming', shift: 'Off' }
    ],
    exceptions: [
      {
        id: 'exc_1',
        date: '2025-01-20',
        type: 'work_from_home',
        reason: 'Medical appointment in the morning',
        status: 'pending',
        submittedAt: '2025-01-12T14:30:00Z'
      },
      {
        id: 'exc_2',
        date: '2025-01-15',
        type: 'late_in',
        reason: 'Traffic due to heavy rain',
        status: 'approved',
        submittedAt: '2025-01-14T08:45:00Z'
      }
    ]
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    emailFrequency: 'daily',
    quietHours: '22:00-08:00',
    pushEnabled: true,
    showPreviews: true,
    soundEnabled: true,
    categories: {
      attendance: {
        checkInReminder: { email: true, push: true, inApp: true },
        overtimeAlert: { email: true, push: false, inApp: true },
        attendanceSummary: { email: true, push: false, inApp: false }
      },
      tasks: {
        taskAssignment: { email: true, push: true, inApp: true },
        taskDeadline: { email: true, push: true, inApp: true },
        taskCompletion: { email: false, push: false, inApp: true }
      },
      system: {
        systemMaintenance: { email: true, push: false, inApp: true },
        securityAlert: { email: true, push: true, inApp: true },
        featureUpdate: { email: false, push: false, inApp: true }
      },
      social: {
        teamAnnouncement: { email: true, push: false, inApp: true },
        socialEvent: { email: false, push: false, inApp: true },
        birthdayReminder: { email: false, push: false, inApp: true }
      }
    }
  });

  const [themeSettings, setThemeSettings] = useState({
    theme: 'light',
    accessibility: {
      fontSize: 'medium',
      contrast: 'normal',
      colorScheme: 'blue',
      reduceMotion: false,
      highContrast: false,
      largeText: false,
      focusIndicators: true
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: 'User' },
    { id: 'security', label: 'Security Settings', icon: 'Shield' },
    { id: 'biometric', label: 'Biometric Enrollment', icon: 'Scan' },
    { id: 'shift', label: 'Shift Assignment', icon: 'Calendar' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'theme', label: 'Theme & Appearance', icon: 'Palette' }
  ];

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('userThemeSettings');
    if (savedTheme) {
      setThemeSettings(JSON.parse(savedTheme));
    }

    const savedNotifications = localStorage.getItem('userNotificationPreferences');
    if (savedNotifications) {
      setNotificationPreferences(JSON.parse(savedNotifications));
    }
  }, []);

  const handleUpdateProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    // In real app, this would make an API call
    console.log('Profile updated:', updatedProfile);
  };

  const handleUpdateSecurity = (securityUpdate) => {
    console.log('Security update:', securityUpdate);
    
    switch (securityUpdate?.type) {
      case 'password':
        // Handle password change
        setSecuritySettings(prev => ({
          ...prev,
          lastPasswordChange: new Date()?.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        }));
        break;
      case 'twoFactor':
        setSecuritySettings(prev => ({
          ...prev,
          twoFactorEnabled: securityUpdate?.data?.enabled
        }));
        break;
      case 'removeDevice':
        setSecuritySettings(prev => ({
          ...prev,
          trustedDevices: prev?.trustedDevices?.filter(
            device => device?.id !== securityUpdate?.data?.deviceId
          )
        }));
        break;
    }
  };

  const handleUpdateBiometric = (biometricUpdate) => {
    setBiometricData(biometricUpdate);
    console.log('Biometric updated:', biometricUpdate);
  };

  const handleUpdateShift = (shiftUpdate) => {
    console.log('Shift update:', shiftUpdate);
    
    if (shiftUpdate?.type === 'exception') {
      setShiftData(prev => ({
        ...prev,
        exceptions: [...prev?.exceptions, shiftUpdate?.data]
      }));
    }
  };

  const handleUpdateNotifications = (updatedPreferences) => {
    setNotificationPreferences(updatedPreferences);
    localStorage.setItem('userNotificationPreferences', JSON.stringify(updatedPreferences));
    console.log('Notification preferences updated:', updatedPreferences);
  };

  const handleUpdateTheme = (updatedTheme) => {
    setThemeSettings(updatedTheme);
    localStorage.setItem('userThemeSettings', JSON.stringify(updatedTheme));
    
    // Apply theme to document
    document.documentElement?.setAttribute('data-theme', updatedTheme?.theme);
    document.documentElement?.setAttribute('data-font-size', updatedTheme?.accessibility?.fontSize);
    document.documentElement?.setAttribute('data-contrast', updatedTheme?.accessibility?.contrast);
    document.documentElement?.setAttribute('data-color-scheme', updatedTheme?.accessibility?.colorScheme);
    
    console.log('Theme settings updated:', updatedTheme);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileInfoSection
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'security':
        return (
          <SecuritySettingsSection
            securitySettings={securitySettings}
            onUpdateSecurity={handleUpdateSecurity}
          />
        );
      case 'biometric':
        return (
          <BiometricEnrollmentSection
            biometricData={biometricData}
            onUpdateBiometric={handleUpdateBiometric}
          />
        );
      case 'shift':
        return (
          <ShiftAssignmentSection
            shiftData={shiftData}
            onUpdateShift={handleUpdateShift}
          />
        );
      case 'notifications':
        return (
          <NotificationPreferencesSection
            preferences={notificationPreferences}
            onUpdatePreferences={handleUpdateNotifications}
          />
        );
      case 'theme':
        return (
          <ThemePreferencesSection
            themeSettings={themeSettings}
            onUpdateTheme={handleUpdateTheme}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } pt-16`}>
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">User Profile Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage your personal information, security settings, and preferences
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {userProfile?.firstName} {userProfile?.lastName}
                </div>
                <div className="text-xs text-muted-foreground">{userProfile?.employeeId}</div>
              </div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl">
            {renderActiveTab()}
          </div>

          {/* Quick Actions */}
          <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
            <Button
              variant="default"
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg"
              title="Help & Support"
            >
              <Icon name="HelpCircle" size={20} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg bg-card"
              title="Export Profile Data"
            >
              <Icon name="Download" size={20} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfileManagement;