// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import { SpinnerProvider } from './context/SpinnerContext';
import App from './App';
import { Suspense } from 'react';
import ThemeProvider from './context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster as SonnerToaster, toast } from 'sonner';
import { LanguageProvider } from '@/context/LanguageContext';
import { NetworkStatusProvider } from '@/context/NetworkStatusContext';
import NetworkStatusBanner from '@/components/common/NetworkStatusBanner';

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
    <NetworkStatusProvider>
      <ThemeProvider>
        <BrowserRouter>
          <LanguageProvider>
            <AuthProvider>
              <SpinnerProvider>
                <SonnerToaster
                  position="top-center"
                  toastOptions={{
                    duration: 3000,
                    className: 'touch-target',
                  }}
                />
                <NetworkStatusBanner />
                <Suspense fallback={null}>
                  <App />
                </Suspense>
              </SpinnerProvider>
            </AuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </ThemeProvider>
    </NetworkStatusProvider>
  </React.StrictMode>,
);
