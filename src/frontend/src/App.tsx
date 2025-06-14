import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'
import './App.css'

// Auth Context
import { AuthProvider } from './contexts/AuthContext'

// Components
import ProtectedRoute from './components/auth/ProtectedRoute'
import LanguageSwitcher from './components/ui/LanguageSwitcher'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import NewPasswordPage from './pages/auth/NewPasswordPage'
import VerificationPage from './pages/auth/VerificationPage'
import GitHubCallback from './pages/auth/GitHubCallback'

// UI Components
import LoaderExample from './components/ui/LoaderExample'

// Placeholder for main application
const MainApplication = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-[#252525] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-4xl font-bold mb-4">{t('app.welcome')}</h1>
        <p className="text-white/70 text-lg">{t('app.welcomeMessage')}</p>
        
        {/* Переключатель языка */}
        <div className="mt-8 flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "26914621923-ljnfmjat63o7gp3b9ornl1n65ho4g12v.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/new-password" element={<NewPasswordPage />} />
            <Route path="/reset-password/:token" element={<NewPasswordPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallback />} />
            
            {/* Demo Route */}
            <Route path="/loader-demo" element={<LoaderExample />} />
            
            {/* Protected Verification Route - требует состояния ожидания верификации */}
            <Route 
              path="/verification" 
              element={
                <ProtectedRoute requireVerificationPending={true}>
                  <VerificationPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected App Routes - требует полной аутентификации */}
            <Route 
              path="/app" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <MainApplication />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
