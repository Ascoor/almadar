import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ModalCard from "@/components/common/ModalCard";
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

export default function LitigationActionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const { data: actionTypes = [], isLoading } = useActionTypes("litigation");

  const isEdit = !!form.id;

  useEffect(() => {
    if (!isOpen) return;
    // عند الفتح: إمّا نملأ بيانات موجودة أو نرجع للفورم الفارغ
    setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // تحقق بسيط قبل الإرسال
    if (!form.action_date || !form.action_type_id || !form.lawyer_name) {
      toast.error("فضلاً أكمل الحقول الأساسية (التاريخ، نوع الإجراء، اسم القائم بالإجراء).");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      console.error("LitigationActionModal save error:", err);
      toast.error("فشل في حفظ الإجراء");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalCard
      isOpen={isOpen}
      title={isEdit ? "تعديل إجراء" : "إضافة إجراء"}
      onClose={onClose}
      onSubmit={handleSave}
      loading={loading}
      submitLabel={isEdit ? "تحديث" : "إضافة"}
    >
      <form
        dir="rtl"
        className="grid grid-cols-1 gap-4 text-right md:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* تاريخ الإجراء */}
        <Field
          label="تاريخ الإجراء"
          name="action_date"
          type="date"
          value={form.action_date}
          onChange={handleChange}
          required
        />

        {/* نوع الإجراء */}
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
          required
        />

        {/* اسم القائم بالإجراء */}
        <Field
          label="اسم القائم بالإجراء"
          name="lawyer_name"
          type="text"
          value={form.lawyer_name}
          onChange={handleChange}
          placeholder="مثال: د. فاطمة"
          required
          helper="اكتب اسم المحامي أو المستشار المسؤول عن الإجراء."
        />

        {/* المطلوب */}
        <Field
          label="المطلوب"
          name="requirements"
          type="text"
          value={form.requirements}
          onChange={handleChange}
          placeholder="مستندات، مذكرات، حضور جلسة..."
        />

        {/* جهة الإجراء */}
        <Field
          label="جهة الإجراء"
          name="location"
          type="text"
          value={form.location}
          onChange={handleChange}
          placeholder="مثال: محكمة شمال طرابلس، إدارة القضايا..."
        />

        {/* النتيجة */}
        <Field
          label="النتيجة"
          name="results"
          type="text"
          value={form.results}
          onChange={handleChange}
          placeholder="تم التنفيذ، مؤجل، مرفوض..."
        />

        {/* ملاحظات */}
        <div className="md:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-foreground">
            ملاحظات
          </label>
          <textarea
            name="notes"
            value={form.notes ?? ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            rows={2}
            placeholder="أي ملاحظات إضافية حول هذا الإجراء..."
          />
        </div>

        {/* الحالة */}
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
  helper,
}) {
  const baseCls =
    "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm " +
    "placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      {type === "select" ? (
        <select
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          className={baseCls}
          required={required}
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
          required={required}
        />
      )}

      {helper && (
        <p className="text-[0.7rem] text-muted-foreground">{helper}</p>
      )}
    </div>
  );
}
