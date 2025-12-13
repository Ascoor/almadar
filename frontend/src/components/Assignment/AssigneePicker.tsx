import React, { useEffect, useState } from 'react';
import { assignEntity, listDepartments, listStaff } from '@/services/staff';
import { DepartmentSummary, StaffProfile } from '@/types/staff';
import { toast } from 'sonner';
import useCan from '@/hooks/useCan';

interface AssigneePickerProps {
  entityType: 'contracts' | 'investigations' | 'litigations' | 'legal-advices';
  entityId: number | string;
  defaultRole?: string;
  onAssigned?: () => void;
}

const AssigneePicker: React.FC<AssigneePickerProps> = ({ entityType, entityId, defaultRole, onAssigned }) => {
  const { can } = useCan();
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [roleInCase, setRoleInCase] = useState(defaultRole || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [staffRes, deptRes] = await Promise.all([listStaff(), listDepartments()]);
        const staffData = staffRes?.data?.data || staffRes?.data || staffRes || [];
        const deptData = deptRes?.data || deptRes || [];
        setStaff(Array.isArray(staffData) ? staffData : []);
        setDepartments(Array.isArray(deptData) ? deptData : []);
      } catch (err) {
        toast.error('تعذر تحميل بيانات الإسناد');
      }
    };
    load();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!can('staff.manage')) return;
    setLoading(true);
    try {
      await assignEntity(entityType, entityId, {
        user_id: Number(userId),
        department_id: departmentId ? Number(departmentId) : undefined,
        role_in_case: roleInCase || undefined,
      });
      toast.success('تم تحديث الإسناد');
      onAssigned?.();
    } catch (err: any) {
      toast.error(err?.message || 'فشل الإسناد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">تعيين المسؤولين</h3>
        {!can('staff.manage') && (
          <span className="text-sm text-amber-700">لا تملك صلاحية الإسناد</span>
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">المستخدم</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
            required
            disabled={!can('staff.manage')}
          >
            <option value="">اختر مستخدمًا</option>
            {staff.map((member) => (
              <option key={member.id} value={member.user_id || member.id}>
                {member.user?.name || '—'}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">القسم</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
            disabled={!can('staff.manage')}
          >
            <option value="">بدون</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">الدور في القضية</label>
          <input
            value={roleInCase}
            onChange={(e) => setRoleInCase(e.target.value)}
            className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
            placeholder="مثال: investigator / supervisor"
            disabled={!can('staff.manage')}
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-gray-500">يمكنك إضافة أكثر من دور عبر التكرار</span>
        <button
          type="submit"
          disabled={loading || !can('staff.manage')}
          className="rounded bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {loading ? 'جارِ الحفظ...' : 'حفظ الإسناد'}
        </button>
      </div>
    </form>
  );
};

export default AssigneePicker;
