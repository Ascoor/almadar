// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ThemeProvider from './context/ThemeContext'; 
import { Toaster as SonnerToaster, toast } from 'sonner';
import { LanguageProvider } from '@/context/LanguageContext';
import { SpinnerProvider } from './context/SpinnerContext';
import { queryClient } from './lib/queryClient';

const root = ReactDOM.createRoot(document.getElementById('root'));

const updateSW = registerSW({
  onNeedRefresh() {
    toast('✨ تحديث متاح', {
      description:
        'يوجد إصدار جديد من التطبيق، اضغط إعادة التحميل لتطبيق التحديثات.',
      duration: 10000,
      action: {
        label: 'إعادة التحميل',
        onClick: () => updateSW(true),
      },
    });
  },
  onOfflineReady() {
    toast.success('🚀 جاهز للعمل دون اتصال', {
      description: 'تم تجهيز الملفات الأساسية للعمل في وضع عدم الاتصال.',
      duration: 5000,
    });
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
