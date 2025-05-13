// components/Litigations/LitigationActionModal.jsx
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ModalCard from "../common/ModalCard";export default function LitigationActionModal({
  isOpen, onClose, onSubmit, initialData, actionTypes = [],
}) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm(null);
      return;
    }

    if (initialData) {
      setForm({ ...EMPTY_FORM, ...initialData, results: initialData.results || "" });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [isOpen, initialData]);

  // **Don't render anything until the modal is open *and* your form is initialized**
  if (!isOpen || form === null) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      toast.error("فشل في حفظ الإجراء");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCard
      isOpen={isOpen}
      title={initialData ? "تعديل إجراء" : "إضافة إجراء"}
      loading={loading}
      onClose={onClose}
      onSubmit={handleSave}
      submitLabel={initialData ? "تحديث" : "إضافة"}
    >
      <form className="space-y-6 text-right">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/** تاريخ الإجراء **/}
          <InputField
            label="تاريخ الإجراء"
            type="date"
            name="action_date"
            value={form.action_date}
            onChange={handleChange}
            required
          />

          {/** نوع الإجراء **/}
          <SelectField
            label="نوع الإجراء"
            name="action_type_id"
            value={form.action_type_id}
            onChange={handleChange}
            options={actionTypes}
            required
          />

          {/** بقية الحقول **/}
          <InputField
            label="اسم القائم بالإجراء"
            name="lawyer_name"
            value={form.lawyer_name}
            onChange={handleChange}
            placeholder="مثال: د. فاطمة"
            required
          />
          <InputField
            label="المطلوب"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
          />
          <InputField
            label="جهة الإجراء"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
          <InputField
            label="ملاحظات"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
          <InputField
            label="النتيجة"
            name="results"
            value={form.results}    
            onChange={handleChange}
          />

          {/** الحالة **/}
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">الحالة</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="">اختر الحالة</option>
              <option value="pending">معلق</option>
              <option value="in_review">قيد المراجعة</option>
              <option value="done">منجز</option>
            </select>
          </div>
        </div>
      </form>
    </ModalCard>
  );
}

// مكوّن حقل نصي
const InputField = ({ label, name, value, onChange, placeholder = "", type = "text", required = false }) => (
  <div>
    <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
    />
  </div>
);

// مكوّن قائمة منسدلة
const SelectField = ({ label, name, value, onChange, options = [], required = false }) => (
  <div>
    <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
    >
      <option value="" disabled>-- اختر --</option>
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>
          {opt.action_name}
        </option>
      ))}
    </select>
  </div>
);
