import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AuditLogs = () => {
  const [auditLogs] = useState([
    {
      id: 1,
      timestamp: new Date('2025-01-12T10:30:00'),
      userId: 'admin001',
      userName: 'Rajesh Kumar',
      userRole: 'Admin',
      action: 'UPDATE_ORGANIZATION_SETTINGS',
      category: 'Organization',
      description: 'Updated company profile information',
      details: {
        field: 'contactEmail',
        oldValue: 'old@smartxalgo.com',
        newValue: 'admin@smartxalgo.com'
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'medium'
    },
    {
      id: 2,
      timestamp: new Date('2025-01-12T10:15:00'),
      userId: 'admin002',
      userName: 'Priya Sharma',
      userRole: 'Office Admin',
      action: 'CREATE_USER',
      category: 'User Management',
      description: 'Created new user account for John Doe',
      details: {
        newUserId: 'emp123',
        role: 'Employee',
        office: 'Mumbai Office'
      },
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'high'
    },
    {
      id: 3,
      timestamp: new Date('2025-01-12T09:45:00'),
      userId: 'mgr001',
      userName: 'Amit Patel',
      userRole: 'Manager',
      action: 'OVERRIDE_ATTENDANCE',
      category: 'Attendance',
      description: 'Overrode attendance record for employee',
      details: {
        employeeId: 'emp456',
        employeeName: 'Sarah Wilson',
        date: '2025-01-11',
        reason: 'System malfunction during punch'
      },
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'high'
    },
    {
      id: 4,
      timestamp: new Date('2025-01-12T09:30:00'),
      userId: 'admin001',
      userName: 'Rajesh Kumar',
      userRole: 'Admin',
      action: 'UPDATE_ROLE_PERMISSIONS',
      category: 'Security',
      description: 'Modified role permissions for Manager role',
      details: {
        role: 'Manager',
        permission: 'users.create',
        action: 'granted'
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'high'
    },
    {
      id: 5,
      timestamp: new Date('2025-01-12T09:00:00'),
      userId: 'admin001',
      userName: 'Rajesh Kumar',
      userRole: 'Admin',
      action: 'TOGGLE_FEATURE_FLAG',
      category: 'System',
      description: 'Enabled biometric attendance feature',
      details: {
        feature: 'attendance.biometric',
        previousState: false,
        newState: true,
        rolloutPercentage: 100
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'medium'
    },
    {
      id: 6,
      timestamp: new Date('2025-01-12T08:45:00'),
      userId: 'admin002',
      userName: 'Priya Sharma',
      userRole: 'Office Admin',
      action: 'UPDATE_OFFICE_SETTINGS',
      category: 'Office Management',
      description: 'Updated geofence radius for Mumbai office',
      details: {
        office: 'Mumbai Office',
        field: 'geofenceRadius',
        oldValue: 300,
        newValue: 250
      },
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'medium'
    },
    {
      id: 7,
      timestamp: new Date('2025-01-12T08:30:00'),
      userId: 'admin001',
      userName: 'Rajesh Kumar',
      userRole: 'Admin',
      action: 'DELETE_USER',
      category: 'User Management',
      description: 'Deleted inactive user account',
      details: {
        deletedUserId: 'emp789',
        deletedUserName: 'Mark Johnson',
        reason: 'Employee resignation'
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'high'
    },
    {
      id: 8,
      timestamp: new Date('2025-01-12T08:15:00'),
      userId: 'admin001',
      userName: 'Rajesh Kumar',
      userRole: 'Admin',
      action: 'BACKUP_DATABASE',
      category: 'System',
      description: 'Initiated system backup',
      details: {
        backupType: 'full',
        size: '2.3 GB',
        duration: '15 minutes'
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'low'
    }
  ]);

  const [filters, setFilters] = useState({
    category: 'All',
    severity: 'All',
    dateRange: 'today',
    searchTerm: '',
    userId: 'All'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const categories = ['All', 'Organization', 'User Management', 'Attendance', 'Security', 'System', 'Office Management'];
  const severities = ['All', 'low', 'medium', 'high'];
  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const uniqueUsers = [...new Set(auditLogs.map(log => ({ id: log.userId, name: log.userName })))];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const getFilteredLogs = () => {
    return auditLogs?.filter(log => {
      const matchesCategory = filters?.category === 'All' || log?.category === filters?.category;
      const matchesSeverity = filters?.severity === 'All' || log?.severity === filters?.severity;
      const matchesUser = filters?.userId === 'All' || log?.userId === filters?.userId;
      const matchesSearch = !filters?.searchTerm || 
        log?.description?.toLowerCase()?.includes(filters?.searchTerm?.toLowerCase()) ||
        log?.userName?.toLowerCase()?.includes(filters?.searchTerm?.toLowerCase()) ||
        log?.action?.toLowerCase()?.includes(filters?.searchTerm?.toLowerCase());

      // Date range filtering (simplified for demo)
      let matchesDate = true;
      if (filters?.dateRange === 'today') {
        const today = new Date();
        matchesDate = log?.timestamp?.toDateString() === today?.toDateString();
      }

      return matchesCategory && matchesSeverity && matchesUser && matchesSearch && matchesDate;
    });
  };

  const filteredLogs = getFilteredLogs();
  const totalPages = Math.ceil(filteredLogs?.length / itemsPerPage);
  const paginatedLogs = filteredLogs?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Organization': return 'Building2';
      case 'User Management': return 'Users';
      case 'Attendance': return 'Clock';
      case 'Security': return 'Shield';
      case 'System': return 'Settings';
      case 'Office Management': return 'MapPin';
      default: return 'Activity';
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp?.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportLogs = () => {
    // Mock export functionality
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Category', 'Description', 'Severity'],
      ...filteredLogs?.map(log => [
        formatTimestamp(log?.timestamp),
        log?.userName,
        log?.action,
        log?.category,
        log?.description,
        log?.severity
      ])
    ]?.map(row => row?.join(','))?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Audit Log Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <select
              value={filters?.category}
              onChange={(e) => handleFilterChange('category', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories?.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Severity</label>
            <select
              value={filters?.severity}
              onChange={(e) => handleFilterChange('severity', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {severities?.map(severity => (
                <option key={severity} value={severity}>
                  {severity === 'All' ? 'All Severities' : severity?.charAt(0)?.toUpperCase() + severity?.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">User</label>
            <select
              value={filters?.userId}
              onChange={(e) => handleFilterChange('userId', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All">All Users</option>
              {uniqueUsers?.map(user => (
                <option key={user?.id} value={user?.id}>{user?.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
            <select
              value={filters?.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {dateRanges?.map(range => (
                <option key={range?.value} value={range?.value}>{range?.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Input
            placeholder="Search logs..."
            value={filters?.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e?.target?.value)}
            className="md:max-w-xs"
          />
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={exportLogs} iconName="Download">
              Export CSV
            </Button>
            <Button variant="outline" iconName="RefreshCw">
              Refresh
            </Button>
          </div>
        </div>
      </div>
      {/* Audit Logs Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Audit Logs</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {paginatedLogs?.length} of {filteredLogs?.length} entries
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error/20 rounded-full"></div>
                <span>High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning/20 rounded-full"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success/20 rounded-full"></div>
                <span>Low</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-foreground">Timestamp</th>
                <th className="text-left py-3 px-6 font-medium text-foreground">User</th>
                <th className="text-left py-3 px-6 font-medium text-foreground">Action</th>
                <th className="text-left py-3 px-6 font-medium text-foreground">Category</th>
                <th className="text-left py-3 px-6 font-medium text-foreground">Description</th>
                <th className="text-left py-3 px-6 font-medium text-foreground">Severity</th>
                <th className="text-left py-3 px-6 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs?.map((log) => (
                <tr key={log?.id} className="border-b border-border hover:bg-muted/20">
                  <td className="py-4 px-6 text-sm text-muted-foreground font-mono">
                    {formatTimestamp(log?.timestamp)}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-medium text-foreground">{log?.userName}</div>
                      <div className="text-xs text-muted-foreground">{log?.userRole}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {log?.action}
                    </code>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Icon name={getCategoryIcon(log?.category)} size={14} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{log?.category}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground max-w-xs truncate">
                    {log?.description}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log?.severity)}`}>
                      {log?.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Button variant="ghost" size="sm" iconName="Eye">
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  iconName="ChevronLeft"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  iconName="ChevronRight"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{filteredLogs?.length}</div>
              <div className="text-sm text-muted-foreground">Total Logs</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-error" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {filteredLogs?.filter(log => log?.severity === 'high')?.length}
              </div>
              <div className="text-sm text-muted-foreground">High Severity</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {filteredLogs?.filter(log => {
                  const today = new Date();
                  return log?.timestamp?.toDateString() === today?.toDateString();
                })?.length}
              </div>
              <div className="text-sm text-muted-foreground">Today's Logs</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} className="text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{uniqueUsers?.length}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;