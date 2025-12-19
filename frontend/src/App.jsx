// src/App.jsx
import '@/styles/tokens.css'
import '@/styles/index.css'
import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthWrapper from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/Login'
import { SpinnerProvider } from './context/SpinnerContext'
import { AuthContext } from '@/context/AuthContext'

const App = () => {
  const { user, token } = useContext(AuthContext)
  const isAuthenticated = Boolean(user && token)

  return (
    <SpinnerProvider>
      {isAuthenticated ? (
        <AuthWrapper />
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </SpinnerProvider>
  )
}

export default App
