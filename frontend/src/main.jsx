import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n'; // For localization
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter

// Wrap your entire App component with BrowserRouter here
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
