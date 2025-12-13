export interface RoleSummary {
  id: number;
  name: string;
  permissions?: string[];
}

export interface DepartmentSummary {
  id: number;
  name: string;
  description?: string | null;
  head_user_id?: number | null;
}

export interface JobGradeSummary {
  id: number;
  name: string;
  slug: string;
  level: number;
  description?: string | null;
}

export interface StaffUserSummary {
  id: number;
  name: string;
  email: string;
  status?: 'active' | 'inactive';
  roles?: RoleSummary[];
}

export interface StaffProfile {
  id: number;
  user_id: number;
  department_id?: number | null;
  job_grade_id?: number | null;
  legal_specialty?: string | null;
  hired_at?: string | null;
  user?: StaffUserSummary;
  department?: DepartmentSummary | null;
  job_grade?: JobGradeSummary | null;
  roles?: RoleSummary[];
  permissions?: string[];
  status?: 'active' | 'inactive';
}

export interface StaffFilters {
  search?: string;
  departmentId?: number;
  jobGradeId?: number;
  page?: number;
}

export interface StaffPayload {
  name: string;
  email: string;
  password?: string;
  department_id?: number | null;
  job_grade_id?: number | null;
  role?: string;
  permissions?: string[];
  status?: string;
}

export interface AssignmentPayload {
  user_id: number;
  department_id?: number | null;
  role_in_case?: string;
}
