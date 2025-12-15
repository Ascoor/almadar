import React, { useState, useEffect } from 'react';
import ModalCard from '@/components/common/ModalCard';
import { modalInput, modalLabel } from '@/components/common/modalStyles';
import AssigneeSelect from '@/components/common/AssigneeSelect';

export default function InvestigationModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    employee_name: '',
    source: '',
    subject: '',
    case_number: '',
    status: 'open',
    notes: '',
    assigned_to_user_id: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, assigned_to_user_id: initialData.assigned_to_user_id || initialData.assigned_to_user?.id || '' });
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setForm({
      employee_name: '',
      source: '',
      subject: '',
      case_number: '',
      status: 'open',
      notes: '',
      assigned_to_user_id: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error('❌ Error saving investigation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCard
      isOpen={isOpen}
      title={initialData ? 'تعديل تحقيق' : 'إضافة تحقيق'}
      onClose={onClose}
      onSubmit={handleFormSubmit}
      loading={loading}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{ label: 'اسم الموظف', name: 'employee_name' }, { label: 'الجهة المحيلة', name: 'source' }, { label: 'موضوع التحقيق', name: 'subject' }, { label: 'رقم القضية', name: 'case_number' }].map(({ label, name }) => (
            <div key={name} className="space-y-1">
              <label className={modalLabel}>{label}</label>
              <input
                type="text"
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                className={modalInput}
              />
            </div>
          ))}

          <div className="space-y-1">
            <label className={modalLabel}>
              الحالة
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={modalInput}
            >
              <option value="open">مفتوح</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="closed">مغلق</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <AssigneeSelect
              context="investigations"
              value={form.assigned_to_user_id}
              onChange={(user) =>
                setForm((prev) => ({
                  ...prev,
                  assigned_to_user_id: user?.id || '',
                }))
              }
              allowClear
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className={modalLabel}>
              ملاحظات
            </label>
            <textarea
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              className={`${modalInput} min-h-[110px]`}
            />
          </div>
        </div>
      </div>
    </ModalCard>
  );
}
