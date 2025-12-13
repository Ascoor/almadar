import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import useCan from '@/hooks/useCan';
import {
  createStaff,
  getStaff,
  listDepartments,
  listJobGrades,
  updateStaff,
} from '@/services/staff';
import { StaffPayload, DepartmentSummary, JobGradeSummary, StaffProfile } from '@/types/staff';
import { getPermissions, getRoles } from '@/services/api/users';

interface FormValues extends StaffPayload {
  role?: string;
  permissions?: string[];
}

const StaffForm: React.FC = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { can } = useCan();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [grades, setGrades] = useState<JobGradeSummary[]>([]);
  const [roles, setRoles] = useState<{ name: string; id?: number }[]>([]);
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      department_id: undefined,
      job_grade_id: undefined,
      role: '',
      permissions: [],
      status: 'active',
    },
  });

  const selectedPermissions = watch('permissions') || [];

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [deptRes, gradeRes, rolesRes, permsRes] = await Promise.all([
          listDepartments(),
          listJobGrades(),
          getRoles(),
          getPermissions(),
        ]);
        setDepartments(Array.isArray(deptRes?.data) ? deptRes.data : deptRes);
        setGrades(Array.isArray(gradeRes?.data) ? gradeRes.data : gradeRes);
        setRoles((rolesRes?.data && Array.isArray(rolesRes.data)) ? rolesRes.data : rolesRes || []);
        const permsList = (permsRes?.data && Array.isArray(permsRes.data)) ? permsRes.data : permsRes || [];
        setAllPermissions(permsList.map((p: any) => p.name || p));
      } catch (err) {
        toast.error('تعذر تحميل البيانات المساندة');
      } finally {
        setLoadingMeta(false);
      }
    };
    loadMeta();
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    const loadStaff = async () => {
      setLoading(true);
      try {
        const response = await getStaff(id);
        const staff: StaffProfile = response?.data ?? response;
        const user = staff.user || {};
        reset({
          name: user.name || '',
          email: user.email || '',
          password: '',
          department_id: staff.department_id ?? staff.department?.id,
          job_grade_id: staff.job_grade_id ?? staff.job_grade?.id,
          role: (staff.roles || user.roles || [])[0]?.name || '',
          permissions: staff.permissions || [],
          status: staff.status || user.status || 'active',
        });
      } catch (err) {
        toast.error('تعذر تحميل بيانات الموظف');
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, [id, isEdit, reset]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const payload: StaffPayload = {
      name: values.name,
      email: values.email,
      department_id: values.department_id ? Number(values.department_id) : null,
      job_grade_id: values.job_grade_id ? Number(values.job_grade_id) : null,
      role: values.role,
      permissions: values.permissions,
      status: values.status,
    };
    if (!isEdit && values.password) {
      payload.password = values.password;
    }

    try {
      if (isEdit && id) {
        await updateStaff(id, payload);
        toast.success('تم تحديث بيانات الموظف');
      } else {
        await createStaff(payload);
        toast.success('تم إنشاء الموظف');
      }
      navigate('/staff');
    } catch (err: any) {
      toast.error(err?.message || 'فشل حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (perm: string) => {
    const current = selectedPermissions;
    if (current.includes(perm)) {
      setValue(
        'permissions',
        current.filter((p) => p !== perm),
        { shouldDirty: true },
      );
    } else {
      setValue('permissions', [...current, perm], { shouldDirty: true });
    }
  };

  const permColumns = useMemo(() => {
    const midpoint = Math.ceil(allPermissions.length / 2);
    return [allPermissions.slice(0, midpoint), allPermissions.slice(midpoint)];
  }, [allPermissions]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? 'تعديل موظف' : 'إضافة موظف'}</h1>
          <p className="text-gray-500">أكمل الحقول أدناه لحفظ البيانات.</p>
        </div>
        <Link to="/staff" className="text-indigo-600 hover:text-indigo-800">
          الرجوع للقائمة
        </Link>
      </div>

      {!can('staff.manage') && (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-amber-800">
          ليس لديك صلاحية لإدارة الموظفين.
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 rounded-lg border bg-white p-6 shadow"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">الاسم</label>
            <input
              type="text"
              {...register('name', { required: 'الاسم مطلوب' })}
              className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
              placeholder="اسم الموظف"
              disabled={!can('staff.manage')}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              {...register('email', { required: 'البريد الإلكتروني مطلوب' })}
              className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
              placeholder="user@example.com"
              disabled={!can('staff.manage')}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          {!isEdit && (
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">كلمة المرور</label>
              <input
                type="password"
                {...register('password', { required: 'كلمة المرور مطلوبة' })}
                className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                placeholder="••••••••"
                disabled={!can('staff.manage')}
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">القسم</label>
            <select
              {...register('department_id')}
              className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
              disabled={!can('staff.manage')}
            >
              <option value="">اختر قسمًا</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">الدرجة الوظيفية</label>
            <select
              {...register('job_grade_id')}
              className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
              disabled={!can('staff.manage')}
            >
              <option value="">اختر درجة</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">الدور</label>
            <select
              {...register('role')}
              className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
              disabled={!can('staff.manage')}
            >
              <option value="">اختر دورًا</option>
              {roles.map((role) => (
                <option key={role.id || role.name} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">الحالة</label>
            <select
              {...register('status')}
              className="w-full rounded border px-3 py-2 focus:border-indigo-500 focus:outline-none"
              disabled={!can('staff.manage')}
            >
              <option value="active">نشط</option>
              <option value="inactive">موقوف</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">صلاحيات خاصة</h3>
            <span className="text-sm text-gray-500">اختياري</span>
          </div>
          {loadingMeta ? (
            <div className="text-gray-500">يتم تحميل الصلاحيات...</div>
          ) : allPermissions.length === 0 ? (
            <div className="text-gray-500">لا توجد صلاحيات إضافية.</div>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {permColumns.map((column, index) => (
                <div key={index} className="space-y-2">
                  {column.map((perm) => (
                    <label
                      key={perm}
                      className="flex cursor-pointer items-center gap-3 rounded border px-3 py-2 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        disabled={!can('staff.manage')}
                      />
                      <span className="text-sm text-gray-800">{perm}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            to="/staff"
            className="rounded border px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={loading || !can('staff.manage')}
            className="rounded bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {loading ? 'جارِ الحفظ...' : isEdit ? 'تحديث' : 'إنشاء'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;
