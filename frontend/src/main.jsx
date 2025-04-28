import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AlertProvider } from './context/AlertContext';
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
<AlertProvider> 
    <Suspense fallback={<div>Loading...</div>}>
      {/* ✅ انقل GlobalAlert جوه App أو RouterProvider */}
      <RouterProvider router={router} />
    </Suspense> 
</AlertProvider>

  </React.StrictMode>,
);
