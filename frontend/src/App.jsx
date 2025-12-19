// src/App.jsx
import '@/styles/tokens.css';
import '@/styles/index.css';
import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthWrapper from './pages/DashboardPage';
import Home from './pages/Home';
import Login from './pages/Login';
import { SpinnerProvider } from './context/SpinnerContext';
import { AuthContext } from '@/context/AuthContext';

const App = () => {
  const { user, token } = useContext(AuthContext);

  const isAuthenticated = Boolean(user && token);

  return (
    <SpinnerProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <AuthWrapper /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SpinnerProvider>
  );
};

export default App;
