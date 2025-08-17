import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import Home from '@/pages/Home';
import ContractsPage from '@/pages/ContractsPage';
import Forbidden from '@/pages/Forbidden';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen">
          <SidebarProvider>
            <AppSidebar />
          </SidebarProvider>
          <main className="flex-1 p-4">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute permission="view profile">
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contracts"
                element={
                  <ProtectedRoute permission="view contracts">
                    <ContractsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/forbidden" element={<Forbidden />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
