import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import AttendanceWidget from './components/AttendanceWidget';
import TaskComplianceWidget from './components/TaskComplianceWidget';
import SalesWidget from './components/SalesWidget';
import FieldVisitWidget from './components/FieldVisitWidget';
import SystemHealthWidget from './components/SystemHealthWidget';
import NotificationPanel from './components/NotificationPanel';
import QuickActionsPanel from './components/QuickActionsPanel';
import Icon from '../../components/AppIcon';
import Header from 'components/ui/Header';
import { useGlobalContext } from 'context';
import { useQuery } from '@tanstack/react-query';
import { dashboardData } from 'api/dashboard';

const MainDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { userRoleContext: userRole } = useGlobalContext();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const { data: adminOverviewData, isLoading: isAdminOverviewLoading } = useQuery({
    queryKey: ['adminOverviewData'],
    queryFn: dashboardData,
    enabled: userRole === 'admin',
  });

  console.log('adminOverviewData :::::::: ', adminOverviewData);

  // Mock data based on user role
  const getMockData = () => {
    const baseData = {
      attendance: {
        totalPresent: 142,
        lateArrivals: 8,
        absent: 12,
        onLeave: 5,
        teamPresent: 12,
        pendingApprovals: 3,
        monthlyPercentage: 94,
        todayStatus: 'Present'
      },
      tasks: {
        overallCompliance: 87,
        overdueTasks: 15,
        completedToday: 45,
        inProgress: 23,
        teamCompliance: 92,
        pendingReviews: 7,
        morningStatus: 'Completed',
        afternoonStatus: 'In Progress',
        eveningStatus: 'Pending',
        personalCompliance: 89,
        assigned: 8,
        completed: 6
      },
      sales: {
        totalPipeline: 125.5,
        conversionRate: 23,
        activeLeads: 67,
        closedDeals: 12,
        teamPipeline: 45.2,
        teamTargetProgress: 78,
        myPipeline: 15.8,
        myTargetProgress: 85,
        myActiveLeads: 8,
        monthlyRevenue: 3.2,
        totalRevenue: 89.7,
        activeDeals: 34,
        leads: 120,
        qualified: 85,
        proposal: 45,
        negotiation: 28,
        closed: 12
      },
      field: {
        activeVisits: 8,
        completedToday: 15,
        totalDistance: 245,
        leadsGenerated: 6,
        teamActive: 5,
        avgDistance: 32,
        currentStatus: 'On Visit',
        todayDistance: 45,
        visitsCompleted: 3,
        leadsCreated: 2,
        completed: 12
      }
    };

    return baseData;
  };

  const mockData = getMockData();

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'System Administrator';
      case 'manager': return 'Team Manager';
      case 'employee': return 'Employee';
      case 'sales': return 'Sales Representative';
      case 'field': return 'Field Worker';
      default: return 'User';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-admin';
      case 'manager': return 'text-warning';
      case 'employee': return 'text-employee';
      case 'sales': return 'text-sales';
      case 'field': return 'text-field';
      default: return 'text-primary';
    }
  };

  return (
    <>
      <Helmet>
        <title>Main Dashboard - SmartXAlgo CRM</title>
        <meta name="description" content="SmartXAlgo CRM main dashboard with role-based overview of key metrics and quick access to primary functions" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          }`}>
          <div className="p-6">
            <Breadcrumb />

            {/* Dashboard Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Welcome back! 👋
                  </h1>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Icon name="Calendar" size={16} />
                      <span className="text-sm">{formatDate(currentTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={16} />
                      <span className="text-sm">{formatTime(currentTime)} IST</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="User" size={16} />
                      <span className={`text-sm font-medium ${getRoleColor(userRole)}`}>
                        {getRoleDisplayName(userRole)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Building2" size={16} />
                    <span>Bhubaneswar Office</span>
                    <div className="w-2 h-2 bg-success rounded-full ml-2" />
                    <span className="text-success">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {/* Attendance Widget */}
              <AttendanceWidget
                userRole={userRole}
                attendanceData={adminOverviewData?.attendance}
              />

              {/* Task Compliance Widget */}
              {/* {(['admin', 'manager']?.includes(userRole)) && (
                <TaskComplianceWidget
                  userRole={userRole}
                  taskData={mockData?.tasks}
                />
              )} */}

              {/* Sales Widget - Show for admin, manager, sales */}
              {/* {(['admin', 'manager', 'sales']?.includes(userRole)) && (
                <SalesWidget 
                  userRole={userRole} 
                  salesData={mockData?.sales} 
                />
              )} */}

              {/* Field Visit Widget - Show for admin, manager, field */}
              {/* {(['admin', 'manager', 'field']?.includes(userRole)) && (
                <FieldVisitWidget 
                  userRole={userRole} 
                  fieldData={mockData?.field} 
                />
              )} */}

              {/* System Health Widget - Admin only */}
              {/* <SystemHealthWidget userRole={userRole} /> */}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notifications Panel */}
              {/* <NotificationPanel userRole={userRole} /> */}

              {/* Quick Actions Panel */}
              {/* <QuickActionsPanel userRole={userRole} /> */}
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>Last updated: {formatTime(currentTime)}</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span>Real-time sync active</span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span>© {new Date()?.getFullYear()} SmartXAlgo CRM. All rights reserved.</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MainDashboard;