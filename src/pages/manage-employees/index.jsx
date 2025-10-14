import React, { useState } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ManageEmployeeInfo from './components/ManageEmployeeInfo';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from 'components/ui/Header';
import { useManageEmployees } from './useManageEmployees';
import { saveUser } from 'api/users';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

const ManageEmployees = () => {

  const { getAllUsersData, getAllUsersLoading, refetchGetAllUsers } = useManageEmployees();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    phone: '',
    joinDate: '',
  });

  const { mutate: SaveUser } = useMutation({
    mutationKey: ['saveUserData'],
    mutationFn: saveUser,
    onSuccess: (res) => {
      console.log('User saved:', res);
      toast.success(res?.message || 'User saved successfully');
      refetchGetAllUsers();
      setUserProfile({
        id: 0,
        firstName: '',
        lastName: '',
        employeeId: '',
        email: '',
        phone: '',
        joinDate: '',
      });
    },
    onError: (err) => {
      console.log('Error saving user:', err);
      toast.error(err?.message);
    }
  })

  const handleUpdateProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    SaveUser(updatedProfile);
    // In real app, this would make an API call
    console.log('Profile updated:', updatedProfile);
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
              <h1 className="text-3xl font-bold text-foreground">Manage Employees</h1>
              <p className="text-muted-foreground mt-2">
                Manage your employee data
              </p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl">
            <ManageEmployeeInfo
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              data={getAllUsersData?.users || []}
            />
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

export default ManageEmployees;