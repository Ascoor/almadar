// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ThemeProvider from './context/ThemeContext';
import { Toaster as SonnerToaster } from 'sonner';
import { LanguageProvider } from '@/context/LanguageContext';
import { SpinnerProvider } from './context/SpinnerContext';
import { queryClient } from './lib/queryClient';

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
    <QueryClientProvider client={queryClient}>
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
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </SpinnerProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
