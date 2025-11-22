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
import Input from '../../components/ui/Input';
import Header from 'components/ui/Header';
import { completeTasks, getTasksHistory, submitUpdate, exportTasksExcel } from 'api/tasks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useGlobalContext } from 'context';
import { toast } from 'react-toastify';
import { getEmployeesDropdown } from 'api/dashboard';
import { formatDateToDDMMYYYY } from 'utils/function';

const EmployeeTasksTracking = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('personal'); // personal, team
  const [isLoading, setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState({ left: 0, right: 0 });
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [tasksHistoryData, setTasksHistoryData] = useState([]);
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });
  const [toDate, setToDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });
  const [isExporting, setIsExporting] = useState(false);

  const { userDataContext, userRoleContext: userRole } = useGlobalContext();

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

  // console.log('completeTasksData :::: ', completeTasksData);

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
    const totalHours = tasksHistoryData?.length || 0;
    const totalMembers = teamData?.length || 5;

    let completedUpdates = 0;
    let pendingUpdates = 0;
    let overdueUpdates = 0;

    tasksHistoryData?.forEach(slot => {
      if (slot?.status === 'submitted') {
        completedUpdates++;
      } else if (slot?.status === 'warning_sent' || slot?.status === 'pending') {
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
  }, [tasksHistoryData]);

  const { data: employeesDropdownData, refetch: refetchEmployeesDropdown } = useQuery({
    queryKey: ['employeesDropdownData'],
    queryFn: getEmployeesDropdown,
    enabled: userRole === 'admin',
  });

  const { mutate: GetTasksHistory, status: GetTasksHistoryStatus } = useMutation({
    mutationFn: getTasksHistory,
    onSuccess: (data) => {
      console.log('GetTasksHistory data :::: ', data);
      // Extract scheduledEntries from the first item (since it's an array with one object)
      if (data && data.length > 0 && data[0].scheduledEntries) {
        setTasksHistoryData(data[0].scheduledEntries);
      } else {
        setTasksHistoryData([]);
      }
    },
    onError: (err) => {
      console.log('err :::: ', err);
      toast.error(err?.message);
      setTasksHistoryData([]);
    },
  });

  // console.log('employeesDropdownData :::: ', employeesDropdownData);
  console.log('selectedEmployee :::: ', selectedEmployee);
  console.log('tasksHistoryData :::: ', tasksHistoryData);

  // Transform employee data for dropdown
  const employeeOptions = employeesDropdownData?.map(emp => ({
    value: emp.id,
    label: emp.name
  })) || [];

  // Handle export
  const handleExport = async () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee first');
      return;
    }

    if (!fromDate || !toDate) {
      toast.error('Please select both from date and to date');
      return;
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (toDateObj < fromDateObj) {
      toast.error('To date cannot be before from date');
      return;
    }

    try {
      setIsExporting(true);
      
      const headers = {
        'start-date': formatDateToDDMMYYYY(fromDateObj),
        'end-date': formatDateToDDMMYYYY(toDateObj),
        'user-id': selectedEmployee
      };

      const blob = await exportTasksExcel(headers);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const fileName = `Task_Updates_${formatDateToDDMMYYYY(fromDateObj).replace(/\//g, '-')}_to_${formatDateToDDMMYYYY(toDateObj).replace(/\//g, '-')}.xlsx`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error?.message || 'Failed to export task updates');
    } finally {
      setIsExporting(false);
    }
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Employee Tasks Tracking</h1>
            </div>

            {/* Employee Dropdown and Date Range */}
            {userRole === 'admin' && (
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="w-full sm:w-64">
                  <Select
                    options={employeeOptions}
                    value={selectedEmployee}
                    onChange={(value) => {
                      GetTasksHistory({
                        'user-id': value,
                        'page': 1,
                        'limit': 10,
                        'start-date': formatDateToDDMMYYYY(new Date(fromDate)),
                        'end-date': formatDateToDDMMYYYY(new Date(toDate)),
                      })
                      setSelectedEmployee(value)
                    }
                    }
                    placeholder="Select from list"
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Date Range and Download Section */}
          {userRole === 'admin' && selectedEmployee && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="w-full sm:w-48">
                    <Input
                      label="From Date"
                      type="date"
                      value={fromDate}
                      onChange={(e) => {
                        setFromDate(e.target.value);
                        if (selectedEmployee) {
                          GetTasksHistory({
                            'user-id': selectedEmployee,
                            'page': 1,
                            'limit': 10,
                            'start-date': formatDateToDDMMYYYY(new Date(e.target.value)),
                            'end-date': formatDateToDDMMYYYY(new Date(toDate)),
                          });
                        }
                      }}
                      max={toDate}
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <Input
                      label="To Date"
                      type="date"
                      value={toDate}
                      onChange={(e) => {
                        setToDate(e.target.value);
                        if (selectedEmployee) {
                          GetTasksHistory({
                            'user-id': selectedEmployee,
                            'page': 1,
                            'limit': 10,
                            'start-date': formatDateToDDMMYYYY(new Date(fromDate)),
                            'end-date': formatDateToDDMMYYYY(new Date(e.target.value)),
                          });
                        }
                      }}
                      min={fromDate}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleExport}
                    disabled={isExporting || !selectedEmployee || !fromDate || !toDate}
                    className="flex items-center gap-2 whitespace-nowrap"
                    iconName={isExporting ? null : "FileSpreadsheet"}
                  >
                    {isExporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <span>Download Report</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Content */}
          {activeTab === 'personal' ? (
            <div className="w-full space-y-6">
              {/* Task Slots */}
              <div className="w-full space-y-6">
                {/* All Updates from API */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">All Updates</h3>
                  
                  {selectedEmployee ? (
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
                        {tasksHistoryData?.length > 0 ? (
                          tasksHistoryData?.map((slot, index) => (
                            <div key={index} className="flex-shrink-0 w-80">
                              <TaskSlotCard
                                slot={slot}
                                onUpdate={handleTaskUpdate}
                                isDisabled={true}
                                userName={employeeOptions.find(emp => emp.value === selectedEmployee)?.label || ''}
                                isLoading={isLoading}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="w-full flex items-center justify-center py-12 text-muted-foreground">
                            No task updates found for the selected date range
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center py-12 bg-muted/20 rounded-lg border border-dashed border-border">
                      <div className="text-center">
                        <Icon name="UserSearch" size={48} className="text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Please select an employee to view their task updates</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                {/* <div className="bg-card border border-border rounded-lg p-6">
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
                </div> */}
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

export default EmployeeTasksTracking;