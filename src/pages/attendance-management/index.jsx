import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PunchInterface from './components/PunchInterface';
import AttendanceCalendar from './components/AttendanceCalendar';
import AttendanceHistory from './components/AttendanceHistory';
import SyncStatusPanel from './components/SyncStatusPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from 'components/ui/Header';
import { useAttendanceManagement } from './useAttendanceManagement';
import { useGlobalContext } from 'context';
import { useMutation } from '@tanstack/react-query';
import { punchIn, punchOut } from 'api/attendance';
import { toast } from 'react-toastify';
import secureStorage from 'hooks/secureStorage';

const AttendanceManagement = () => {
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('punch'); // punch, calendar, history


  const { gpsStatus, formattedDistance, refetchCurrentStatus, GetRecords } = useAttendanceManagement();
  const { currentStatus, setCurrentStatus } = useGlobalContext();

  // Mock attendance data
  const attendanceData = [
    {
      date: '2024-12-12',
      status: 'present',
      checkIn: '09:15:00',
      checkOut: '18:30:00',
      isLate: true,
      lateBy: '15 min',
      isEarlyOut: false
    },
    {
      date: '2024-12-11',
      status: 'present',
      checkIn: '09:00:00',
      checkOut: '17:45:00',
      isLate: false,
      isEarlyOut: true,
      earlyBy: '15 min'
    },
    {
      date: '2024-12-10',
      status: 'present',
      checkIn: '08:45:00',
      checkOut: '18:00:00',
      isLate: false,
      isEarlyOut: false
    },
    {
      date: '2024-12-09',
      status: 'absent'
    },
    {
      date: '2024-12-08',
      status: 'weekend'
    },
    {
      date: '2024-12-07',
      status: 'weekend'
    },
    {
      date: '2024-12-06',
      status: 'present',
      checkIn: '09:30:00',
      checkOut: '18:15:00',
      isLate: true,
      lateBy: '30 min',
      isEarlyOut: false
    }
  ];

  const { mutate: PunchIn } = useMutation({
    mutationKey: ['punchIn'],
    mutationFn: punchIn,
    onSuccess: (res) => {
      console.log('res :::: ', res);
      toast.success(res?.message || 'Punch in successful');
      refetchCurrentStatus();
    },
    onError: (err) => {
      console.log('err :::: ', err);
      toast.error(err?.message);
    }
  });

  const { mutate: PunchOut } = useMutation({
    mutationKey: ['punchOut'],
    mutationFn: punchOut,
    onSuccess: (res) => {
      console.log('res :::: ', res);
      toast.success(res?.message || 'Punch out successful');
      refetchCurrentStatus();
    },
    onError: (err) => {
      console.log('err :::: ', err);
      toast.error(err?.message);
    }
  });

  const handlePunchAction = (punchData) => {
    console.log('Punch action:', punchData);

    const payloadData = {
      location: punchData?.location,
      user: {
        _id: secureStorage.getItem('userData')?._id,
      }
    }

    console.log('payloadData :::: ', payloadData);

    if (punchData?.type === 'check_in') {
      PunchIn(payloadData);
    } else if (punchData?.type === 'check_out') {
      PunchOut(payloadData);
    } else {
      toast.error('Invalid punch type');
    }

  };

  const handleSyncAction = (action) => {
    console.log('Sync action:', action);
    // Handle sync operations
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}>
        <div className="p-6">
          <Breadcrumb />

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Attendance Management</h1>
              <p className="text-muted-foreground">
                Track attendance with geofencing and biometric verification
              </p>
            </div>

            {/* Quick Stats */}
            {/* <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-lg font-semibold text-success">95.2%</div>
                <div className="text-xs text-muted-foreground">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">8h 15m</div>
                <div className="text-xs text-muted-foreground">Today</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-warning">2</div>
                <div className="text-xs text-muted-foreground">Exceptions</div>
              </div>
            </div> */}
          </div>

          {/* Mobile Tab Navigation */}
          <div className="md:hidden mb-6">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('punch')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'punch' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon name="Clock" size={16} className="inline mr-2" />
                Punch
              </button>
              {/* <button
                onClick={() => setActiveTab('calendar')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'calendar' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon name="Calendar" size={16} className="inline mr-2" />
                Calendar
              </button> */}
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'history' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon name="History" size={16} className="inline mr-2" />
                History
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-12 gap-6">
            {/* Left Column - Punch Interface */}
            <div className="col-span-5">
              <div className="space-y-6">
                <PunchInterface
                  onPunchAction={handlePunchAction}
                  currentStatus={currentStatus}
                  gpsStatus={gpsStatus}
                  officeDistance={formattedDistance}
                />

                {/* <SyncStatusPanel onSyncAction={handleSyncAction} /> */}
              </div>
            </div>

            {/* Right Column - Calendar and History */}
            <div className="col-span-7">
              <div className="space-y-6">
                {/* <AttendanceCalendar
                  attendanceData={attendanceData}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                /> */}

                <AttendanceHistory
                  attendanceRecords={GetRecords || []}
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            {activeTab === 'punch' && (
              <div className="space-y-6">
                <PunchInterface
                  onPunchAction={handlePunchAction}
                  currentStatus={currentStatus}
                  gpsStatus={gpsStatus}
                  officeDistance={formattedDistance}
                />
                {/* <SyncStatusPanel onSyncAction={handleSyncAction} /> */}
              </div>
            )}

            {activeTab === 'calendar' && (
              <AttendanceCalendar
                attendanceData={attendanceData}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            )}

            {activeTab === 'history' && (
              <AttendanceHistory
                attendanceRecords={GetRecords || []}
              />
            )}
          </div>

          {/* Quick Actions (Desktop) */}
          <div className="hidden md:block mt-8">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <Icon name="Info" size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Need help with attendance? Check our guidelines or contact HR.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  View Guidelines
                </Button>
                <Button variant="outline" size="sm">
                  Contact HR
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceManagement;