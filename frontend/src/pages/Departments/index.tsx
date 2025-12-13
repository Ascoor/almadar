import React, { useEffect, useMemo, useState } from 'react';
import {
  assignDepartmentHead,
  createDepartment,
  deleteDepartment,
  listDepartments,
  listStaff,
  updateDepartment,
} from '@/services/staff';
import { DepartmentSummary, StaffProfile } from '@/types/staff';
import useCan from '@/hooks/useCan';
import { toast } from 'sonner';

const DepartmentsPage: React.FC = () => {
  const { can } = useCan();
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [deptRes, staffRes] = await Promise.all([
        listDepartments(),
        listStaff(),
      ]);
      const deptData = Array.isArray(deptRes?.data) ? deptRes.data : deptRes;
      const staffData = (staffRes?.data && Array.isArray(staffRes.data)) ? staffRes.data : staffRes?.data?.data || staffRes || [];
      setDepartments(deptData);
      setStaff(Array.isArray(staffData) ? staffData : []);
    } catch (err) {
      toast.error('تعذر تحميل الأقسام');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const membersByDepartment = useMemo(() => {
    const map: Record<number, StaffProfile[]> = {};
    staff.forEach((member) => {
      const deptId = member.department_id || member.department?.id;
      if (!deptId) return;
      if (!map[deptId]) map[deptId] = [];
      map[deptId].push(member);
    });
    return map;
  }, [staff]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!can('departments.manage')) return;
    try {
      if (editingId) {
        await updateDepartment(editingId, form);
        toast.success('تم تحديث القسم');
      } else {
        await createDepartment(form);
        toast.success('تم إنشاء القسم');
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      loadData();
    } catch (err: any) {
      toast.error(err?.message || 'فشل حفظ القسم');
    }
  };

  const handleEdit = (dept: DepartmentSummary) => {
    setForm({ name: dept.name, description: dept.description || '' });
    setEditingId(dept.id);
  };

  const handleDelete = async (id: number) => {
    if (!can('departments.manage')) return;
    if (!confirm('حذف هذا القسم؟')) return;
    try {
      await deleteDepartment(id);
      toast.success('تم حذف القسم');
      loadData();
    } catch (err: any) {
      toast.error(err?.message || 'تعذر حذف القسم');
    }
  };

  const handleAssignHead = async (deptId: number, userId: number | null) => {
    try {
      await assignDepartmentHead(deptId, userId);
      toast.success('تم تعيين رئيس القسم');
      loadData();
    } catch (err: any) {
      toast.error(err?.message || 'فشل تعيين الرئيس');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة الأقسام</h1>
          <p className="text-gray-500">إنشاء، تعديل، وتعيين رؤساء الأقسام.</p>
        </div>
      </div>

      {!can('departments.manage') && (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-amber-800">
          صلاحياتك الحالية لا تسمح بإدارة الأقسام.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-lg border bg-white p-4 shadow md:grid-cols-3"
      >
        <div className="space-y-1 md:col-span-1">
          <label className="text-sm font-semibold text-gray-700">اسم القسم</label>
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
            placeholder="القسم القانوني"
            required
            disabled={!can('departments.manage')}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-semibold text-gray-700">الوصف</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
            placeholder="تفاصيل عن مهام القسم"
            disabled={!can('departments.manage')}
          />
        </div>
        <div className="md:col-span-3 flex items-center justify-end gap-2">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({ name: '', description: '' });
                setEditingId(null);
              }}
              className="rounded border px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              إلغاء التعديل
            </button>
          )}
          <button
            type="submit"
            disabled={!can('departments.manage')}
            className="rounded bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {editingId ? 'تحديث القسم' : 'إضافة قسم'}
          </button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="text-gray-500">يتم تحميل الأقسام...</div>
        ) : departments.length === 0 ? (
          <div className="rounded border bg-white p-4 text-center text-gray-500">لا توجد أقسام</div>
        ) : (
          departments.map((dept) => (
            <div key={dept.id} className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{dept.name}</h3>
                  <p className="text-sm text-gray-500">{dept.description || '—'}</p>
                </div>
                {can('departments.manage') && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="rounded border px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="rounded border px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-700">رئيس القسم</div>
                <select
                  value={dept.head_user_id || ''}
                  onChange={(e) => handleAssignHead(dept.id, e.target.value ? Number(e.target.value) : null)}
                  className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  disabled={!can('departments.manage')}
                >
                  <option value="">اختر رئيسًا</option>
                  {staff.map((member) => (
                    <option key={member.id} value={member.user_id || member.id}>
                      {member.user?.name || '—'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-700">الأعضاء</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(membersByDepartment[dept.id] || []).map((member) => (
                    <span
                      key={member.id}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                    >
                      {member.user?.name || '—'}
                    </span>
                  ))}
                  {(membersByDepartment[dept.id] || []).length === 0 && (
                    <span className="text-sm text-gray-500">لا يوجد أعضاء</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
