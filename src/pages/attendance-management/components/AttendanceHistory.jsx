import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AttendanceHistory = ({ attendanceRecords, onFilterChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({
    dateRange: 'last_30_days',
    status: 'all',
    office: 'all',
    searchTerm: ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'early_out', label: 'Early Out' },
    { value: 'leave', label: 'On Leave' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' }
  ];

  const officeOptions = [
    { value: 'all', label: 'All Offices' },
    { value: 'bhubaneswar', label: 'Bhubaneswar Office' },
    { value: 'mumbai', label: 'Mumbai Office' },
    { value: 'delhi', label: 'Delhi Office' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setCurrentPage(1);
  };

  const getStatusBadge = (record) => {
    if (record?.status === 'present') {
      if (record?.isLate && record?.isEarlyOut) {
        return { label: 'Late & Early Out', color: 'bg-error text-error-foreground', icon: 'AlertTriangle' };
      } else if (record?.isLate) {
        return { label: 'Late', color: 'bg-warning text-warning-foreground', icon: 'Clock' };
      } else if (record?.isEarlyOut) {
        return { label: 'Early Out', color: 'bg-warning text-warning-foreground', icon: 'Clock' };
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
    return new Date(`2000-01-01T${timeString}`)?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '--';
    
    const checkInTime = new Date(`2000-01-01T${checkIn}`);
    const checkOutTime = new Date(`2000-01-01T${checkOut}`);
    const diffMs = checkOutTime - checkInTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    const hours = Math.floor(diffHours);
    const minutes = Math.floor((diffHours - hours) * 60);
    
    return `${hours}h ${minutes}m`;
  };

  // Pagination
  const totalPages = Math.ceil(attendanceRecords?.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRecords = attendanceRecords?.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">Attendance History</h3>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
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
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check In</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check Out</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Working Hours</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Location</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Verification</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords?.map((record, index) => {
              const statusBadge = getStatusBadge(record);
              return (
                <tr key={record?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="text-sm font-medium text-foreground">
                      {formatDate(record?.date)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(record.date)?.toLocaleDateString('en-IN', { weekday: 'short' })}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">
                      {formatTime(record?.checkIn)}
                    </div>
                    {record?.isLate && (
                      <div className="text-xs text-warning flex items-center space-x-1">
                        <Icon name="Clock" size={10} />
                        <span>Late by {record?.lateBy}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">
                      {formatTime(record?.checkOut)}
                    </div>
                    {record?.isEarlyOut && (
                      <div className="text-xs text-warning flex items-center space-x-1">
                        <Icon name="Clock" size={10} />
                        <span>Early by {record?.earlyBy}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">
                      {calculateWorkingHours(record?.checkIn, record?.checkOut)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge?.color}`}>
                      <Icon name={statusBadge?.icon} size={10} />
                      <span>{statusBadge?.label}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">{record?.office}</div>
                    {record?.distance && (
                      <div className="text-xs text-muted-foreground">
                        {record?.distance}m from office
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {record?.biometricVerified ? (
                        <div className="flex items-center space-x-1 text-success">
                          <Icon name="CheckCircle" size={12} />
                          <span className="text-xs">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-error">
                          <Icon name="XCircle" size={12} />
                          <span className="text-xs">Failed</span>
                        </div>
                      )}
                      {record?.managerApproved && (
                        <div className="flex items-center space-x-1 text-primary">
                          <Icon name="Shield" size={12} />
                          <span className="text-xs">Approved</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Icon name="Eye" size={14} />
                      </Button>
                      {record?.hasException && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-warning"
                        >
                          <Icon name="AlertTriangle" size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
    </div>
  );
};

export default AttendanceHistory;