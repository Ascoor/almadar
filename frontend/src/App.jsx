import React from 'react'; 
import ThemeProvider from './utils/ThemeContext';
import AuthWrapper from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import useAuth from './components/auth/AuthUser';

import { SpinnerProvider } from './context/SpinnerContext';


const App = () => {
  const { getToken } = useAuth();
    return (
    <ThemeProvider>
      <SpinnerProvider>
       
{getToken() ? <AuthWrapper /> : <HomePage />}

      </SpinnerProvider>
    </ThemeProvider>
  );
};

export default App;
