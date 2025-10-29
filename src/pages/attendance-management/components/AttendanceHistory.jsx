import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Table from '../../../components/Table';
import { convertToIndianDateParts, formatDateToDDMMYYYY } from '../../../utils/function';
import { exportExcel } from '../../../api/attendance';
import { useGlobalContext } from '../../../context';
import { toast } from 'react-toastify';
import moment from 'moment';

const AttendanceHistory = ({ attendanceRecords }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [exportRange, setExportRange] = useState('this_month');
  const [isExporting, setIsExporting] = useState(false);
  
  const { userDataContext } = useGlobalContext();

  const getStatusBadge = (record) => {
    const lateMinutes = calculateLateMinutes(record?.sessions);
    const earlyMinutes = calculateEarlyMinutes(record?.sessions);
    
    if (record?.status === 'present' || record?.status === 'partial') {
      if (lateMinutes && earlyMinutes) {
        return { label: 'Late & Early Out', color: 'bg-error text-error-foreground', icon: 'AlertTriangle' };
      } else if (lateMinutes) {
        return { label: 'Late', color: 'bg-warning text-warning-foreground', icon: 'Clock' };
      } else if (earlyMinutes) {
        return { label: 'Early Out', color: 'bg-warning text-warning-foreground', icon: 'Clock' };
      }
      
      if (record?.status === 'partial') {
        return { label: 'Partial', color: 'bg-warning text-warning-foreground', icon: 'AlertCircle' };
      }
      
      return { label: 'Present', color: 'bg-success text-success-foreground', icon: 'CheckCircle' };
    }
    
    switch (record?.status) {
      case 'absent':
        return { label: 'Absent', color: 'bg-error text-error-foreground', icon: 'XCircle' };
      case 'leave':
        return { label: 'On Leave', color: 'bg-accent text-accent-foreground', icon: 'Plane' };
      case 'holiday':
        return { label: 'Holiday', color: 'bg-primary text-primary-foreground', icon: 'Calendar' };
      default:
        return { label: 'Unknown', color: 'bg-muted text-muted-foreground', icon: 'HelpCircle' };
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    return moment(timeString).format('hh:mm A');
  };

  const formatDate = (dateString) => {
    const { date, day } = convertToIndianDateParts(dateString);
    return { date, day };
  };

  const calculateWorkingHours = (totalHours) => {
    if (!totalHours || totalHours === 0) return '--';
    
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    
    return `${hours}h ${minutes}m`;
  };

  const calculateLateMinutes = (sessions) => {
    if (!sessions || sessions.length === 0) return null;
    
    const firstSession = sessions[0];
    // Look for late minutes in checkIn object
    if (firstSession?.checkIn?.isLate && firstSession?.checkIn?.lateMinutes > 0) {
      return firstSession.checkIn.lateMinutes;
    }
    
    return null;
  };

  const calculateEarlyMinutes = (sessions) => {
    if (!sessions || sessions.length === 0) return null;
    
    const lastSession = sessions[sessions.length - 1];
    // Look for early minutes in checkOut object
    if (lastSession?.checkOut?.isEarly && lastSession?.checkOut?.earlyMinutes > 0) {
      return lastSession.checkOut.earlyMinutes;
    }
    
    return null;
  };

  // Pagination
  const totalPages = Math.ceil(attendanceRecords?.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRecords = attendanceRecords?.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Export date range options
  const exportRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' }
  ];

  // Calculate date range based on selection
  const getDateRange = (range) => {
    const today = new Date();
    let startDate, endDate;

    switch (range) {
      case 'today':
        startDate = new Date(today);
        endDate = new Date(today);
        break;

      case 'last_7_days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        endDate = new Date(today);
        break;

      case 'this_month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
        break;

      case 'last_month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;

      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
    }

    return {
      startDate: formatDateToDDMMYYYY(startDate),
      endDate: formatDateToDDMMYYYY(endDate)
    };
  };

  // Handle export
  const handleExport = async () => {
    if (!userDataContext?.id) {
      toast.error('User not found');
      return;
    }

    try {
      setIsExporting(true);
      const { startDate, endDate } = getDateRange(exportRange);
      
      const headers = {
        'start-date': startDate,
        'end-date': endDate,
        'user-id': userDataContext.id
      };

      const blob = await exportExcel(headers);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const fileName = `Attendance_Report_${startDate.replace(/\//g, '-')}_to_${endDate.replace(/\//g, '-')}.xlsx`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error?.message || 'Failed to export attendance records');
    } finally {
      setIsExporting(false);
    }
  };

  // Define table columns
  const columns = [
    {
      header: 'Date',
      key: 'date',
      render: (value, record) => {
        const { date: formattedDate, day } = formatDate(record?.date);
        return (
          <div>
            <div className="text-sm font-medium text-foreground">
              {formattedDate}
            </div>
            <div className="text-xs text-muted-foreground">
              {day}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Check In',
      key: 'checkIn',
      render: (value, record) => {
        const checkInTime = record?.sessionSummary?.firstCheckIn || record?.sessions?.[0]?.checkIn?.time;
        const lateMinutes = calculateLateMinutes(record?.sessions);
        return (
          <div>
            <div className="text-sm text-foreground">
              {formatTime(checkInTime)}
            </div>
            {lateMinutes && (
              <div className="text-xs text-warning flex items-center space-x-1">
                <Icon name="Clock" size={10} />
                <span>Late by {lateMinutes} min</span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      header: 'Check Out',
      key: 'checkOut',
      render: (value, record) => {
        const checkOutTime = record?.sessionSummary?.lastCheckOut || record?.sessions?.[record?.sessions?.length - 1]?.checkOut?.time;
        const earlyMinutes = calculateEarlyMinutes(record?.sessions);
        return (
          <div>
            <div className="text-sm text-foreground">
              {formatTime(checkOutTime)}
            </div>
            {earlyMinutes && (
              <div className="text-xs text-warning flex items-center space-x-1">
                <Icon name="Clock" size={10} />
                <span>Early by {earlyMinutes} min</span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      header: 'Working Hours',
      key: 'workingHours',
      render: (value, record) => {
        const workingHours = calculateWorkingHours(record?.workSummary?.effectiveHours);
        return (
          <div className="text-sm text-foreground">
            {workingHours}
          </div>
        );
      }
    },
    {
      header: 'Status',
      key: 'status',
      render: (value, record) => {
        const statusBadge = getStatusBadge(record);
        const isWorkFromHome = record?.workLocation === 'home' || record?.workLocation === 'remote';
        return (
          <div className="flex flex-col gap-1">
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge?.color}`}>
              <Icon name={statusBadge?.icon} size={10} />
              <span>{statusBadge?.label}</span>
            </span>
            {isWorkFromHome && (
              <span className="text-xs text-muted-foreground">Work From Home</span>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">Attendance History</h3>
          
          {/* Filters */}
          {/* <div className="flex flex-col md:flex-row gap-3">
            <Input
              type="search"
              placeholder="Search records..."
              value={filters?.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e?.target?.value)}
              className="w-full md:w-48"
            />
            
            <Select
              options={dateRangeOptions}
              value={filters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
              className="w-full md:w-40"
            />
            
            <Select
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => handleFilterChange('status', value)}
              className="w-full md:w-32"
            />
            
            <Select
              options={officeOptions}
              value={filters?.office}
              onChange={(value) => handleFilterChange('office', value)}
              className="w-full md:w-36"
            />
          </div> */}
        </div>
      </div>
      
      {/* Table */}
      <Table 
        data={currentRecords} 
        columns={columns}
        className="border-0 rounded-none"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, attendanceRecords?.length)} of {attendanceRecords?.length} records
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Icon name="ChevronLeft" size={14} />
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-8 h-8"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Icon name="ChevronRight" size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Export Section */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Icon name="Download" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Export Attendance Report</span>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select
              options={exportRangeOptions}
              value={exportRange}
              onChange={(value) => setExportRange(value)}
              className="w-full md:w-48"
            />
            
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Icon name="FileSpreadsheet" size={16} />
                  <span>Export Excel</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;