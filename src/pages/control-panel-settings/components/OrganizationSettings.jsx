import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const OrganizationSettings = () => {
  const [organizationData, setOrganizationData] = useState({
    companyName: "SmartXAlgo Technologies",
    companyCode: "SXA001",
    registrationNumber: "U72900OR2020PTC032156",
    gstNumber: "21AABCS1234C1Z5",
    panNumber: "AABCS1234C",
    address: "Plot No. 123, Infocity, Bhubaneswar, Odisha 751024",
    contactEmail: "admin@smartxalgo.com",
    contactPhone: "+91 9876543210",
    website: "https://www.smartxalgo.com",
    timezone: "Asia/Kolkata",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    weekStartsOn: "Monday"
  });

  const [attendancePolicy, setAttendancePolicy] = useState({
    standardWorkingHours: 8,
    lateThresholdMinutes: 15,
    halfDayThresholdHours: 4,
    overtimeThresholdHours: 9,
    geofenceRadius: 300,
    allowManualPunch: false,
    requireReasonForLate: true,
    autoClockOut: true,
    autoClockOutTime: "19:00"
  });

  const [biometricSettings, setBiometricSettings] = useState({
    faceMatchThreshold: 0.85,
    livenessDetectionEnabled: true,
    maxEnrollmentAttempts: 3,
    templateExpiryDays: 365,
    allowFallbackPunch: true,
    deviceRestrictionEnabled: false,
    qualityThreshold: 0.7
  });

  const [holidayCalendar, setHolidayCalendar] = useState([
    { id: 1, name: "New Year\'s Day", date: "2025-01-01", type: "National", mandatory: true },
    { id: 2, name: "Republic Day", date: "2025-01-26", type: "National", mandatory: true },
    { id: 3, name: "Holi", date: "2025-03-14", type: "Festival", mandatory: false },
    { id: 4, name: "Good Friday", date: "2025-04-18", type: "Religious", mandatory: false },
    { id: 5, name: "Independence Day", date: "2025-08-15", type: "National", mandatory: true },
    { id: 6, name: "Gandhi Jayanti", date: "2025-10-02", type: "National", mandatory: true },
    { id: 7, name: "Diwali", date: "2025-10-20", type: "Festival", mandatory: false },
    { id: 8, name: "Christmas", date: "2025-12-25", type: "Religious", mandatory: false }
  ]);

  const [newHoliday, setNewHoliday] = useState({
    name: "",
    date: "",
    type: "National",
    mandatory: true
  });

  const [isAddingHoliday, setIsAddingHoliday] = useState(false);

  const handleOrganizationChange = (field, value) => {
    setOrganizationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAttendancePolicyChange = (field, value) => {
    setAttendancePolicy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBiometricSettingsChange = (field, value) => {
    setBiometricSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkingDayToggle = (day) => {
    const updatedDays = organizationData?.workingDays?.includes(day)
      ? organizationData?.workingDays?.filter(d => d !== day)
      : [...organizationData?.workingDays, day];
    
    handleOrganizationChange('workingDays', updatedDays);
  };

  const handleAddHoliday = () => {
    if (newHoliday?.name && newHoliday?.date) {
      const holiday = {
        id: Date.now(),
        ...newHoliday
      };
      setHolidayCalendar(prev => [...prev, holiday]);
      setNewHoliday({ name: "", date: "", type: "National", mandatory: true });
      setIsAddingHoliday(false);
    }
  };

  const handleDeleteHoliday = (id) => {
    setHolidayCalendar(prev => prev?.filter(h => h?.id !== id));
  };

  const getHolidayTypeColor = (type) => {
    switch (type) {
      case 'National': return 'bg-primary/10 text-primary';
      case 'Festival': return 'bg-warning/10 text-warning';
      case 'Religious': return 'bg-accent/10 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-8">
      {/* Company Profile Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Building2" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Company Profile</h3>
            <p className="text-sm text-muted-foreground">Basic organization information and settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            value={organizationData?.companyName}
            onChange={(e) => handleOrganizationChange('companyName', e?.target?.value)}
            required
          />
          <Input
            label="Company Code"
            value={organizationData?.companyCode}
            onChange={(e) => handleOrganizationChange('companyCode', e?.target?.value)}
            required
          />
          <Input
            label="Registration Number"
            value={organizationData?.registrationNumber}
            onChange={(e) => handleOrganizationChange('registrationNumber', e?.target?.value)}
          />
          <Input
            label="GST Number"
            value={organizationData?.gstNumber}
            onChange={(e) => handleOrganizationChange('gstNumber', e?.target?.value)}
          />
          <Input
            label="PAN Number"
            value={organizationData?.panNumber}
            onChange={(e) => handleOrganizationChange('panNumber', e?.target?.value)}
          />
          <Input
            label="Contact Email"
            type="email"
            value={organizationData?.contactEmail}
            onChange={(e) => handleOrganizationChange('contactEmail', e?.target?.value)}
            required
          />
          <Input
            label="Contact Phone"
            type="tel"
            value={organizationData?.contactPhone}
            onChange={(e) => handleOrganizationChange('contactPhone', e?.target?.value)}
            required
          />
          <Input
            label="Website"
            type="url"
            value={organizationData?.website}
            onChange={(e) => handleOrganizationChange('website', e?.target?.value)}
          />
        </div>

        <div className="mt-6">
          <Input
            label="Address"
            value={organizationData?.address}
            onChange={(e) => handleOrganizationChange('address', e?.target?.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
            <select
              value={organizationData?.timezone}
              onChange={(e) => handleOrganizationChange('timezone', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="Asia/Mumbai">Asia/Mumbai (IST)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
            <select
              value={organizationData?.currency}
              onChange={(e) => handleOrganizationChange('currency', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date Format</label>
            <select
              value={organizationData?.dateFormat}
              onChange={(e) => handleOrganizationChange('dateFormat', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>

        {/* Working Days */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground mb-3">Working Days</label>
          <div className="flex flex-wrap gap-3">
            {daysOfWeek?.map((day) => (
              <Checkbox
                key={day}
                label={day}
                checked={organizationData?.workingDays?.includes(day)}
                onChange={() => handleWorkingDayToggle(day)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Attendance Policy Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Attendance Policy</h3>
            <p className="text-sm text-muted-foreground">Configure attendance rules and thresholds</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            label="Standard Working Hours"
            type="number"
            value={attendancePolicy?.standardWorkingHours}
            onChange={(e) => handleAttendancePolicyChange('standardWorkingHours', parseInt(e?.target?.value))}
            min="1"
            max="12"
          />
          <Input
            label="Late Threshold (Minutes)"
            type="number"
            value={attendancePolicy?.lateThresholdMinutes}
            onChange={(e) => handleAttendancePolicyChange('lateThresholdMinutes', parseInt(e?.target?.value))}
            min="0"
            max="60"
          />
          <Input
            label="Half Day Threshold (Hours)"
            type="number"
            value={attendancePolicy?.halfDayThresholdHours}
            onChange={(e) => handleAttendancePolicyChange('halfDayThresholdHours', parseInt(e?.target?.value))}
            min="1"
            max="8"
          />
          <Input
            label="Overtime Threshold (Hours)"
            type="number"
            value={attendancePolicy?.overtimeThresholdHours}
            onChange={(e) => handleAttendancePolicyChange('overtimeThresholdHours', parseInt(e?.target?.value))}
            min="8"
            max="16"
          />
          <Input
            label="Geofence Radius (Meters)"
            type="number"
            value={attendancePolicy?.geofenceRadius}
            onChange={(e) => handleAttendancePolicyChange('geofenceRadius', parseInt(e?.target?.value))}
            min="50"
            max="1000"
          />
          <Input
            label="Auto Clock Out Time"
            type="time"
            value={attendancePolicy?.autoClockOutTime}
            onChange={(e) => handleAttendancePolicyChange('autoClockOutTime', e?.target?.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Checkbox
            label="Allow Manual Punch"
            description="Enable manual attendance entry for emergencies"
            checked={attendancePolicy?.allowManualPunch}
            onChange={(e) => handleAttendancePolicyChange('allowManualPunch', e?.target?.checked)}
          />
          <Checkbox
            label="Require Reason for Late"
            description="Mandatory reason when punching late"
            checked={attendancePolicy?.requireReasonForLate}
            onChange={(e) => handleAttendancePolicyChange('requireReasonForLate', e?.target?.checked)}
          />
          <Checkbox
            label="Auto Clock Out"
            description="Automatically clock out at specified time"
            checked={attendancePolicy?.autoClockOut}
            onChange={(e) => handleAttendancePolicyChange('autoClockOut', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Biometric Settings Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Scan" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Biometric Settings</h3>
            <p className="text-sm text-muted-foreground">Configure face recognition and biometric parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Face Match Threshold ({(biometricSettings?.faceMatchThreshold * 100)?.toFixed(0)}%)
            </label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={biometricSettings?.faceMatchThreshold}
              onChange={(e) => handleBiometricSettingsChange('faceMatchThreshold', parseFloat(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Quality Threshold ({(biometricSettings?.qualityThreshold * 100)?.toFixed(0)}%)
            </label>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.05"
              value={biometricSettings?.qualityThreshold}
              onChange={(e) => handleBiometricSettingsChange('qualityThreshold', parseFloat(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>30%</span>
              <span>100%</span>
            </div>
          </div>
          <Input
            label="Max Enrollment Attempts"
            type="number"
            value={biometricSettings?.maxEnrollmentAttempts}
            onChange={(e) => handleBiometricSettingsChange('maxEnrollmentAttempts', parseInt(e?.target?.value))}
            min="1"
            max="10"
          />
          <Input
            label="Template Expiry (Days)"
            type="number"
            value={biometricSettings?.templateExpiryDays}
            onChange={(e) => handleBiometricSettingsChange('templateExpiryDays', parseInt(e?.target?.value))}
            min="30"
            max="730"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Checkbox
            label="Liveness Detection"
            description="Prevent spoofing with liveness checks"
            checked={biometricSettings?.livenessDetectionEnabled}
            onChange={(e) => handleBiometricSettingsChange('livenessDetectionEnabled', e?.target?.checked)}
          />
          <Checkbox
            label="Allow Fallback Punch"
            description="Enable PIN/password fallback when biometric fails"
            checked={biometricSettings?.allowFallbackPunch}
            onChange={(e) => handleBiometricSettingsChange('allowFallbackPunch', e?.target?.checked)}
          />
          <Checkbox
            label="Device Restriction"
            description="Restrict biometric enrollment to specific devices"
            checked={biometricSettings?.deviceRestrictionEnabled}
            onChange={(e) => handleBiometricSettingsChange('deviceRestrictionEnabled', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Holiday Calendar Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Holiday Calendar</h3>
              <p className="text-sm text-muted-foreground">Manage organization holidays and observances</p>
            </div>
          </div>
          <Button
            variant="outline"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setIsAddingHoliday(true)}
          >
            Add Holiday
          </Button>
        </div>

        {isAddingHoliday && (
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-foreground mb-4">Add New Holiday</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Holiday Name"
                value={newHoliday?.name}
                onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e?.target?.value }))}
                placeholder="Enter holiday name"
              />
              <Input
                label="Date"
                type="date"
                value={newHoliday?.date}
                onChange={(e) => setNewHoliday(prev => ({ ...prev, date: e?.target?.value }))}
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Type</label>
                <select
                  value={newHoliday?.type}
                  onChange={(e) => setNewHoliday(prev => ({ ...prev, type: e?.target?.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="National">National</option>
                  <option value="Festival">Festival</option>
                  <option value="Religious">Religious</option>
                </select>
              </div>
              <div className="flex items-end space-x-2">
                <Checkbox
                  label="Mandatory"
                  checked={newHoliday?.mandatory}
                  onChange={(e) => setNewHoliday(prev => ({ ...prev, mandatory: e?.target?.checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAddingHoliday(false);
                  setNewHoliday({ name: "", date: "", type: "National", mandatory: true });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddHoliday}>
                Add Holiday
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-foreground">Holiday Name</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Type</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Mandatory</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holidayCalendar?.map((holiday) => (
                <tr key={holiday?.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 text-foreground font-medium">{holiday?.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(holiday.date)?.toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHolidayTypeColor(holiday?.type)}`}>
                      {holiday?.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {holiday?.mandatory ? (
                      <Icon name="Check" size={16} className="text-success" />
                    ) : (
                      <Icon name="X" size={16} className="text-muted-foreground" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => handleDeleteHoliday(holiday?.id)}
                      className="text-error hover:text-error"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Save Changes */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">
          Reset to Defaults
        </Button>
        <Button>
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default OrganizationSettings;