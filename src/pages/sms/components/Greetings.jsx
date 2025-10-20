import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const Greetings = ({ securitySettings, onUpdateSecurity }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(securitySettings?.twoFactorEnabled);
  const [trustedDevices, setTrustedDevices] = useState(securitySettings?.trustedDevices);

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (passwordErrors?.[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData?.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData?.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData?.newPassword?.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(passwordData?.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!passwordData?.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handlePasswordSubmit = () => {
    if (validatePasswordForm()) {
      onUpdateSecurity({
        type: 'password',
        data: passwordData
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
    }
  };

  const handleTwoFactorToggle = (enabled) => {
    setTwoFactorEnabled(enabled);
    onUpdateSecurity({
      type: 'twoFactor',
      data: { enabled }
    });
  };

  const handleRemoveDevice = (deviceId) => {
    const updatedDevices = trustedDevices?.filter(device => device?.id !== deviceId);
    setTrustedDevices(updatedDevices);
    onUpdateSecurity({
      type: 'removeDevice',
      data: { deviceId }
    });
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'mobile': return 'Smartphone';
      case 'tablet': return 'Tablet';
      case 'desktop': return 'Monitor';
      default: return 'Device';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
          <Icon name="Shield" size={24} className="text-error" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Security Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your account security and authentication</p>
        </div>
      </div>
      <div className="space-y-8">
        {/* Password Management */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-foreground">Password</h3>
              <p className="text-sm text-muted-foreground">Last changed on {securitySettings?.lastPasswordChange}</p>
            </div>
            <Button
              variant="outline"
              iconName="Key"
              iconPosition="left"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Change Password
            </Button>
          </div>

          {showPasswordForm && (
            <div className="bg-muted p-4 rounded-lg space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordData?.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                error={passwordErrors?.currentPassword}
                required
              />
              
              <Input
                label="New Password"
                type="password"
                value={passwordData?.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                error={passwordErrors?.newPassword}
                description="Must be at least 8 characters with uppercase, lowercase, and number"
                required
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData?.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                error={passwordErrors?.confirmPassword}
                required
              />
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="default"
                  iconName="Save"
                  iconPosition="left"
                  onClick={handlePasswordSubmit}
                >
                  Update Password
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setPasswordErrors({});
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        {/* <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-foreground">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium ${twoFactorEnabled ? 'text-success' : 'text-muted-foreground'}`}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Checkbox
                checked={twoFactorEnabled}
                onChange={(e) => handleTwoFactorToggle(e?.target?.checked)}
              />
            </div>
          </div>

          {twoFactorEnabled && (
            <div className="bg-success/10 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm font-medium text-success">Two-Factor Authentication is active</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Your account is protected with authenticator app verification
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  View Backup Codes
                </Button>
                <Button variant="outline" size="sm">
                  Regenerate Codes
                </Button>
              </div>
            </div>
          )}
        </div> */}

        {/* Trusted Devices */}
        {/* <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-foreground">Trusted Devices</h3>
              <p className="text-sm text-muted-foreground">Devices that don't require 2FA verification</p>
            </div>
            <Button variant="outline" size="sm">
              Trust This Device
            </Button>
          </div>

          <div className="space-y-3">
            {trustedDevices?.map((device) => (
              <div key={device?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name={getDeviceIcon(device?.type)} size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{device?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {device?.location} • Last used {device?.lastUsed}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {device?.current && (
                    <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                    onClick={() => handleRemoveDevice(device?.id)}
                    disabled={device?.current}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Security Recommendations */}
        <div className="bg-warning/10 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Security Recommendations</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use a unique, strong password for your account</li>
            {/* <li>• Enable two-factor authentication for enhanced security</li> */}
            {/* <li>• Regularly review and remove unused trusted devices</li> */}
            {/* <li>• Keep your recovery information up to date</li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Greetings;