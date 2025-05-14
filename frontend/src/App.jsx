// src/App.jsx
import React, { useContext } from 'react';
import AuthWrapper from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import { useThemeProvider } from './utils/ThemeContext';
import { Toaster } from 'sonner';
import { SpinnerProvider } from './context/SpinnerContext';
import { AuthContext } from '@/components/auth/AuthContext';

const App = () => {
  const { currentTheme } = useThemeProvider();
  const { user } = useContext(AuthContext); // استخدم السياق للتحقق من المصادقة

  return (
    <SpinnerProvider>
      

      {user ? <AuthWrapper /> : <HomePage />} {/* اعرض Dashboard أو HomePage بناءً على حالة المستخدم */}
    </SpinnerProvider>
  );
};

export default App;