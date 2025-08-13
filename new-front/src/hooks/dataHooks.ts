import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsApi, Contract } from '@/services/api/contracts';
import { reportsApi, ReportData, ReportFilters } from '@/services/api/reports';
import { useToast } from '@/hooks/use-toast';

// Contracts hooks
export function useContracts(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
} = {}) {
  return useQuery({
    queryKey: ['contracts', params],
    queryFn: () => contractsApi.getContracts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: ['contracts', id],
    queryFn: () => contractsApi.getContract(id),
    enabled: !!id,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: contractsApi.createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast({
        title: "تم إنشاء العقد بنجاح",
        description: "تم حفظ العقد الجديد",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إنشاء العقد",
        description: error?.response?.data?.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Contract>) =>
      contractsApi.updateContract(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.id] });
      toast({
        title: "تم تحديث العقد بنجاح",
        description: "تم حفظ التغييرات",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تحديث العقد",
        description: error?.response?.data?.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    },
  });
}

// Reports hooks
export function useReports(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => reportsApi.getReports(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ type, filters }: { type: string; filters: ReportFilters }) =>
      reportsApi.generateReport(type, filters),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: "تم إنشاء التقرير بنجاح",
        description: "التقرير جاهز للعرض",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إنشاء التقرير",
        description: error?.response?.data?.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    },
  });
}

export function useExportReport() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ reportId, format }: { reportId: string; format: 'csv' | 'pdf' }) =>
      reportsApi.exportReport(reportId, format),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${variables.reportId}.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "تم تصدير التقرير بنجاح",
        description: "تم تحميل الملف",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تصدير التقرير",
        description: error?.response?.data?.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    },
  });
}