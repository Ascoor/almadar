// components/InvestigationActionModal.jsx
import React, { useState, useEffect } from "react";
 import { toast } from "sonner";


import ModalCard from "../common/ModalCard";

export default function InvestigationActionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  actionTypes = []
}) {
  const [form, setForm] = useState({
    action_date: "",
    action_type_id: "",
    officer_name: "",
    requirements: "",
    results: "",
    status: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({
      action_date: "",
      action_type_id: "",
      officer_name: "",
      requirements: "",
      results: "",
      status: ""
    });
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };
const handleSave = async () => {
  setLoading(true);
  try {
    await onSubmit(form); // table will handle toast
    onClose();
  } catch {
    toast.error("حدث خطأ أثناء الحفظ");
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
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6 text-right"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="تاريخ الإجراء"
            name="action_date"
            type="date"
            value={form.action_date}
            onChange={handleChange}
          />
          <Field
            label="نوع الإجراء"
            name="action_type_id"
            type="select"
            options={actionTypes.map(t => ({
              value: t.id,
              label: t.action_name
            }))}
            value={form.action_type_id}
            onChange={handleChange}
          />
          <Field
            label="اسم القائم بالإجراء"
            name="officer_name"
            type="text"
            placeholder="مثال: د. فاطمة"
            value={form.officer_name}
            onChange={handleChange}
          />
          <Field
            label="المطلوب"
            name="requirements"
            type="text"
            placeholder="مثال: تقديم إفادة"
            value={form.requirements}
            onChange={handleChange}
          />
          <Field
            label="النتيجة"
            name="results"
            type="text"
            placeholder="مثال: تم الاستماع للموظف"
            value={form.results}
            onChange={handleChange}
          />
          <Field
            label="الحالة"
            name="status"
            type="select"
            options={[
              { value: "pending", label: "معلق" },
              { value: "in_review", label: "قيد المراجعة" },
              { value: "done", label: "منجز" }
            ]}
            value={form.status}
            onChange={handleChange}
          />
        </div>
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
  required
}) {
  const baseCls = `
    w-full p-2 border rounded-md border-border
    bg-background text-foreground
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
    dark:bg-gray-700 dark:border-gray-600 dark:text-white
  `;
  return (
    <div>
      <label className="block mb-1 text-sm">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseCls}
        >
          <option value="" disabled>
            اختر {label}
          </option>
          {options.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={baseCls}
        />
      )}
    </div>
  );
}
  