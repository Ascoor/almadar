// src/App.jsx
import '@/styles/tokens.css';
import '@/styles/index.css';
import { useEffect } from 'react';
import AuthWrapper from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import { SpinnerProvider } from './context/SpinnerContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const App = () => { 
  const { user, token, isReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && (!user || !token)) {
      navigate('/'); // أو navigate('/login') إذا كنت تريد فرض صفحة تسجيل الدخول
    }
  }, [user, token, isReady]);

  return (
    <SpinnerProvider>
      {user ? <AuthWrapper /> : <HomePage />}
    </SpinnerProvider>
  );
};

export default App;
