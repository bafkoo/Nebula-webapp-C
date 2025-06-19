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
import MePage from './pages/MePage'

// UI Components
import LoaderExample from './components/ui/LoaderExample'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "26914621923-ljnfmjat63o7gp3b9ornl1n65ho4g12v.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/new-password" element={<NewPasswordPage />} />
            <Route path="/reset-password/:token" element={<NewPasswordPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallback />} />
            
            {/* Demo Route */}
            <Route path="/loader-demo" element={<LoaderExample />} />
            
            {/* Temporary test route for MePage */}
            <Route path="/me-test" element={<MePage />} />
            
            {/* Protected Chat Routes */}
            <Route 
              path="/app" 
              element={
                <ProtectedRoute>
                  <Navigate to="/channels/me" replace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/channels/me" 
              element={
                <ProtectedRoute>
                  <MePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Verification Route - требует состояния ожидания верификации */}
            <Route 
              path="/verification" 
              element={
                <ProtectedRoute requireVerificationPending={true}>
                  <VerificationPage />
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
