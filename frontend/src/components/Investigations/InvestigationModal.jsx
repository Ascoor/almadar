import React, { useState, useEffect } from 'react';
import ModalCard from '../common/ModalCard';

export default function InvestigationModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    employee_name: '',
    source: '',
    subject: '',
    case_number: '',
    status: 'open',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
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
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              اسم الموظف
            </label>
            <input
              type="text"
              name="employee_name"
              value={form.employee_name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              الجهة المحيلة
            </label>
            <input
              type="text"
              name="source"
              value={form.source}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              موضوع التحقيق
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              رقم القضية
            </label>
            <input
              type="text"
              name="case_number"
              value={form.case_number}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              الحالة
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="open">مفتوح</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="closed">مغلق</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              ملاحظات
            </label>
            <textarea
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
        </div>
      </div>
    </ModalCard>
  );
}
