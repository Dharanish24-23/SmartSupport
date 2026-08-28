import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import OfficerLayout from './layouts/OfficerLayout';

import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import EligibilityCheckerPage from './pages/EligibilityCheckerPage';
import EligibilityResultPage from './pages/EligibilityResultPage';
import SchemeListingPage from './pages/SchemeListingPage';
import SchemeDetailsPage from './pages/SchemeDetailsPage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import ApplicationTrackingPage from './pages/ApplicationTrackingPage';
import DocumentUploadPage from './pages/DocumentUploadPage';
import ProfilePage from './pages/ProfilePage';

import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminSchemeManagementPage from './pages/AdminSchemeManagementPage';
import AdminApplicationManagementPage from './pages/AdminApplicationManagementPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import OfficerApplicationManagementPage from './pages/OfficerApplicationManagementPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/schemes" element={<SchemeListingPage />} />
              <Route path="/schemes/:id" element={<SchemeDetailsPage />} />
              <Route path="/eligibility-checker" element={<EligibilityCheckerPage />} />
              <Route path="/eligibility-result" element={<EligibilityResultPage />} />

              <Route path="/dashboard" element={
                <ProtectedRoute><UserDashboardPage /></ProtectedRoute>
              } />
              <Route path="/apply/:schemeId" element={
                <ProtectedRoute><ApplicationFormPage /></ProtectedRoute>
              } />
              <Route path="/applications" element={
                <ProtectedRoute><ApplicationTrackingPage /></ProtectedRoute>
              } />
              <Route path="/documents" element={
                <ProtectedRoute><DocumentUploadPage /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />
            </Route>

            <Route path="/admin" element={
              <ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="schemes" element={<AdminSchemeManagementPage />} />
              <Route path="applications" element={<AdminApplicationManagementPage />} />
              <Route path="users" element={<AdminUserManagementPage />} />
            </Route>

            <Route path="/officer" element={
              <ProtectedRoute requiredRole="OFFICER"><OfficerLayout /></ProtectedRoute>
            }>
              <Route index element={<Navigate to="applications" replace />} />
              <Route path="applications" element={<OfficerApplicationManagementPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
