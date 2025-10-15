import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LoginForm from './components/LoginForm';
import BiometricPanel from './components/BiometricPanel';
import OrganizationBranding from './components/OrganizationBranding';
import OfflineIndicator from './components/OfflineIndicator';
import { useMutation } from '@tanstack/react-query';
import { login } from 'api/login';
import secureStorage from 'hooks/secureStorage';
import { toast } from 'react-toastify';
import { useGlobalContext } from 'context';

const LoginAuthentication = () => {
  const [showBiometric, setShowBiometric] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authStep, setAuthStep] = useState('form'); // form, biometric, processing, success

  const { setIsLoggedIn, setUserDataContext, setUserRoleContext } = useGlobalContext();

  const navigate = useNavigate();
  const location = useLocation();

  // Mock authentication credentials
  const mockCredentials = {
    'admin@smartxalgo.com': { password: 'admin123', role: 'admin', name: 'System Administrator' },
    'manager@smartxalgo.com': { password: 'admin123', role: 'manager', name: 'Team Manager' },
    'employee@smartxalgo.com': { password: 'admin123', role: 'employee', name: 'Software Developer' },
    'sales@smartxalgo.com': { password: 'admin123', role: 'sales', name: 'Sales Representative' },
    'field@smartxalgo.com': { password: 'admin123', role: 'field', name: 'Field Worker' }
  };

  // Check if user is already authenticated
  useEffect(() => {
    const token = secureStorage.getItem('authToken');
    if (token) {
      const from = location?.state?.from?.pathname || '/main-dashboard';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const { mutate: Login, status: LoginStatus } = useMutation({
    mutationKey: ['updateManageUser'],
    mutationFn: login,
    onSuccess: (res) => {
      const { token, user } = res || {};

      // Store authentication data
      secureStorage.setItem('authToken', token);
      secureStorage.setItem('userData', JSON.stringify(user));
      secureStorage.setItem('userRole', user?.role);
      secureStorage.setItem('isLoggedIn', true);

      setUserDataContext(user);
      setUserRoleContext(user?.role);
      setIsLoggedIn(true);

      setAuthStep('success');

      const from = location?.state?.from?.pathname || '/main-dashboard';
      navigate(from, { replace: true });
    },
    onError: (err) => {
      setError(err?.message);
      toast.error(err?.message);
    },
    onSettled: () => {
      setIsLoading(false);
      setError('');
    }
  });

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');
    Login(formData);
  };

  const handleBiometricToggle = () => {
    setShowBiometric(!showBiometric);
    setError('');
    setAuthStep(showBiometric ? 'form' : 'biometric');
  };

  const handleBiometricCapture = async (imageBlob) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate biometric processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock biometric authentication success
      const mockUser = mockCredentials?.['admin@smartxalgo.com'];
      const authData = {
        token: 'mock-biometric-token-' + Date.now(),
        user: {
          id: Date.now(),
          email: 'admin@smartxalgo.com',
          name: mockUser?.name,
          role: mockUser?.role,
          office: 'bhubaneswar',
          biometricAuth: true
        },
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      };

      secureStorage.setItem('authToken', authData?.token);
      secureStorage.setItem('userData', JSON.stringify(authData?.user));
      secureStorage.setItem('userRole', authData?.user?.role);
      secureStorage.setItem('isLoggedIn', true);

      setUserDataContext(authData?.user);
      setUserRoleContext(authData?.user?.role);
      setIsLoggedIn(true);

      setAuthStep('success');

      setTimeout(() => {
        navigate('/main-dashboard', { replace: true });
      }, 1000);

    } catch (err) {
      setError('Biometric authentication failed. Please try again or use password login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricCancel = () => {
    setShowBiometric(false);
    setAuthStep('form');
    setError('');
  };

  return (
    <>
      <Helmet>
        <title>Login - SmartXAlgo CRM</title>
        <meta name="description" content="Secure login to SmartXAlgo CRM platform with biometric authentication support" />
      </Helmet>

      <div className="min-h-screen bg-background flex">
        {/* Left Panel - Organization Branding */}
        <OrganizationBranding />

        {/* Right Panel - Authentication */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Success State */}
            {authStep === 'success' && (
              <div className="text-center animate-fade-in">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-success-foreground rounded-full border-t-transparent animate-spin" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Authentication Successful</h2>
                <p className="text-muted-foreground">Redirecting to dashboard...</p>
              </div>
            )}

            {/* Login Form */}
            {authStep === 'form' && !showBiometric && (
              <LoginForm
                onSubmit={handleLogin}
                onBiometricToggle={handleBiometricToggle}
                showBiometric={showBiometric}
                isLoading={isLoading}
                error={error}
              />
            )}

            {/* Biometric Panel */}
            {authStep === 'biometric' && showBiometric && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Biometric Login</h2>
                  <p className="text-muted-foreground">Use your face to securely access your account</p>
                </div>

                <BiometricPanel
                  isActive={showBiometric}
                  onCapture={handleBiometricCapture}
                  onCancel={handleBiometricCancel}
                  isLoading={isLoading}
                />

                {error && (
                  <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-error rounded-full flex items-center justify-center">
                        <span className="text-error-foreground text-xs">!</span>
                      </div>
                      <p className="text-sm text-error">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Offline Indicator */}
        <OfflineIndicator />
      </div>
    </>
  );
};

export default LoginAuthentication;