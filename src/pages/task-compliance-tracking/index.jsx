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
import { completeTasks, submitUpdate } from 'api/tasks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useGlobalContext } from 'context';
import { toast } from 'react-toastify';

const TaskComplianceTracking = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('personal'); // personal, team
  const [isLoading, setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState({ left: 0, right: 0 });

  const { userDataContext } = useGlobalContext();

  const { data: completeTasksData, refetch: refetchCompleteTasks } = useQuery({
    queryKey: ['completeTasksData'],
    queryFn: completeTasks,
  });

  const { mutate: SubmitUpdate, status: SubmitUpdateStatus } = useMutation({
    mutationFn: submitUpdate,
    onSuccess: () => {
      toast.success('Update submitted successfully');
      refetchCompleteTasks();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  console.log('completeTasksData :::: ', completeTasksData);

  // Use API data
  const personalTasks = completeTasksData || [];

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

  // Calculate compliance stats for hourly updates
  const calculateStats = () => {
    const totalHours = personalTasks?.length || 0;
    const totalMembers = teamData?.length || 5;

    let completedUpdates = 0;
    let pendingUpdates = 0;
    let overdueUpdates = 0;

    personalTasks?.forEach(slot => {
      if (slot?.status === 'submitted') {
        completedUpdates++;
      } else if (slot?.status === 'warning_sent') {
        pendingUpdates++;
      } else if (slot?.status === 'escalated') {
        overdueUpdates++;
      }
    });

    const compliancePercentage = totalHours > 0 ? Math.round((completedUpdates / totalHours) * 100) : 0;

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

  const handleTaskUpdate = async (identifier, description) => {
    setIsLoading(true);
    try {
      SubmitUpdate({
        description: description,
      })
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (container) => {
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScrollLeft = scrollWidth - clientWidth;

    setScrollPosition({
      left: scrollLeft,
      right: maxScrollLeft - scrollLeft
    });
  };

  const scrollLeft = () => {
    const container = document.getElementById('completed-tasks-scroll');
    container.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = document.getElementById('completed-tasks-scroll');
    container.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Initialize scroll position on mount
  useEffect(() => {
    const container = document.getElementById('completed-tasks-scroll');
    if (container) {
      handleScroll(container);
    }
  }, [personalTasks]);

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
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        } pt-16`}>
        <div className="p-6 w-full">
          <Breadcrumb />

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Task Compliance Tracking</h1>
              <p className="text-muted-foreground mt-2">
                Manage hourly task updates and monitor compliance across 24-hour periods
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Select
                options={dateOptions}
                value="today"
                onChange={() => { }}
                className="w-40"
              />
              <Button
                variant="outline"
                iconName="Download"
                onClick={() => { }}
              >
                Export Report
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <ComplianceStats stats={stats} trends={trends} />
          </div>

          {/* Content */}
          {activeTab === 'personal' ? (
            <div className="w-full space-y-6">
              {/* Task Slots */}
              <div className="w-full space-y-6">
                {/* All Updates from API */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">All Updates</h3>
                  <div className="relative">
                    {/* Left Arrow - Only show if not at the leftmost position */}
                    {scrollPosition.left > 5 && (
                      <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl"
                      >
                        <Icon name="ChevronLeft" size={20} className="text-gray-600" />
                      </button>
                    )}

                    {/* Right Arrow - Only show if not at the rightmost position */}
                    {scrollPosition.right > 5 && (
                      <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl"
                      >
                        <Icon name="ChevronRight" size={20} className="text-gray-600" />
                      </button>
                    )}

                    {/* Scrollable Container */}
                    <div
                      id="completed-tasks-scroll"
                      className="flex gap-6 overflow-x-auto scrollbar-hide pb-2 w-full"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      onScroll={(e) => handleScroll(e.target)}
                    >
                      {personalTasks?.map((slot, index) => (
                        <div key={index} className="flex-shrink-0 w-80">
                          <TaskSlotCard
                            slot={slot}
                            onUpdate={handleTaskUpdate}
                            isDisabled={true}
                            userName={userDataContext?.fullName || userDataContext?.firstName}
                            isLoading={isLoading}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Next Update - New card for adding update */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Next Update</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <TaskSlotCard
                      slot={null}
                      onUpdate={handleTaskUpdate}
                      isDisabled={false}
                      userName={userDataContext?.fullName || userDataContext?.firstName}
                      isLoading={isLoading}
                      isNewUpdate={true}
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="History"
                      onClick={() => { }}
                    >
                      View History
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Copy"
                      onClick={() => { }}
                    >
                      Copy Yesterday's Tasks
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