// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { Suspense } from 'react';
import ThemeProvider from './context/ThemeContext';
import { Toaster as SonnerToaster } from 'sonner';
import { LanguageProvider } from '@/context/LanguageContext';
import { SpinnerProvider } from './context/SpinnerContext';

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
      <LanguageProvider>
        <SpinnerProvider>
          <SonnerToaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              className: 'touch-target',
            }}
          />
          <Suspense fallback={null}>
            <App />
          </Suspense>
        </SpinnerProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
