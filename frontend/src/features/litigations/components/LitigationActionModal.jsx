import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import ModalCard from '@/components/common/ModalCard';
import { useActionTypes } from '@/hooks/dataHooks';
import { getUsers } from '@/services/api/users'; // غيّر الاسم لو API عندك مختلفة

const EMPTY_FORM = {
  id: null,
  action_date: '',
  action_type_id: '',
  assigned_to_user_id: '',
  requirements: '',
  location: '',
  notes: '',
  results: '',
  status: 'pending',
};

const isLawyerUser = (u) => {
  const roles = u?.roles;

  // roles: [{name:'lawyer'}] أو ['lawyer']
  if (Array.isArray(roles)) {
    return roles.some((r) => {
      const name = typeof r === 'string' ? r : r?.name;
      return String(name || '').toLowerCase() === 'lawyer';
    });
  }

  // role: 'lawyer'
  return String(u?.role || '').toLowerCase() === 'lawyer';
};

export default function LitigationActionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const { data: actionTypes = [], isLoading: actionTypesLoading } =
    useActionTypes('litigation');

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const isEdit = !!form.id;

  // تهيئة الفورم عند فتح المودال
  useEffect(() => {
    if (!isOpen) return;

    setForm(
      initialData
        ? {
            ...EMPTY_FORM,
            ...initialData,
            assigned_to_user_id:
              initialData.assigned_to_user_id ||
              initialData.assignedTo?.id ||
              initialData.assigned_to?.id ||
              '',
          }
        : EMPTY_FORM,
    );
  }, [isOpen, initialData]);

  // تحميل المستخدمين عند فتح المودال
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const res = await getUsers();
        const list =
          (Array.isArray(res) && res) ||
          (Array.isArray(res?.data?.data) && res.data.data) ||
          (Array.isArray(res?.data) && res.data) ||
          [];

        if (mounted) setUsers(list);
      } catch (err) {
        console.error(err);
        toast.error('❌ فشل تحميل قائمة المستخدمين');
        if (mounted) setUsers([]);
      } finally {
        if (mounted) setUsersLoading(false);
      }
    };

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  // فلترة المحامين
  const lawyers = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    return list.filter(isLawyerUser);
  }, [users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.action_date || !form.action_type_id || !form.assigned_to_user_id) {
      toast.error('فضلاً أكمل الحقول الأساسية (التاريخ، نوع الإجراء، المحامي المسؤول).');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...form,
        assigned_to_user_id: Number(form.assigned_to_user_id),
      });
      onClose();
    } catch (err) {
      console.error('LitigationActionModal save error:', err);
      toast.error('فشل في حفظ الإجراء');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalCard
      isOpen={isOpen}
      title={isEdit ? 'تعديل إجراء' : 'إضافة إجراء'}
      onClose={onClose}
      onSubmit={handleSave}
      loading={loading}
      submitLabel={isEdit ? 'تحديث' : 'إضافة'}
    >
      <form
        dir="rtl"
        className="grid grid-cols-1 gap-4 text-right md:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <Field
          label="تاريخ الإجراء"
          name="action_date"
          type="date"
          value={form.action_date}
          onChange={handleChange}
          required
        />

        <Field
          label="نوع الإجراء"
          name="action_type_id"
          type="select"
          options={actionTypes.map((t) => ({
            value: t.id,
            label: t.action_name,
          }))}
          value={form.action_type_id}
          onChange={handleChange}
          disabled={actionTypesLoading}
          required
        />

        {/* ✅ اختيار المحامي فقط (Select) */}
        <Field
          label="المحامي المسؤول"
          name="assigned_to_user_id"
          type="select"
          options={lawyers.map((u) => ({
            value: u.id,
            label: u.name,
          }))}
          value={form.assigned_to_user_id}
          onChange={handleChange}
          disabled={usersLoading}
          required
        />

        <Field
          label="المطلوب"
          name="requirements"
          type="text"
          value={form.requirements}
          onChange={handleChange}
          placeholder="مستندات، مذكرات، حضور جلسة..."
        />

        <Field
          label="جهة الإجراء"
          name="location"
          type="text"
          value={form.location}
          onChange={handleChange}
          placeholder="مثال: محكمة شمال طرابلس، إدارة القضايا..."
        />

        <Field
          label="النتيجة"
          name="results"
          type="text"
          value={form.results}
          onChange={handleChange}
          placeholder="تم التنفيذ، مؤجل، مرفوض..."
        />

        <div className="md:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-foreground">ملاحظات</label>
          <textarea
            name="notes"
            value={form.notes ?? ''}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            rows={2}
            placeholder="أي ملاحظات إضافية حول هذا الإجراء..."
          />
        </div>

        <Field
          label="الحالة"
          name="status"
          type="select"
          options={[
            { value: 'pending', label: 'معلق' },
            { value: 'in_review', label: 'قيد المراجعة' },
            { value: 'done', label: 'منجز' },
          ]}
          value={form.status}
          onChange={handleChange}
          required
        />
      </form>
    </ModalCard>
  );
}

function Field({
  label,
  name,
  type,
  options = [],
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
}) {
  const baseCls =
    'w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm ' +
    'placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-70';

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-foreground">{label}</label>

      {type === 'select' ? (
        <select
          name={name}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          className={baseCls}
          required={required}
        >
          <option value="">
            {disabled ? 'جاري التحميل...' : `اختر ${label}`}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          className={baseCls}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      )}
    </div>
  );
}
