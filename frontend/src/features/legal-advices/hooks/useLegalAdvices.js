import { useQuery } from '@tanstack/react-query';
import {
  getAdviceTypes,
  getLegalAdviceById,
  getLegalAdvices,
} from '@/services/api/legalAdvices';
import { legalAdviceKeys } from './queryKeys';

const LIST_STALE_TIME = 2 * 60 * 1000; // 2 minutes
const DETAIL_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const DEFAULT_GC_TIME = 30 * 60 * 1000; // 30 minutes

export const useLegalAdvicesQuery = () => {
  return useQuery({
    queryKey: legalAdviceKeys.list(),
    queryFn: async () => {
      const response = await getLegalAdvices();
      return Array.isArray(response?.data?.data) ? response.data.data : [];
    },
    staleTime: LIST_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export const useLegalAdviceQuery = (id, options = {}) => {
  const { enabled = true, ...rest } = options;

  return useQuery({
    queryKey: legalAdviceKeys.detail(id),
    queryFn: async () => {
      const response = await getLegalAdviceById(id);
      return response?.data ?? response;
    },
    enabled: Boolean(id) && enabled,
    staleTime: DETAIL_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    ...rest,
  });
};

export const useAdviceTypesQuery = () => {
  return useQuery({
    queryKey: legalAdviceKeys.adviceTypes(),
    queryFn: async () => {
      const response = await getAdviceTypes();
      return Array.isArray(response?.data) ? response.data : [];
    },
    staleTime: LIST_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
