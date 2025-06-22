import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'

// Auth Context
import { AuthProvider } from './contexts/AuthContext'

// Components
import ProtectedRoute from './components/auth/ProtectedRoute'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import NewPasswordPage from './pages/auth/NewPasswordPage'
import VerificationPage from './pages/auth/VerificationPage'
import GitHubCallback from './pages/auth/GitHubCallback'

// Main Pages
import LandingPage from './pages/LandingPage'
import DashboardIconsDemo from './pages/DashboardIconsDemo'
import MainPage from './pages/app/MainPage'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "26914621923-ljnfmjat63o7gp3b9ornl1n65ho4g12v.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Icons Demo */}
            <Route path="/icons" element={<DashboardIconsDemo />} />
            <Route path="/dashboard-icons" element={<DashboardIconsDemo />} />
            <Route path="/dashboard-icons-demo" element={<DashboardIconsDemo />} />
            <Route path="/demo" element={<DashboardIconsDemo />} />
            
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/new-password" element={<NewPasswordPage />} />
            <Route path="/reset-password/:token" element={<NewPasswordPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallback />} />
            
            {/* Protected Verification Route */}
            <Route 
              path="/verification" 
              element={
                <ProtectedRoute requireVerificationPending={true}>
                  <VerificationPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Main App Route */}
            <Route 
              path="/app" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <MainPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
