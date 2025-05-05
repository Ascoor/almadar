import React, { useState, useEffect, Suspense, lazy } from 'react';  
import { useThemeProvider } from '../../utils/ThemeContext';
import api from '../../services/api/axiosConfig'; 
import MainCard from '../common/MainCard';
import HomeSpinner from '../common/Spinners/HomeSpinner';
import {
  MainSessions,
  MainLegalCases,
  MainProcedures,
  MainClients,
} from '../../assets/icons/index';

const DashboardCard01 = lazy(() => import('./dashboard/DashboardCard01'));
const DashboardCard02 = lazy(() => import('./dashboard/DashboardCard02'));
const DashboardCard03 = lazy(() => import('./dashboard/DashboardCard03'));
const DashboardCard04 = lazy(() => import('./dashboard/DashboardCard04'));
const DashboardCard05 = lazy(() => import('./dashboard/DashboardCard05'));
const DashboardCard06 = lazy(() => import('./dashboard/DashboardCard06'));


const Home = () => { 
  const [counts, setCounts] = useState({
    clientCount: 0,
    legCaseCount: 0,
    procedureCount: 0,
    lawyerCount: 0,
    serviceCount: 0,
    legalSessionCount: 0,
  });
  const { currentTheme } = useThemeProvider();
  const isDarkMode = currentTheme === 'dark';

  useEffect(() => {
 
    fetchOfficeCount();
  }, []);

  const fetchOfficeCount = async () => {
    try {
      const response = await api.get('/api/all_count_office');
      setCounts({
        clientCount: response.data.client_count || 0,
        legCaseCount: response.data.leg_case_count || 0,
        procedureCount: response.data.procedure_count || 0,
        lawyerCount: response.data.lawyer_count || 0,
        serviceCount: response.data.service_count || 0,
        legalSessionCount: response.data.legal_session_count || 0,
      });
    } catch (error) {
      console.error('Error fetching office count:', error);
    }
  };

  

  return (
    <div className="p-6 mt-16 xl:max-w-7xl xl:mx-auto w-full  shadow-lg rounded-lg">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 pb-4">
      <MainCard
        count={counts.legalSessionCount}
        icon={MainSessions}
        label="الجلسات"
        route="/legal-sessions"
      />
      <MainCard
        count={counts.legCaseCount}
        icon={MainLegalCases}
        label="القضايا"
      />
      <MainCard
        count={counts.procedureCount}
        icon={MainProcedures}
        label="الإجراءات"
      />
      <MainCard
        count={counts.clientCount}
        icon={MainClients}
        label="العملاء"
      />
    </div>   

<>
          {/* عرض البطاقات المتقدمة */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pb-4 ">
            <DashboardCard01 isDarkMode={isDarkMode} />
            <DashboardCard02 isDarkMode={isDarkMode} />
            <DashboardCard03 isDarkMode={isDarkMode} />
            <DashboardCard04 isDarkMode={isDarkMode} />
            <DashboardCard05 isDarkMode={isDarkMode} />
            <DashboardCard06 isDarkMode={isDarkMode} />
          </div>
          {/* تقويم */}
 
 
     
     
        </>
 
    </div>
  );
};

export default Home;
