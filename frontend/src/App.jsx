// src/App.jsx
import '@/styles/tokens.css';
import '@/styles/index.css';
import { useContext, useEffect } from 'react';
import AuthWrapper from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import { SpinnerProvider } from './context/SpinnerContext';
import { AuthContext } from '@/context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const App = () => { 
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate('/'); // أو navigate('/login') إذا كنت تريد فرض صفحة تسجيل الدخول
    }
  }, [user, token]);

  return (
    <SpinnerProvider>
      {user ? <AuthWrapper /> : <HomePage />}
    </SpinnerProvider>
  );
};

export default App;
