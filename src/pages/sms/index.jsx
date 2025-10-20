import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SalarySms from './components/SalarySms';
import Greetings from './components/Greetings';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from 'components/ui/Header';
import secureStorage from 'hooks/secureStorage';
import { useGlobalContext } from 'context';
import { useMutation } from '@tanstack/react-query';
import { getUserById, updateUser } from 'api/users';
import { toast } from 'react-toastify';

const SmsManagement = () => {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('salarySms');

  const { userDataContext, userProfile, setUserProfile } = useGlobalContext();

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

  const tabs = [
    { id: 'salarySms', label: 'Salary SMS', icon: 'User' },
    { id: 'greetings', label: 'Greetings', icon: 'MessageCircle' },
  ];

  const { mutate: GetUserById } = useMutation({
    mutationKey: ['getUserById'],
    mutationFn: ({ id }) => getUserById(id),
    onSuccess: (res) => {
      console.log('User fetched:', res?.user);
      setUserProfile(res?.user);
    },
    onError: (err) => {
      console.log('Error fetching user:', err);
      toast.error(err?.message);
    }
  })

  const { mutate: UpdateUserById } = useMutation({
    mutationKey: ['updateUserById'],
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: (res) => {
      console.log('User updated:', res?.user);
      toast.success(res?.message || 'User updated successfully');
      GetUserById({ id: userDataContext?.id });
    },
    onError: (err) => {
      console.log('Error updating user:', err);
      toast.error(err?.message);
    }
  })

  const handleUpdateProfile = (updatedProfile) => {
    // console.log('Profile updated:', updatedProfile);
    const bodyPayload = {
      firstName: updatedProfile?.firstName,
      lastName: updatedProfile?.lastName,
      email: updatedProfile?.email,
      phone: updatedProfile?.phone,
      address: updatedProfile?.address,
      dataOfBirth: updatedProfile?.dateOfBirth,
    }
    console.log('bodyPayload :::::::: ', bodyPayload);
    UpdateUserById({ id: userDataContext?.id, payload: bodyPayload });
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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'salarySms':
        return (
          <SalarySms
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'greetings':
        return (
          <Greetings
            securitySettings={securitySettings}
            onUpdateSecurity={handleUpdateSecurity}
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
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        } pt-16`}>
        <div className="p-6">
          <Breadcrumb />

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">SMS Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage your salary SMS and greetings
              </p>
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
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${activeTab === tab?.id
                      ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
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

export default SmsManagement;