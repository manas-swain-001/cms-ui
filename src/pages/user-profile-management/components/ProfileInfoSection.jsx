import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ProfileInfoSection = ({ userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);
  const [errors, setErrors] = useState({});

  const departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const designationOptions = [
    { value: 'junior_developer', label: 'Junior Developer' },
    { value: 'senior_developer', label: 'Senior Developer' },
    { value: 'team_lead', label: 'Team Lead' },
    { value: 'manager', label: 'Manager' },
    { value: 'sales_executive', label: 'Sales Executive' },
    { value: 'hr_specialist', label: 'HR Specialist' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onUpdateProfile(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(userProfile);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
            <p className="text-sm text-muted-foreground">Manage your personal details and contact information</p>
          </div>
        </div>
        
        {!isEditing ? (
          <Button
            variant="outline"
            iconName="Edit"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              iconName="X"
              iconPosition="left"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground mb-4">Basic Information</h3>
          
          <Input
            label="First Name"
            type="text"
            value={formData?.firstName}
            onChange={(e) => handleInputChange('firstName', e?.target?.value)}
            error={errors?.firstName}
            disabled={!isEditing}
            required
          />
          
          <Input
            label="Last Name"
            type="text"
            value={formData?.lastName}
            onChange={(e) => handleInputChange('lastName', e?.target?.value)}
            error={errors?.lastName}
            disabled={!isEditing}
            required
          />
          
          <Input
            label="Employee ID"
            type="text"
            value={formData?.employeeId}
            disabled
            description="Employee ID cannot be changed"
          />
          
          <Input
            label="Date of Birth"
            type="date"
            value={formData?.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
            disabled={!isEditing}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground mb-4">Contact Information</h3>
          
          <Input
            label="Email Address"
            type="email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            disabled={!isEditing}
            required
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            error={errors?.phone}
            disabled={!isEditing}
            required
          />
          
          <Input
            label="Address"
            type="text"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            disabled={!isEditing}
          />
          
          <Input
            label="Emergency Contact"
            type="tel"
            value={formData?.emergencyContact}
            onChange={(e) => handleInputChange('emergencyContact', e?.target?.value)}
            disabled={!isEditing}
            description="Emergency contact phone number"
          />
        </div>

        {/* Organizational Information */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-medium text-foreground mb-4">Organizational Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Department"
              options={departmentOptions}
              value={formData?.department}
              onChange={(value) => handleInputChange('department', value)}
              disabled={!isEditing}
            />
            
            <Select
              label="Designation"
              options={designationOptions}
              value={formData?.designation}
              onChange={(value) => handleInputChange('designation', value)}
              disabled={!isEditing}
            />
            
            <Input
              label="Reporting Manager"
              type="text"
              value={formData?.reportingManager}
              disabled
              description="Contact HR to change reporting manager"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Join Date"
              type="date"
              value={formData?.joinDate}
              disabled
              description="Join date cannot be modified"
            />
            
            <Input
              label="Office Location"
              type="text"
              value={formData?.officeLocation}
              disabled
              description="Contact admin to change office location"
            />
          </div>
        </div>
      </div>
      {/* Profile Completion Status */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Profile Completion</span>
          <span className="text-sm text-primary font-medium">{formData?.completionPercentage}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${formData?.completionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Complete your profile to access all features
        </p>
      </div>
    </div>
  );
};

export default ProfileInfoSection;