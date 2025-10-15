import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const LoginForm = ({ onSubmit, onBiometricToggle, showBiometric, isLoading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    office: 'bhubaneswar',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Mock office locations
  const officeOptions = [
    { value: 'bhubaneswar', label: 'Bhubaneswar Office', description: 'Main Development Center' },
  ];

  // Mock user role hints
  const roleHints = [
    { role: 'Admin', email: 'admin@smartxalgo.com', description: 'Full system access' },
    /* { role: 'Manager', email: 'manager@smartxalgo.com', description: 'Team oversight' },
    { role: 'Employee', email: 'employee@smartxalgo.com', description: 'Task compliance' },
    { role: 'Sales', email: 'sales@smartxalgo.com', description: 'Lead management' },
    { role: 'Field', email: 'field@smartxalgo.com', description: 'Visit tracking' } */
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors?.[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData?.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData?.password?.trim()) {
      errors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData?.office) {
      errors.office = 'Please select an office location';
    }

    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleRoleHintClick = (hint) => {
    setFormData(prev => ({
      ...prev,
      email: hint?.email,
      password: 'admin123'
    }));
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon name="Zap" size={32} className="text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to your SmartXAlgo CRM account</p>
      </div>
      {/* Error Message */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <p className="text-sm text-error">{error}</p>
          </div>
        </div>
      )}
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Office Selection */}
        <Select
          label="Office Location"
          placeholder="Select your office"
          options={officeOptions}
          value={formData?.office}
          onChange={(value) => handleInputChange('office', value)}
          error={validationErrors?.office}
          required
          searchable
        />

        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={validationErrors?.email}
          required
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={validationErrors?.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={formData?.rememberMe}
            onChange={(e) => handleInputChange('rememberMe', e?.target?.checked)}
          />
          <Button type="button" variant="link" className="text-sm p-0 h-auto">
            Forgot password?
          </Button>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          iconName="LogIn"
        >
          Sign In
        </Button>

        {/* Biometric Toggle */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          onClick={onBiometricToggle}
          iconName="Scan"
          disabled={isLoading}
        >
          {showBiometric ? 'Use Password Login' : 'Use Biometric Login'}
        </Button>
      </form>
      {/* Role Hints */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-medium text-foreground mb-3">Demo Accounts</h3>
        <div className="grid grid-cols-1 gap-2">
          {roleHints?.map((hint) => (
            <button
              key={hint?.role}
              onClick={() => handleRoleHintClick(hint)}
              className="text-left p-2 rounded hover:bg-background transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground group-hover:text-primary">
                    {hint?.role}
                  </p>
                  <p className="text-xs text-muted-foreground">{hint?.email}</p>
                </div>
                <Icon name="ArrowRight" size={12} className="text-muted-foreground group-hover:text-primary" />
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Click any role to auto-fill credentials (Password: admin123)
        </p>
      </div>
    </div>
  );
};

export default LoginForm;