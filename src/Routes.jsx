import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import MainDashboard from './pages/main-dashboard';
import LoginAuthentication from './pages/login-authentication';
import ControlPanelSettings from './pages/control-panel-settings';
import UserProfileManagement from './pages/user-profile-management';
import TaskComplianceTracking from './pages/task-compliance-tracking';
import AttendanceManagement from './pages/attendance-management';

const Routes = () => {
  
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AttendanceManagement />} />
        <Route path="/main-dashboard" element={<MainDashboard />} />
        <Route path="/login-authentication" element={<LoginAuthentication />} />
        <Route path="/control-panel-settings" element={<ControlPanelSettings />} />
        <Route path="/user-profile-management" element={<UserProfileManagement />} />
        <Route path="/task-compliance-tracking" element={<TaskComplianceTracking />} />
        <Route path="/attendance-management" element={<AttendanceManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
