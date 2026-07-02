import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routePaths';
import PrivateRoute from '../components/common/PrivateRoute';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import HomePage from '../pages/home/HomePage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import UploadResumePage from '../pages/resume/UploadResumePage';
import ResumeDetailsPage from '../pages/resume/ResumeDetailsPage';
import MockInterviewPage from '../pages/interview/MockInterviewPage';
import ResultPage from '../pages/interview/ResultPage';
import ProgressAnalyticsPage from '../pages/analytics/ProgressAnalyticsPage';
import AIMentorPage from '../pages/chat/AIMentorPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path={ROUTES.HOME} element={<HomePage />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.RESUME_UPLOAD} element={<UploadResumePage />} />
            <Route path={ROUTES.RESUME_DETAILS} element={<ResumeDetailsPage />} />
            <Route path={ROUTES.MOCK_INTERVIEW} element={<MockInterviewPage />} />
            <Route path={ROUTES.MOCK_RESULT} element={<ResultPage />} />
            <Route path={ROUTES.ANALYTICS} element={<ProgressAnalyticsPage />} />
            <Route path={ROUTES.AI_MENTOR} element={<AIMentorPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
};

export default AppRoutes;
