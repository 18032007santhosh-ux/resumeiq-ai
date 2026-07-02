import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Resumes } from './pages/Resumes';
import { ResumeDetail } from './pages/ResumeDetail';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* Guest Only Auth Routes */}
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <ForgotPassword />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <ResetPassword />
                </ProtectedRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/resumes" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Resumes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/resumes/:id" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <ResumeDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/history" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <History />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/settings" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Settings />
                </ProtectedRoute>
              } 
            />

            {/* Static pages */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
