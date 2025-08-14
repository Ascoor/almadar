import api from '@/lib/axios';

export interface ReportData {
  id: string;
  title: string;
  type: 'contracts' | 'investigations' | 'litigations' | 'financial';
  data: unknown[];
  metadata: {
    total: number;
    filters: Record<string, unknown>;
    generatedAt: string;
  };
}

export interface ReportFilters {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  category?: string;
}

export const reportsApi = {
  getReports: async (filters: ReportFilters = {}): Promise<ReportData[]> => {
    const { data } = await api.get('/api/reports', { params: filters });
    return data;
  },

  generateReport: async (type: string, filters: ReportFilters): Promise<ReportData> => {
    const { data } = await api.post('/api/reports/generate', { type, filters });
    return data;
  },

  exportReport: async (reportId: string, format: 'csv' | 'pdf' = 'csv'): Promise<Blob> => {
    const response = await api.get(`/api/reports/${reportId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};