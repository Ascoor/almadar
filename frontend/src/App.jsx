import AuthWrapper from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import useAuth from './components/auth/AuthUser';
import { useThemeProvider } from './utils/ThemeContext';
import { Toaster } from 'sonner';
import { SpinnerProvider } from './context/SpinnerContext';

const App = () => {
  const { currentTheme } = useThemeProvider(); // Use theme context to get the current theme

  const { getToken } = useAuth(); // Retrieve token 

  return (
    <SpinnerProvider>
          <Toaster
        position="top-center"
        theme="system"
        duration={3000}
        closeButton
        toastOptions={{
          style: {
            padding: '10px',
            borderRadius: '10px',
            borderColor :currentTheme === 'dark' ? '#96e6ff' : '#00844b',  
            fontSize: '14px',
            backgroundColor: currentTheme === 'dark' ? '#1f2a36' : '#ffffff',  // Apply background based on theme
            color: currentTheme === 'dark' ? '#96e6ff' : '#00844b',  // Apply text color based on theme
          },
        }}
      />
        {getToken() ? <AuthWrapper /> : <HomePage />} {/* Conditional render based on token */}
      </SpinnerProvider>
 
  );
};

export default App;
