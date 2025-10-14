import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Table from '../../../components/Table';
import { formatDateToDDMMYYYY } from 'utils/function';

const ManageEmployeeInfo = ({ userProfile, onUpdateProfile, data }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);
  const [errors, setErrors] = useState({});

  // Table columns configuration
  const tableColumns = [
    {
      key: 'fullName',
      header: 'Full Name',
      render: (value, row, rowIndex) => `${row?.firstName} ${row?.lastName}`
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'joiningDate',
      header: 'Join Date',
      render: (value) => formatDateToDDMMYYYY(value)
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (value, row, rowIndex) => (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Edit"
            onClick={(e) => {
              e.stopPropagation();
              handleEditEmployee(row);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteEmployee(row);
            }}
          />
        </div>
      )
    }
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

    if (!formData?.joinDate?.trim()) {
      newErrors.joinDate = 'Join date is required';
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

  const generatePassword = () => {
    const chars = {
      lower: 'abcdefghijklmnopqrstuvwxyz',
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      number: '0123456789',
      special: '!@#$%^&*'
    };

    // Helper to pick random characters
    const pick = (str, count) => [...Array(count)]
      .map(() => str[Math.floor(Math.random() * str.length)])
      .join('');

    // Build password parts
    const password = (
      pick(chars.lower, 3) +
      pick(chars.upper, 2) +
      pick(chars.number, 2) +
      pick(chars.special, 1)
    )
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    setFormData(prev => ({ ...prev, password }));
  };

  // Table action handlers

  const handleEditEmployee = (employee) => {
    console.log('Edit employee:', employee);

    return;
    setFormData(employee);
    setIsEditing(true);
  };

  const handleDeleteEmployee = (employee) => {
    console.log('Delete employee:', employee);
  };

  const handleRowClick = (employee) => {
    console.log('Row clicked:', employee);
    // Add row click logic here
  };

  return (
    <div className="space-y-6">
      {/* Employee Form */}
      <div className="bg-card rounded-lg border border-border p-6">
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
              required
            />

            <Input
              label="Last Name"
              type="text"
              value={formData?.lastName}
              onChange={(e) => handleInputChange('lastName', e?.target?.value)}
              error={errors?.lastName}
              required
            />

            <Input
              label="Join Date"
              type="date"
              value={formData?.joinDate}
              onChange={(e) => handleInputChange('joinDate', e?.target?.value)}
              error={errors?.joinDate}
              required
            />

            {/* <Input
              label="Employee ID"
              type="text"
              value={formData?.employeeId}
              disabled
              description="Employee ID cannot be changed"
            /> */}

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
              required
            />

            <Input
              label="Password"
              type="text"
              value={formData?.password}
              onChange={(e) => handleInputChange('password', e?.target?.value)}
              error={errors?.password}
              required
              generateLink={() => {
                generatePassword();
              }}
              generateLinkText="Generate Password"
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              error={errors?.phone}
              required
            />

          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          {/* <Button
            variant="outline"
            iconName="X"
            iconPosition="left"
            onClick={handleCancel}
          >
            Cancel
          </Button> */}
          <Button
            variant="default"
            iconName="Save"
            iconPosition="left"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-foreground">Employee List</h3>
        </div>

        <Table
          data={data}
          columns={tableColumns}
        />
      </div>
    </div>
  );
};

export default ManageEmployeeInfo;