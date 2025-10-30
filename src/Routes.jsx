import React, { useEffect } from "react";
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
import ManageEmployees from "pages/manage-employees";
import { getUserById } from "api/users";
import { useMutation } from "@tanstack/react-query";
import { useGlobalContext } from "context";
import SmsManagement from "pages/sms";
import EmployeeTasksTracking from "pages/employee-tasks-tracking";

const Routes = () => {

  const { setUserProfile, userDataContext } = useGlobalContext();

  const protectedRoutes = [
    { path: '/main-dashboard', component: <MainDashboard /> },
    { path: '/user-profile-management', component: <UserProfileManagement /> },
    { path: '/task-compliance-tracking', component: <TaskComplianceTracking />, excludedRoles: ['admin'] },
    { path: '/attendance-management', component: <AttendanceManagement />, excludedRoles: ['admin'] },
    
    { path: '/employee-tasks-tracking', component: <EmployeeTasksTracking />, requiredRole: 'admin' },
    { path: '/control-panel-settings', component: <ControlPanelSettings />, requiredRole: 'admin' },
    { path: '/manage-employees', component: <ManageEmployees />, requiredRole: 'admin' },
    { path: '/sms', component: <SmsManagement />, requiredRole: 'admin' },
  ];

  const { mutate: GetUserById } = useMutation({
    mutationKey: ['getUserById'],
    mutationFn: getUserById,
    onSuccess: (res) => {
      setUserProfile(res?.user);
    },
  })

  useEffect(() => {
    GetUserById(userDataContext?.id);
  }, [userDataContext?.id])

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
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute requiredRole={route.requiredRole} excludedRoles={route.excludedRoles}>
                  {route.component}
                </ProtectedRoute>
              }
            />
          ))}

          <Route path="*" element={<NotFound />} />

        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
