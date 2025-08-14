import api from '@/lib/axios';

export interface Contract {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'expired' | 'cancelled';
  party: string;
  startDate: string;
  endDate: string;
  value: number;
  type: string;
  description: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractsResponse {
  items: Contract[];
  total: number;
  page: number;
  pageSize: number;
}

export const contractsApi = {
  getContracts: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
  }): Promise<ContractsResponse> => {
    const { data } = await api.get('/api/contracts', { params });
    return data;
  },

  getContract: async (id: string): Promise<Contract> => {
    const { data } = await api.get(`/api/contracts/${id}`);
    return data;
  },

  createContract: async (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract> => {
    const { data } = await api.post('/api/contracts', contract);
    return data;
  },

  updateContract: async (id: string, contract: Partial<Contract>): Promise<Contract> => {
    const { data } = await api.put(`/api/contracts/${id}`, contract);
    return data;
  },

  deleteContract: async (id: string): Promise<void> => {
    await api.delete(`/api/contracts/${id}`);
  },
};