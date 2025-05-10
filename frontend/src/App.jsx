import React from 'react'; 
import ThemeProvider from './utils/ThemeContext';
import AuthWrapper from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import useAuth from './components/auth/AuthUser';
import { Toaster } from 'sonner';

import { SpinnerProvider } from './context/SpinnerContext';


const App = () => {
  const { getToken } = useAuth();
    return (
    <ThemeProvider>
      <SpinnerProvider>  
         <Toaster
          position="top-center"
          theme="system"
          duration={3000}
          closeButton
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#1f2937',
              color: '#fff',
              fontSize: '14px',
            },
          }}
        />
{getToken() ? <AuthWrapper /> : <HomePage />}

      </SpinnerProvider>
    </ThemeProvider>
  );
};

export default App;
