// ✅ react-query implementation to replace DataContext
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
 

import * as adviceTypesApi from '@/services/api/adviceTypes'; 
import * as legalAdvicesApi from '@/services/api/legalAdvices';
import * as dashboardApi from '@/services/api/dashboard';

import * as notificationsApi from '@/services/api/notifications';
import * as usersApi from '@/services/api/users'; 
import * as contractsApi from '@/services/api/contracts';
import * as investigationsApi from '@/services/api/investigations';
import * as litigationsApi from '@/services/api/litigations';

const queryClient = new QueryClient();

export const AppWithQuery = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

// ✅ Hooks

export const useContractCategories = () => {
  return useQuery({
    queryKey: ['contractCategories'],
    queryFn: contractsApi.getContractCategories,
    select: (res) => Array.isArray(res?.data?.data) ? res.data.data : [],
  });
};

export const useAdviceTypes = () => {
  return useQuery({
    queryKey: ['adviceTypes'],
    queryFn: adviceTypesApi.getAdviceTypes,
    select: (res) => Array.isArray(res?.data) ? res.data : [],
  });
};

export const useLegalAdvices = () => {
  return useQuery({
    queryKey: ['legalAdvices'],
    queryFn: legalAdvicesApi.getLegalAdvices, // ✅ الحرف A كبير هنا
  });
}; 
export const useDashboardStats  = () => {
  return useQuery({
    queryKey: ['dashboardStatus'],
    queryFn: dashboardApi.getDashboardCounts, // ✅ الحرف A كبير هنا
  });
};
export const useRecentData  = () => {
  return useQuery({
    queryKey: ['allRecentData'],
    queryFn: dashboardApi.getAllRecentData, // ✅ الحرف A كبير هنا
  });
};
export const useActionTypes = (type) => {
  return useQuery({
    queryKey: ['actionTypes', type],
    queryFn: () =>
      type === 'litigation'
        ? litigationsApi.getLitigationActionTypes()
        : investigationsApi.getInvestigationActionTypes(),
    select: (res) => Array.isArray(res?.data) ? res.data : [],
  });
};

export const useLitigationActions = (litigationId) => {
  return useQuery({
    queryKey: ['litigationActions', litigationId],
    queryFn: () => litigationsApi.getLitigationActions(litigationId),
    select: (res) => Array.isArray(res?.data?.data) ? res.data.data : [],
    enabled: !!litigationId, // يتأكد أن id موجود قبل الجلب
  });
};

 
export const useInvestigationActions = (investigationId) => {
  return useQuery({
    queryKey: ['investigationActions', investigationId],
    queryFn: () => investigationsApi.getInvestigationActions(investigationId),
    select: (res) => Array.isArray(res?.data) ? res.data : [],  // ✅ التعديل هنا
    enabled: !!investigationId,
  });
};
 

// 🧑‍⚖️ الأدوار
export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: usersApi.getRoles,
  });
};

// 🔐 الصلاحيات
export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: usersApi.getPermissions,
  });
};
export const useNotificationQuery = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getNotifications,
  });
  return { data, isLoading, refetch };
};

export const useUsers = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
  });
  return { data, isLoading, refetch };
};

export const useContracts = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractsApi.getContracts,
  });
  return { data, isLoading, refetch };
};

export const useInvestigations = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['investigations'],
    queryFn: investigationsApi.getInvestigations,
  });
  return { data, isLoading, refetch };
};

export const useLitigations = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['litigations'],
    queryFn: litigationsApi.getLitigations,
  });
  return { data, isLoading, refetch };
};
 
