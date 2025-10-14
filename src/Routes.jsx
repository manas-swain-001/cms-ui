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
import { ProtectedRoute } from './ProtectedRoute';

const Routes = () => {

  const protectedRoutes = [
    { path: '/main-dashboard', component: <MainDashboard /> },
    { path: '/control-panel-settings', component: <ControlPanelSettings /> },
    { path: '/user-profile-management', component: <UserProfileManagement /> },
    { path: '/task-compliance-tracking', component: <TaskComplianceTracking /> },
    { path: '/attendance-management', component: <AttendanceManagement /> },
  ];

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<LoginAuthentication />} />
          <Route path="/login" element={<LoginAuthentication />} />
          <Route path="/login-authentication" element={<LoginAuthentication />} />

          {protectedRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={<ProtectedRoute>{route.component}</ProtectedRoute>} />
          ))}


          <Route path="*" element={<NotFound />} />

        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
