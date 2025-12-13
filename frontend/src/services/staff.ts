import api from './api/axiosConfig';
import {
  AssignmentPayload,
  DepartmentSummary,
  JobGradeSummary,
  StaffFilters,
  StaffPayload,
} from '@/types/staff';

export const listStaff = async (filters: StaffFilters = {}) => {
  const params: Record<string, string | number> = {};
  if (filters.search) params.search = filters.search;
  if (filters.departmentId) params.department_id = filters.departmentId;
  if (filters.jobGradeId) params.job_grade_id = filters.jobGradeId;
  if (filters.page) params.page = filters.page;

  const res = await api.get('/api/staff', { params });
  return res.data;
};

export const getStaff = async (id: number | string) => {
  const res = await api.get(`/api/staff/${id}`);
  return res.data;
};

export const createStaff = async (payload: StaffPayload) => {
  const res = await api.post('/api/staff', payload);
  return res.data;
};

export const updateStaff = async (id: number | string, payload: Partial<StaffPayload>) => {
  const res = await api.post(`/api/staff/${id}?_method=PUT`, payload);
  return res.data;
};

export const listDepartments = async () => {
  const res = await api.get('/api/departments');
  return res.data as DepartmentSummary[];
};

export const createDepartment = async (payload: Partial<DepartmentSummary>) => {
  const res = await api.post('/api/departments', payload);
  return res.data;
};

export const updateDepartment = async (
  id: number | string,
  payload: Partial<DepartmentSummary>,
) => {
  const res = await api.post(`/api/departments/${id}?_method=PUT`, payload);
  return res.data;
};

export const deleteDepartment = async (id: number | string) => {
  const res = await api.delete(`/api/departments/${id}`);
  return res.data;
};

export const assignDepartmentHead = async (id: number | string, head_user_id: number | null) => {
  const res = await api.post(`/api/departments/${id}/assign-head`, { head_user_id });
  return res.data;
};

export const listJobGrades = async () => {
  const res = await api.get('/api/job-grades');
  return res.data as JobGradeSummary[];
};

export const assignEntity = async (
  entity: 'contracts' | 'investigations' | 'litigations' | 'legal-advices',
  id: number | string,
  payload: AssignmentPayload,
) => {
  const res = await api.post(`/api/${entity}/${id}/assign`, payload);
  return res.data;
};
