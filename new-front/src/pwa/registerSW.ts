import React from 'react';
import { toast } from '@/hooks/use-toast';

let updateAvailable = false;
let refreshing = false;

export async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              updateAvailable = true;
              showUpdateAvailableNotification();
            }
          });
        }
      });

      // Handle controlled page refresh
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });

      // Show install prompt for PWA
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        showInstallPrompt(e as any);
      });

    } catch (error) {
      console.error('SW registration failed:', error);
    }
  }
}

function showUpdateAvailableNotification() {
  toast({
    title: "تحديث متوفر",
    description: "إصدار جديد من التطبيق متوفر الآن - اضغط هنا لإعادة التحميل",
    duration: 10000,
  });
}

function showInstallPrompt(deferredPrompt: any) {
  // Show install notification after a delay
  setTimeout(() => {
    toast({
      title: "تثبيت التطبيق",
      description: "يمكنك تثبيت تطبيق مدار على جهازك للوصول السريع",
      duration: 15000,
    });
  }, 3000);
}