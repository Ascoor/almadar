import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useCan from '@/hooks/useCan';
import {
  listDepartments,
  listJobGrades,
  listStaff,
} from '@/services/staff';
import { DepartmentSummary, JobGradeSummary, StaffProfile } from '@/types/staff';
import { Search } from 'lucide-react';

const LoadingRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3" colSpan={5}>
      <div className="h-4 rounded bg-gray-200" />
    </td>
  </tr>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-10 text-gray-500">{message}</div>
);

const StaffList: React.FC = () => {
  const { can } = useCan();
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [grades, setGrades] = useState<JobGradeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', departmentId: '', jobGradeId: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [deptRes, gradeRes] = await Promise.all([
          listDepartments(),
          listJobGrades(),
        ]);
        setDepartments(Array.isArray(deptRes?.data) ? deptRes.data : deptRes);
        setGrades(Array.isArray(gradeRes?.data) ? gradeRes.data : gradeRes);
      } catch (err) {
        console.warn('Failed to load meta', err);
      }
    };
    loadMeta();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadStaff = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await listStaff({
          search: filters.search || undefined,
          departmentId: filters.departmentId ? Number(filters.departmentId) : undefined,
          jobGradeId: filters.jobGradeId ? Number(filters.jobGradeId) : undefined,
        });
        const data = response?.data ?? response;
        if (Array.isArray(data?.data)) {
          setStaff(data.data);
        } else if (Array.isArray(data)) {
          setStaff(data);
        } else {
          setStaff([]);
        }
      } catch (err: any) {
        if (controller.signal.aborted) return;
        setError(err?.message || 'فشل في تحميل الموظفين');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    loadStaff();
    return () => controller.abort();
  }, [filters.departmentId, filters.jobGradeId, filters.search]);

  const filteredStaff = useMemo(() => staff, [staff]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">قائمة الموظفين</h1>
          <p className="text-gray-500">بحث وتصفية حسب القسم أو الدرجة.</p>
        </div>
        {can('staff.manage') && (
          <Link
            to="/staff/new"
            className="rounded bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700"
          >
            إضافة موظف
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="col-span-1">
          <label className="mb-1 block text-sm font-semibold text-gray-700">بحث</label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full rounded border px-3 py-2 pr-9 focus:border-indigo-500 focus:outline-none"
              placeholder="اسم أو بريد الموظف"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">القسم</label>
          <select
            value={filters.departmentId}
            onChange={(e) => setFilters((prev) => ({ ...prev, departmentId: e.target.value }))}
            className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">الكل</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">الدرجة الوظيفية</label>
          <select
            value={filters.jobGradeId}
            onChange={(e) => setFilters((prev) => ({ ...prev, jobGradeId: e.target.value }))}
            className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">الكل</option>
            {grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">الاسم</th>
              <th className="px-4 py-3">القسم</th>
              <th className="px-4 py-3">الدرجة</th>
              <th className="px-4 py-3">الأدوار</th>
              <th className="px-4 py-3">الحالة</th>
              {can('staff.manage') && <th className="px-4 py-3 text-right">إجراءات</th>}
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <>
                <LoadingRow />
                <LoadingRow />
              </>
            )}

            {!loading && filteredStaff.length === 0 && (
              <tr>
                <td colSpan={can('staff.manage') ? 6 : 5}>
                  <EmptyState message={error || 'لا يوجد موظفون لعرضهم'} />
                </td>
              </tr>
            )}

            {!loading &&
              filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {member.user?.name || '—'}
                  </td>
                  <td className="px-4 py-3">{member.department?.name || '—'}</td>
                  <td className="px-4 py-3">{member.job_grade?.name || '—'}</td>
                  <td className="px-4 py-3 space-x-1 rtl:space-x-reverse">
                    {(member.roles || member.user?.roles || []).map((role) => (
                      <span
                        key={role.id}
                        className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700"
                      >
                        {role.name}
                      </span>
                    ))}
                    {(member.roles || member.user?.roles || []).length === 0 && '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        (member.status || member.user?.status) === 'inactive'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {(member.status || member.user?.status) === 'inactive' ? 'موقوف' : 'نشط'}
                    </span>
                  </td>
                  {can('staff.manage') && (
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/staff/${member.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        تعديل
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;
