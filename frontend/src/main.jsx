import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; 
import { SpinnerProvider } from './context/SpinnerContext'; // ✅ استيراد مزود الـ Spinner
import App from './App';
import { Suspense } from 'react';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
 
      <SpinnerProvider> {/* ✅ SpinnerProvider يلتف حول كل شيء */}
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </SpinnerProvider>
 
  </React.StrictMode>
);
