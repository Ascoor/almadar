import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ModalCard from "../common/ModalCard";
import { useActionTypes } from "@/hooks/dataHooks";

const EMPTY_FORM = {
  id: null,
  action_date: "",
  action_type_id: "",
  lawyer_name: "",
  requirements: "",
  location: "",
  notes: "",
  results: "",
  status: "pending",
};

export default function LitigationActionModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const { data: actionTypes = [], isLoading } = useActionTypes("litigation");

  useEffect(() => {
    if (!isOpen) return;
    setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch {
      toast.error("فشل في حفظ الإجراء");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalCard
      isOpen={isOpen}
      title={form.id ? "تعديل إجراء" : "إضافة إجراء"}
      onClose={onClose}
      onSubmit={handleSave}
      loading={loading}
      submitLabel={form.id ? "تحديث" : "إضافة"}
    >
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
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
          options={actionTypes.map((t) => ({
            value: t.id,
            label: t.action_name,
          }))}
          value={form.action_type_id}
          onChange={handleChange}
          disabled={isLoading}
        />

        <Field
          label="اسم القائم بالإجراء"
          name="lawyer_name"
          type="text"
          value={form.lawyer_name}
          onChange={handleChange}
          placeholder="مثال: د. فاطمة"
        />

        <Field
          label="المطلوب"
          name="requirements"
          type="text"
          value={form.requirements}
          onChange={handleChange}
        />

        <Field
          label="جهة الإجراء"
          name="location"
          type="text"
          value={form.location}
          onChange={handleChange}
        />

        <Field
          label="النتيجة"
          name="results"
          type="text"
          value={form.results}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">ملاحظات</label>
          <textarea
            name="notes"
            value={form.notes ?? ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            rows={2}
          />
        </div>

        <Field
          label="الحالة"
          name="status"
          type="select"
          options={[
            { value: "pending", label: "معلق" },
            { value: "in_review", label: "قيد المراجعة" },
            { value: "done", label: "منجز" },
          ]}
          value={form.status}
          onChange={handleChange}
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
}) {
  const baseCls =
    "w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none";

  return (
    <div>
      <label className="block mb-1 text-sm">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          className={baseCls}
          required
        >
          <option value="">اختر {label}</option>
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
          value={value ?? ""}
          onChange={onChange}
          className={baseCls}
          placeholder={placeholder}
          required
        />
      )}
    </div>
  );
}
