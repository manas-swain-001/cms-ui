import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import TaskSlotCard from './components/TaskSlotCard';
import ComplianceMatrix from './components/ComplianceMatrix';
import TimeWindowIndicator from './components/TimeWindowIndicator';
import ComplianceStats from './components/ComplianceStats';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Header from 'components/ui/Header';

const TaskComplianceTracking = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('personal'); // personal, team
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data
  const currentUser = {
    id: 'user_001',
    name: 'Rajesh Kumar',
    role: 'employee', // employee, manager, admin
    team: 'Development Team A'
  };

  // Mock personal task data
  const [personalTasks, setPersonalTasks] = useState({
    morning: {
      type: 'morning',
      status: 'completed',
      description: `Completed code review for user authentication module\nFixed 3 critical bugs in payment gateway integration\nUpdated API documentation for new endpoints`,
      updatedAt: new Date(2025, 8, 12, 10, 30),
      updatedBy: 'Rajesh Kumar'
    },
    afternoon: {
      type: 'afternoon',
      status: 'pending',
      description: '',
      updatedAt: null,
      updatedBy: null
    },
    evening: {
      type: 'evening',
      status: 'pending',
      description: '',
      updatedAt: null,
      updatedBy: null
    }
  });

  // Mock team data
  const [teamData] = useState([
    {
      id: 'user_001',
      name: 'Rajesh Kumar',
      role: 'Senior Developer',
      slots: [
        { type: 'morning', status: 'completed' },
        { type: 'afternoon', status: 'pending' },
        { type: 'evening', status: 'pending' }
      ]
    },
    {
      id: 'user_002',
      name: 'Priya Sharma',
      role: 'Frontend Developer',
      slots: [
        { type: 'morning', status: 'completed' },
        { type: 'afternoon', status: 'completed' },
        { type: 'evening', status: 'pending' }
      ]
    },
    {
      id: 'user_003',
      name: 'Amit Patel',
      role: 'Backend Developer',
      slots: [
        { type: 'morning', status: 'overdue' },
        { type: 'afternoon', status: 'pending' },
        { type: 'evening', status: 'pending' }
      ]
    },
    {
      id: 'user_004',
      name: 'Sneha Reddy',
      role: 'Full Stack Developer',
      slots: [
        { type: 'morning', status: 'completed' },
        { type: 'afternoon', status: 'completed' },
        { type: 'evening', status: 'completed' }
      ]
    },
    {
      id: 'user_005',
      name: 'Vikram Singh',
      role: 'DevOps Engineer',
      slots: [
        { type: 'morning', status: 'completed' },
        { type: 'afternoon', status: 'pending' },
        { type: 'evening', status: 'pending' }
      ]
    }
  ]);

  // Calculate current time window
  const getCurrentTimeWindow = () => {
    const now = new Date();
    const currentHour = now?.getHours();
    
    if (currentHour >= 9 && currentHour < 12) {
      return { slot: 'morning', remaining: (12 - currentHour) * 60 - now?.getMinutes(), isActive: true };
    } else if (currentHour >= 12 && currentHour < 17) {
      return { slot: 'afternoon', remaining: (17 - currentHour) * 60 - now?.getMinutes(), isActive: true };
    } else if (currentHour >= 17 && currentHour < 20) {
      return { slot: 'evening', remaining: (20 - currentHour) * 60 - now?.getMinutes(), isActive: true };
    }
    return { slot: null, remaining: 0, isActive: false };
  };

  const [currentWindow, setCurrentWindow] = useState(getCurrentTimeWindow());

  // Update time window every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWindow(getCurrentTimeWindow());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Calculate compliance stats
  const calculateStats = () => {
    const totalMembers = teamData?.length;
    const totalSlots = totalMembers * 3; // 3 slots per member
    
    let completedUpdates = 0;
    let pendingUpdates = 0;
    let overdueUpdates = 0;
    
    teamData?.forEach(member => {
      member?.slots?.forEach(slot => {
        switch (slot?.status) {
          case 'completed':
            completedUpdates++;
            break;
          case 'overdue':
            overdueUpdates++;
            break;
          default:
            pendingUpdates++;
        }
      });
    });
    
    const compliancePercentage = totalSlots > 0 ? Math.round((completedUpdates / totalSlots) * 100) : 0;
    
    return {
      totalMembers,
      completedUpdates,
      pendingUpdates,
      overdueUpdates,
      compliancePercentage
    };
  };

  const stats = calculateStats();
  const trends = {
    complianceChange: 5.2, // Mock trend data
    completionRate: 12.8
  };

  const handleTaskUpdate = async (slotType, description) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPersonalTasks(prev => ({
      ...prev,
      [slotType]: {
        ...prev?.[slotType],
        status: 'completed',
        description,
        updatedAt: new Date(),
        updatedBy: currentUser?.name
      }
    }));
    
    setIsLoading(false);
  };

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' }
  ];

  const tabOptions = [
    { id: 'personal', label: 'My Tasks', icon: 'User' },
    { id: 'team', label: 'Team Overview', icon: 'Users' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } pt-16`}>
        <div className="p-6 max-w-7xl mx-auto">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Task Compliance Tracking</h1>
              <p className="text-muted-foreground mt-2">
                Manage daily task updates and monitor team compliance across time slots
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Select
                options={dateOptions}
                value="today"
                onChange={() => {}}
                className="w-40"
              />
              <Button
                variant="outline"
                iconName="Download"
                onClick={() => {}}
              >
                Export Report
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <ComplianceStats stats={stats} trends={trends} />
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
            {tabOptions?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab?.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'personal' ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Time Window Indicator */}
              <div className="xl:col-span-1">
                <TimeWindowIndicator
                  currentSlot={currentWindow?.slot}
                  timeRemaining={currentWindow?.remaining}
                  isWithinWindow={currentWindow?.isActive}
                />
              </div>

              {/* Task Slots */}
              <div className="xl:col-span-3 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {Object.values(personalTasks)?.map(slot => (
                    <TaskSlotCard
                      key={slot?.type}
                      slot={slot}
                      onUpdate={handleTaskUpdate}
                      isDisabled={!currentWindow?.isActive && currentWindow?.slot !== slot?.type}
                      timeRemaining={currentWindow?.slot === slot?.type ? currentWindow?.remaining : null}
                      userRole={currentUser?.role}
                    />
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="History"
                      onClick={() => {}}
                    >
                      View History
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Copy"
                      onClick={() => {}}
                    >
                      Copy Yesterday's Tasks
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Calendar"
                      onClick={() => {}}
                    >
                      Schedule Reminder
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="MessageSquare"
                      onClick={() => {}}
                    >
                      Request Extension
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <ComplianceMatrix
                teamData={teamData}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                userRole={currentUser?.role}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TaskComplianceTracking;