// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
  
import { SpinnerProvider } from './context/SpinnerContext';
import App from './App';
import { Suspense } from 'react';
import ThemeProvider from './utils/ThemeContext';
import { AuthProvider } from '@/components/auth/AuthContext';
import { Toaster } from 'sonner';
import './index.css'; 
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <SpinnerProvider>
          {/* هنا نضع Toaster مرة واحدة فقط */}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              // يمكنك إضافة style بناءً على الثيم هنا إن أردت
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
