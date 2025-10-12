import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const OfficeManagement = () => {
  const [offices, setOffices] = useState([
    {
      id: 1,
      name: "Bhubaneswar Office",
      code: "BHU001",
      address: "Plot No. 123, Infocity, Bhubaneswar, Odisha 751024",
      latitude: 20.2961,
      longitude: 85.8245,
      geofenceRadius: 300,
      timezone: "Asia/Kolkata",
      isActive: true,
      isHeadOffice: true,
      adminUserId: "admin001",
      adminName: "Rajesh Kumar",
      contactPhone: "+91 9876543210",
      contactEmail: "bhubaneswar@smartxalgo.com",
      capacity: 150,
      currentStrength: 87,
      shiftTimings: [
        { name: "General Shift", startTime: "09:00", endTime: "18:00", isDefault: true },
        { name: "Early Shift", startTime: "08:00", endTime: "17:00", isDefault: false },
        { name: "Late Shift", startTime: "10:00", endTime: "19:00", isDefault: false }
      ]
    },
    {
      id: 2,
      name: "Mumbai Office",
      code: "MUM001",
      address: "Office 456, Andheri East, Mumbai, Maharashtra 400069",
      latitude: 19.1136,
      longitude: 72.8697,
      geofenceRadius: 250,
      timezone: "Asia/Kolkata",
      isActive: true,
      isHeadOffice: false,
      adminUserId: "admin002",
      adminName: "Priya Sharma",
      contactPhone: "+91 9876543211",
      contactEmail: "mumbai@smartxalgo.com",
      capacity: 100,
      currentStrength: 64,
      shiftTimings: [
        { name: "General Shift", startTime: "09:30", endTime: "18:30", isDefault: true },
        { name: "Flexible Shift", startTime: "10:00", endTime: "19:00", isDefault: false }
      ]
    },
    {
      id: 3,
      name: "Delhi Office",
      code: "DEL001",
      address: "Sector 62, Noida, Uttar Pradesh 201309",
      latitude: 28.6139,
      longitude: 77.2090,
      geofenceRadius: 400,
      timezone: "Asia/Kolkata",
      isActive: false,
      isHeadOffice: false,
      adminUserId: null,
      adminName: "Not Assigned",
      contactPhone: "+91 9876543212",
      contactEmail: "delhi@smartxalgo.com",
      capacity: 80,
      currentStrength: 0,
      shiftTimings: [
        { name: "General Shift", startTime: "09:00", endTime: "18:00", isDefault: true }
      ]
    }
  ]);

  const [selectedOffice, setSelectedOffice] = useState(null);
  const [isAddingOffice, setIsAddingOffice] = useState(false);
  const [isEditingOffice, setIsEditingOffice] = useState(false);
  const [newOffice, setNewOffice] = useState({
    name: "",
    code: "",
    address: "",
    latitude: "",
    longitude: "",
    geofenceRadius: 300,
    timezone: "Asia/Kolkata",
    contactPhone: "",
    contactEmail: "",
    capacity: 50
  });

  const [newShift, setNewShift] = useState({
    name: "",
    startTime: "",
    endTime: "",
    isDefault: false
  });

  const [isAddingShift, setIsAddingShift] = useState(false);

  const handleOfficeSelect = (office) => {
    setSelectedOffice(office);
    setIsEditingOffice(false);
  };

  const handleAddOffice = () => {
    if (newOffice?.name && newOffice?.code && newOffice?.address) {
      const office = {
        id: Date.now(),
        ...newOffice,
        latitude: parseFloat(newOffice?.latitude) || 0,
        longitude: parseFloat(newOffice?.longitude) || 0,
        geofenceRadius: parseInt(newOffice?.geofenceRadius) || 300,
        capacity: parseInt(newOffice?.capacity) || 50,
        isActive: true,
        isHeadOffice: false,
        adminUserId: null,
        adminName: "Not Assigned",
        currentStrength: 0,
        shiftTimings: [
          { name: "General Shift", startTime: "09:00", endTime: "18:00", isDefault: true }
        ]
      };
      setOffices(prev => [...prev, office]);
      setNewOffice({
        name: "",
        code: "",
        address: "",
        latitude: "",
        longitude: "",
        geofenceRadius: 300,
        timezone: "Asia/Kolkata",
        contactPhone: "",
        contactEmail: "",
        capacity: 50
      });
      setIsAddingOffice(false);
    }
  };

  const handleUpdateOffice = (field, value) => {
    if (selectedOffice) {
      const updatedOffices = offices?.map(office =>
        office?.id === selectedOffice?.id
          ? { ...office, [field]: value }
          : office
      );
      setOffices(updatedOffices);
      setSelectedOffice(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleToggleOfficeStatus = (officeId) => {
    const updatedOffices = offices?.map(office =>
      office?.id === officeId
        ? { ...office, isActive: !office?.isActive }
        : office
    );
    setOffices(updatedOffices);
    if (selectedOffice && selectedOffice?.id === officeId) {
      setSelectedOffice(prev => ({ ...prev, isActive: !prev?.isActive }));
    }
  };

  const handleAddShift = () => {
    if (selectedOffice && newShift?.name && newShift?.startTime && newShift?.endTime) {
      const updatedShifts = [...selectedOffice?.shiftTimings, { ...newShift }];
      handleUpdateOffice('shiftTimings', updatedShifts);
      setNewShift({ name: "", startTime: "", endTime: "", isDefault: false });
      setIsAddingShift(false);
    }
  };

  const handleDeleteShift = (shiftIndex) => {
    if (selectedOffice) {
      const updatedShifts = selectedOffice?.shiftTimings?.filter((_, index) => index !== shiftIndex);
      handleUpdateOffice('shiftTimings', updatedShifts);
    }
  };

  const handleSetDefaultShift = (shiftIndex) => {
    if (selectedOffice) {
      const updatedShifts = selectedOffice?.shiftTimings?.map((shift, index) => ({
        ...shift,
        isDefault: index === shiftIndex
      }));
      handleUpdateOffice('shiftTimings', updatedShifts);
    }
  };

  const getOfficeStatusColor = (isActive) => {
    return isActive ? 'text-success' : 'text-error';
  };

  const getOfficeStatusBg = (isActive) => {
    return isActive ? 'bg-success/10' : 'bg-error/10';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Office List */}
      <div className="lg:col-span-1">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Office Locations</h3>
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={() => setIsAddingOffice(true)}
            >
              Add Office
            </Button>
          </div>

          <div className="space-y-3">
            {offices?.map((office) => (
              <div
                key={office?.id}
                onClick={() => handleOfficeSelect(office)}
                className={`p-3 border border-border rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                  selectedOffice?.id === office?.id ? 'bg-primary/5 border-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{office?.name}</h4>
                  <div className="flex items-center space-x-2">
                    {office?.isHeadOffice && (
                      <Icon name="Crown" size={14} className="text-warning" />
                    )}
                    <div className={`w-2 h-2 rounded-full ${office?.isActive ? 'bg-success' : 'bg-error'}`} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{office?.code}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{office?.currentStrength}/{office?.capacity} employees</span>
                  <span className={getOfficeStatusColor(office?.isActive)}>
                    {office?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Office Details */}
      <div className="lg:col-span-2">
        {isAddingOffice ? (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Add New Office</h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setIsAddingOffice(false)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Office Name"
                value={newOffice?.name}
                onChange={(e) => setNewOffice(prev => ({ ...prev, name: e?.target?.value }))}
                required
              />
              <Input
                label="Office Code"
                value={newOffice?.code}
                onChange={(e) => setNewOffice(prev => ({ ...prev, code: e?.target?.value }))}
                required
              />
              <div className="md:col-span-2">
                <Input
                  label="Address"
                  value={newOffice?.address}
                  onChange={(e) => setNewOffice(prev => ({ ...prev, address: e?.target?.value }))}
                  required
                />
              </div>
              <Input
                label="Latitude"
                type="number"
                step="0.000001"
                value={newOffice?.latitude}
                onChange={(e) => setNewOffice(prev => ({ ...prev, latitude: e?.target?.value }))}
              />
              <Input
                label="Longitude"
                type="number"
                step="0.000001"
                value={newOffice?.longitude}
                onChange={(e) => setNewOffice(prev => ({ ...prev, longitude: e?.target?.value }))}
              />
              <Input
                label="Geofence Radius (meters)"
                type="number"
                value={newOffice?.geofenceRadius}
                onChange={(e) => setNewOffice(prev => ({ ...prev, geofenceRadius: e?.target?.value }))}
                min="50"
                max="1000"
              />
              <Input
                label="Employee Capacity"
                type="number"
                value={newOffice?.capacity}
                onChange={(e) => setNewOffice(prev => ({ ...prev, capacity: e?.target?.value }))}
                min="1"
              />
              <Input
                label="Contact Phone"
                type="tel"
                value={newOffice?.contactPhone}
                onChange={(e) => setNewOffice(prev => ({ ...prev, contactPhone: e?.target?.value }))}
              />
              <Input
                label="Contact Email"
                type="email"
                value={newOffice?.contactEmail}
                onChange={(e) => setNewOffice(prev => ({ ...prev, contactEmail: e?.target?.value }))}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setIsAddingOffice(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddOffice}>
                Add Office
              </Button>
            </div>
          </div>
        ) : selectedOffice ? (
          <div className="space-y-6">
            {/* Office Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getOfficeStatusBg(selectedOffice?.isActive)}`}>
                    <Icon name="Building2" size={20} className={getOfficeStatusColor(selectedOffice?.isActive)} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                      <span>{selectedOffice?.name}</span>
                      {selectedOffice?.isHeadOffice && (
                        <Icon name="Crown" size={16} className="text-warning" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedOffice?.code}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant={selectedOffice?.isActive ? "destructive" : "success"}
                    size="sm"
                    onClick={() => handleToggleOfficeStatus(selectedOffice?.id)}
                  >
                    {selectedOffice?.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Edit"
                    onClick={() => setIsEditingOffice(!isEditingOffice)}
                  >
                    {isEditingOffice ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </div>

              {isEditingOffice ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Office Name"
                    value={selectedOffice?.name}
                    onChange={(e) => handleUpdateOffice('name', e?.target?.value)}
                  />
                  <Input
                    label="Office Code"
                    value={selectedOffice?.code}
                    onChange={(e) => handleUpdateOffice('code', e?.target?.value)}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      value={selectedOffice?.address}
                      onChange={(e) => handleUpdateOffice('address', e?.target?.value)}
                    />
                  </div>
                  <Input
                    label="Contact Phone"
                    value={selectedOffice?.contactPhone}
                    onChange={(e) => handleUpdateOffice('contactPhone', e?.target?.value)}
                  />
                  <Input
                    label="Contact Email"
                    value={selectedOffice?.contactEmail}
                    onChange={(e) => handleUpdateOffice('contactEmail', e?.target?.value)}
                  />
                  <Input
                    label="Employee Capacity"
                    type="number"
                    value={selectedOffice?.capacity}
                    onChange={(e) => handleUpdateOffice('capacity', parseInt(e?.target?.value))}
                  />
                  <Input
                    label="Geofence Radius (meters)"
                    type="number"
                    value={selectedOffice?.geofenceRadius}
                    onChange={(e) => handleUpdateOffice('geofenceRadius', parseInt(e?.target?.value))}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Icon name="MapPin" size={14} />
                        <span>{selectedOffice?.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Phone" size={14} />
                        <span>{selectedOffice?.contactPhone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Mail" size={14} />
                        <span>{selectedOffice?.contactEmail}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Office Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Strength:</span>
                        <span className="text-foreground font-medium">{selectedOffice?.currentStrength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="text-foreground font-medium">{selectedOffice?.capacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Utilization:</span>
                        <span className="text-foreground font-medium">
                          {Math.round((selectedOffice?.currentStrength / selectedOffice?.capacity) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Geofence Radius:</span>
                        <span className="text-foreground font-medium">{selectedOffice?.geofenceRadius}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isEditingOffice && (
                <div className="flex justify-end space-x-3 mt-6">
                  <Button variant="outline" onClick={() => setIsEditingOffice(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsEditingOffice(false)}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            {/* Location & Geofence */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Location & Geofence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Coordinates</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Latitude:</span>
                      <span className="font-mono">{selectedOffice?.latitude}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Longitude:</span>
                      <span className="font-mono">{selectedOffice?.longitude}</span>
                    </div>
                  </div>
                </div>
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                  <iframe
                    width="100%"
                    height="100%"
                    loading="lazy"
                    title={selectedOffice?.name}
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${selectedOffice?.latitude},${selectedOffice?.longitude}&z=16&output=embed`}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Shift Management */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Shift Timings</h3>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  onClick={() => setIsAddingShift(true)}
                >
                  Add Shift
                </Button>
              </div>

              {isAddingShift && (
                <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">Add New Shift</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Shift Name"
                      value={newShift?.name}
                      onChange={(e) => setNewShift(prev => ({ ...prev, name: e?.target?.value }))}
                    />
                    <Input
                      label="Start Time"
                      type="time"
                      value={newShift?.startTime}
                      onChange={(e) => setNewShift(prev => ({ ...prev, startTime: e?.target?.value }))}
                    />
                    <Input
                      label="End Time"
                      type="time"
                      value={newShift?.endTime}
                      onChange={(e) => setNewShift(prev => ({ ...prev, endTime: e?.target?.value }))}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Checkbox
                      label="Set as default shift"
                      checked={newShift?.isDefault}
                      onChange={(e) => setNewShift(prev => ({ ...prev, isDefault: e?.target?.checked }))}
                    />
                    <div className="flex space-x-3">
                      <Button variant="ghost" size="sm" onClick={() => setIsAddingShift(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleAddShift}>
                        Add Shift
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {selectedOffice?.shiftTimings?.map((shift, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground">{shift?.name}</span>
                        {shift?.isDefault && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {shift?.startTime} - {shift?.endTime}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!shift?.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefaultShift(index)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => handleDeleteShift(index)}
                        className="text-error hover:text-error"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Office Administrator */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Office Administrator</h3>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {selectedOffice?.adminName?.split(' ')?.map(n => n?.[0])?.join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{selectedOffice?.adminName}</div>
                    <div className="text-sm text-muted-foreground">Office Administrator</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {selectedOffice?.adminUserId ? 'Change Admin' : 'Assign Admin'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Icon name="Building2" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Select an Office</h3>
            <p className="text-muted-foreground">Choose an office from the list to view and manage its details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficeManagement;