import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MultiSelect from '../../components/ui/MultiSelect';
import Button from '../../components/ui/Button';
import Header from 'components/ui/Header';
import { useMutation } from '@tanstack/react-query';
import { getAllUsers } from 'api/users';
import { sendSalarySms } from 'api/sms';
import { toast } from 'react-toastify';

const SmsManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('salarySms');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all users for multi-select options
  const { mutate: fetchUsers } = useMutation({
    mutationKey: ['getAllUsers'],
    mutationFn: getAllUsers,
    onSuccess: (res) => {
      console.log('Users fetched:', res?.users);
      setEmployees(res?.users || []);
    },
    onError: (err) => {
      console.log('Error fetching users:', err);
      toast.error('Failed to fetch employees');
    }
  });

  // Send salary SMS mutation
  const { mutate: sendSms, isPending: isSendingSms } = useMutation({
    mutationKey: ['sendSalarySms'],
    mutationFn: sendSalarySms,
    onSuccess: (res) => {
      console.log('SMS sent successfully:', res);
      toast.success(res?.message || 'SMS sent successfully');
      setSelectedEmployees([]); // Clear selection after successful send
    },
    onError: (err) => {
      console.log('Error sending SMS:', err);
      toast.error(err?.message || 'Failed to send SMS');
    }
  });

  // Load employees on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle multi-select change
  const handleEmployeeChange = (selectedIds) => {
    console.log('Selected employee IDs:', selectedIds);
    setSelectedEmployees(selectedIds);
  };

  // Handle send button click
  const handleSendSms = () => {
    if (selectedEmployees.length === 0) {
      toast.warning('Please select at least one employee');
      return;
    }
    
    console.log('Sending SMS to employees with IDs:', selectedEmployees);
    
    // Prepare payload with array of user IDs as strings
    const payload = {
      userIds: selectedEmployees.map(id => String(id)) // Ensure IDs are strings
    };
    
    console.log('SMS payload:', payload);
    sendSms(payload);
  };

  // Prepare options for multi-select
  const employeeOptions = employees.map(employee => ({
    id: employee.id || employee._id,
    firstName: employee.firstName || '',
    lastName: employee.lastName || '',
    value: employee.id || employee._id,
    label: `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'Unknown Employee'
  }));

  const tabs = [
    { id: 'salarySms', label: 'Salary SMS', icon: 'MessageSquare' },
    { id: 'greetings', label: 'Greetings', icon: 'Heart' }
  ];

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
                Send salary notifications and greetings to employees
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl">
            {activeTab === 'salarySms' && (
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Send Salary SMS
                  </h2>
                  <p className="text-muted-foreground">
                    Select employees to send salary notifications via SMS
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Multi-Select for Employees */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Employees
                    </label>
                    <MultiSelect
                      options={employeeOptions}
                      value={selectedEmployees}
                      onChange={handleEmployeeChange}
                      placeholder="Search and select employees..."
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedEmployees.length} employee(s) selected
                    </p>
                  </div>

                  {/* Send Button */}
                  <div className="flex justify-end">
                    <Button
                      variant="default"
                      iconName="Send"
                      iconPosition="left"
                      onClick={handleSendSms}
                      disabled={selectedEmployees.length === 0 || isSendingSms}
                      loading={isSendingSms}
                    >
                      {isSendingSms ? 'Sending...' : 'Send SMS'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'greetings' && (
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Greetings SMS
                  </h2>
                  <p className="text-muted-foreground">
                    Greetings functionality coming soon...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
            <Button
              variant="default"
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg"
              title="Help & Support"
            >
              <span className="text-lg">?</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SmsManagement;