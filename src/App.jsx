import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import OnboardingPage from './pages/OnboardingPage';

// Authenticated Pages
import DashboardPage from './pages/DashboardPage';
import GenerateHandoverPage from './pages/GenerateHandoverPage';
import ReviewHandoverPage from './pages/ReviewHandoverPage';
import ShiftHistoryPage from './pages/ShiftHistoryPage';
import DataSourcesPage from './pages/DataSourcesPage';
import TeamMembersPage from './pages/TeamMembersPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />

            {/* Authenticated SaaS Routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="generate" element={<GenerateHandoverPage />} />
              <Route path="review" element={<ReviewHandoverPage />} />
              <Route path="history" element={<ShiftHistoryPage />} />
              <Route path="sources" element={<DataSourcesPage />} />
              <Route path="team" element={<TeamMembersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
