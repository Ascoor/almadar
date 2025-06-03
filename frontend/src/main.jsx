// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import { registerSW } from 'virtual:pwa-register';
import { SpinnerProvider } from './context/SpinnerContext';
import App from './App';
import { Suspense } from 'react';
import ThemeProvider from './utils/ThemeContext';
import { AuthProvider } from '@/components/auth/AuthContext';
import { Toaster } from 'sonner';
import './index.css'; 
 
const root = ReactDOM.createRoot(document.getElementById('root'));

// Register service worker for PWA functionality
registerSW({
  onNeedRefresh() {
    if (confirm('New content available, reload?')) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <SpinnerProvider>
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 3000,
                className: 'touch-target'
              }}
            />
            <Suspense fallback={<div>Loading...</div>}>
              <App />
            </Suspense>
          </SpinnerProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
