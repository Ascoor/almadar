import { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSpinner } from '../../context/SpinnerContext';
import GlobalSpinner from '../common/Spinners/GlobalSpinner';
import { lazy } from 'react';
import Forbidden from '@/pages/Forbidden';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';
import ProfilePage from '../../pages/ProfilePage.jsx'; 

const Home = lazy(() => import('../dashboard/Dashboard'));
const ProfileUser = lazy(() => import('../Settings/ProfileUser'));
const Contracts = lazy(() => import('../../pages/ContractsPage.jsx'));
const Investigations = lazy(() => import('../../pages/InvestigationsPage.jsx'));
const LegalAdvices = lazy(() => import('../../pages/LegalAdvicePage.jsx'));
const Litigations = lazy(() => import('../../pages/LitigationsPage.jsx'));
const UserManagementPage = lazy(() => import('../../pages/UserManagementPage.jsx'));
const ArchivePage = lazy(() => import('../../pages/ArchivePage.jsx'));
const ManagementSettings = lazy(() => import('../../pages/ManagementSettings.jsx'));
const ReportsPage = lazy(() => import('../../pages/ReportsPage.jsx'));
const NotFound = () => <h1 className="text-center text-red-500">404 - Page Not Found</h1>;

const AuthRoutes = () => {
  const { showSpinner, hideSpinner, loading } = useSpinner();
  const location = useLocation();

  useEffect(() => {
    showSpinner();
    const timeout = setTimeout(() => {
      hideSpinner();
    }, 600);
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      {loading && <GlobalSpinner />}
      <Suspense fallback={<GlobalSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:userId" element={<ProfileUser />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/contracts" element={<ProtectedRoute permission="view contracts"><Contracts /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute permission="view profile"><ProfilePage /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute permission="view users"><UserManagementPage /></ProtectedRoute>} />
          <Route path="/legal/investigations" element={<ProtectedRoute permission="view investigations"><Investigations /></ProtectedRoute>} />
          <Route path="/legal/legal-advices" element={<ProtectedRoute permission="view legaladvices"><LegalAdvices /></ProtectedRoute>} />
          <Route path="/legal/litigations" element={<ProtectedRoute permission="view litigations"><Litigations /></ProtectedRoute>} />
          <Route path="/managment-lists" element={<ProtectedRoute permission="view managment-lists"><ManagementSettings /></ProtectedRoute>} />
          <Route path="/reports-page" element={<ReportsPage />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AuthRoutes;