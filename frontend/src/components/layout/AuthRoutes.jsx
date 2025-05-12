import  { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSpinner } from '../../context/SpinnerContext';
import GlobalSpinner from '../common/Spinners/GlobalSpinner';
import { lazy } from 'react';  
 

const Home = lazy(() => import('../dashboard/Dashboard'));
 
const ProfileUser = lazy(() => import('../Settings/ProfileUser'));  
const Contracts = lazy(() => import('../../pages/ContractsPage.jsx')); 
const Investigations = lazy(() => import('../../pages/InvestigationsPage.jsx'));
const LegalAdvices = lazy(() => import('../../pages/LegalAdvicePage.jsx'));
const Litigations = lazy(() => import('../../pages/LitigationsPage.jsx'));
const UsersList = lazy(() => import('../Users/index.jsx'));
const ArchivePage = lazy(() => import('../../pages/ArchivePage.jsx'));
const ManagementSettings = lazy(() => import('../../pages/ManagementSettings.jsx'));

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
<>
      {loading && <GlobalSpinner />}

      <Suspense fallback={<GlobalSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UsersList />} />
         
          <Route path="/profile/:userId" element={<ProfileUser />} />  
         

          <Route path="/contracts" element={<Contracts />} />
  
          <Route path="/archive" element={<ArchivePage />} />
  
  <Route path="/legal/investigations" element={<Investigations />} />
  <Route path="/legal/legal-advices" element={<LegalAdvices />} />
  <Route path="/legal/litigations" element={<Litigations />} />

  <Route path="/managment-lists" element={<ManagementSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </>
  );
};

export default AuthRoutes;
