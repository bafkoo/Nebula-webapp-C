import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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

// Placeholder for main application
const MainApplication = () => (
  <div className="min-h-screen bg-[#252525] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-white text-4xl font-bold mb-4">🎉 Добро пожаловать в Nebula!</h1>
      <p className="text-white/70 text-lg">Вы успешно вошли в систему</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/new-password" element={<NewPasswordPage />} />
          <Route path="/reset-password/:token" element={<NewPasswordPage />} />
          
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
  )
}

export default App
