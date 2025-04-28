import React, { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSpinner } from '../../context/SpinnerContext';
import GlobalSpinner from '../common/Spinners/GlobalSpinner';
import { lazy } from 'react';  

const Home = lazy(() => import('../dashboard/Dashboard'));
 
const ProfileUser = lazy(() => import('../Settings/ProfileUser'));  
const Contracts = lazy(() => import('../../pages/Contracts/index.jsx')); 
const Investigations = lazy(() => import('../../pages/LegalAdvice/Investigations.jsx'));
const Consultations = lazy(() => import('../../pages/LegalAdvice/Consultations.jsx'));
const Litigations = lazy(() => import('../../pages/Litigations/index.jsx'));
const UsersList = lazy(() => import('../Users/index.jsx'));

const NotFound = () => (
  <h1 className="text-center text-red-500">404 - Page Not Found</h1>
);

const AuthRoutes = () => {
  const { showSpinner, hideSpinner, loading } = useSpinner();
  const location = useLocation();

  useEffect(() => {
    showSpinner();
    hideSpinner();
  }, [location]);

  return (
    <div className="max-w-screen-lg mx-auto p-4 min-h-screen relative overflow-hidden">
      {}
      {loading && <GlobalSpinner />}

      <Suspense fallback={<GlobalSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UsersList />} />
         
          <Route path="/profile/:userId" element={<ProfileUser />} />  
         

          <Route path="/contracts" element={<Contracts />} />
  
  <Route path="/legal/investigations" element={<Investigations />} />
  <Route path="/legal/consultations" element={<Consultations />} />
  <Route path="/legal/litigations" element={<Litigations />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AuthRoutes;
