import React, { useContext } from 'react';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import { SpinnerProvider } from './context/SpinnerContext';
import { AuthContext } from '@/components/auth/AuthContext';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <SpinnerProvider>
      {user ? <DashboardPage /> : <HomePage />}
    </SpinnerProvider>
  );
};

export default App;
