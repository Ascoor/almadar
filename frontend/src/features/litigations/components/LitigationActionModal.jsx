import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import ModalCard from "@/components/common/ModalCard";
import { useActionTypes } from "@/hooks/dataHooks";
import { getRoleLawyers } from "@/services/api/users";

const EMPTY_FORM = {
  id: null,
  action_date: "",
  action_type_id: "",
  lawyer_name: "",              // ✅ اختياري (لو الباك محتاجه)
  assigned_to_user_id: "",      // ✅ الجديد
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

  const { data: actionTypes = [], isLoading: actionTypesLoading } =
    useActionTypes("litigation");

  const [lawyers, setLawyers] = useState([]);
  const [lawyersLoading, setLawyersLoading] = useState(false);

  const isEdit = !!form.id;

  // ✅ تهيئة الفورم عند فتح المودال
  useEffect(() => {
    if (!isOpen) return;

    setForm(
      initialData
        ? {
            ...EMPTY_FORM,
            ...initialData,
            // دعم أشكال مختلفة للـ assigned user
            assigned_to_user_id:
              initialData.assigned_to_user_id ||
              initialData.assignedTo?.id ||
              initialData.assigned_to?.id ||
              "",
          }
        : EMPTY_FORM
    );
  }, [isOpen, initialData]);

  // ✅ تحميل المحامين فقط
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const fetchLawyers = async () => {
      setLawyersLoading(true);
      try {
        const list = await getRoleLawyers();
        if (mounted) setLawyers(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        toast.error("❌ فشل تحميل قائمة المحامين");
        if (mounted) setLawyers([]);
      } finally {
        if (mounted) setLawyersLoading(false);
      }
    };

    fetchLawyers();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const lawyerById = useMemo(() => {
    const m = new Map();
    lawyers.forEach((u) => m.set(String(u.id), u));
    return m;
  }, [lawyers]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ لو اختر محامي: خزّن id + (اختياري) عبّي lawyer_name تلقائي
    if (name === "assigned_to_user_id") {
      const u = lawyerById.get(String(value));
      setForm((prev) => ({
        ...prev,
        assigned_to_user_id: value,
        lawyer_name: u?.name || "", // اختياري
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // ✅ تحقق أساسي
    if (!form.action_date || !form.action_type_id || !form.assigned_to_user_id) {
      toast.error("فضلاً أكمل الحقول الأساسية (التاريخ، نوع الإجراء، المحامي المسؤول).");
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
          disabled={actionTypesLoading}
          required
        />

        {/* ✅ المحامي المسؤول (Dropdown) */}
        <Field
          label="المحامي المسؤول"
          name="assigned_to_user_id"
          type="select"
          options={lawyers.map((u) => ({
            value: u.id,
            label: `${u.name}${u.email ? ` - ${u.email}` : ""}`,
          }))}
          value={form.assigned_to_user_id}
          onChange={handleChange}
          disabled={lawyersLoading}
          required
          helper="سيظهر فقط المستخدمون الذين دورهم (lawyer)."
        />

        {/* (اختياري) اسم القائم بالإجراء — لو تحب تخليه readonly */}
        <Field
          label="اسم القائم بالإجراء"
          name="lawyer_name"
          type="text"
          value={form.lawyer_name}
          onChange={handleChange}
          placeholder="سيتم تعبئته تلقائياً عند اختيار المحامي"
          disabled
          helper="هذا الحقل يُملأ تلقائياً من المحامي المختار (اختياري)."
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
      <label className="block text-sm font-medium text-foreground">{label}</label>

      {type === "select" ? (
        <select
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          className={baseCls}
          required={required}
        >
          <option value="">{disabled ? "جاري التحميل..." : `اختر ${label}`}</option>
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
          disabled={disabled}
        />
      )}

      {helper && <p className="text-[0.7rem] text-muted-foreground">{helper}</p>}
    </div>
  );
}
