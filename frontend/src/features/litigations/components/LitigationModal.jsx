import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ModalCard from "@/components/common/ModalCard";
import { modalInput, modalLabel, modalHelperText } from "@/components/common/modalStyles";
import { createLitigation, updateLitigation } from "@/services/api/litigations";

const EMPTY_FORM = {
  id: null,
  case_number: "",
  case_year: "",
  court: "",
  opponent: "",
  scope: "from",
  subject: "",
  filing_date: "",
  status: "open",
  notes: "",
};

export default function LitigationModal({
  isOpen,
  onClose,
  initialData = null,
  reloadLitigations,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        ...EMPTY_FORM,
        ...initialData,
        filing_date: initialData.filing_date?.slice(0, 10) || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "case_year" ? String(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.scope) newErrors.scope = "الرجاء تحديد صفة الشركة";
    if (!form.case_number) newErrors.case_number = "رقم الدعوى مطلوب";
    if (!form.case_year) newErrors.case_year = "سنة الدعوى مطلوبة";
    if (!form.court) newErrors.court = "اسم المحكمة مطلوب";
    if (!form.opponent) newErrors.opponent = "اسم الخصم مطلوب";
    if (!form.subject) newErrors.subject = "موضوع الدعوى مطلوب";
    if (!form.filing_date) newErrors.filing_date = "تاريخ رفع الدعوى مطلوب";
    if (!form.status) newErrors.status = "حالة الدعوى مطلوبة";
    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, case_year: String(form.case_year) };

      if (form.id) {
        await updateLitigation(form.id, payload);
        toast.success("✅ تم تعديل الدعوى بنجاح");
      } else {
        await createLitigation(payload);
        toast.success("✅ تمت إضافة الدعوى بنجاح");
      }

      reloadLitigations?.();
      onClose();
    } catch (err) {
      const errs = err?.response?.data?.errors;
      if (errs) {
        const backendErrors = {};
        Object.entries(errs).forEach(([field, messages]) => {
          backendErrors[field] = messages[0];
          toast.error(`❌ ${messages[0]}`);
        });
        setErrors(backendErrors);
      } else {
        toast.error("❌ فشل الحفظ. تحقق من البيانات.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalCard
      isOpen={isOpen}
      title={initialData ? "تعديل دعوى" : "إضافة دعوى"}
      loading={loading}
      onClose={onClose}
      onSubmit={handleSave}
      submitLabel={initialData ? "تحديث" : "إضافة"}
    >
      <form
        dir="rtl"
        className="grid grid-cols-1 gap-4 text-right md:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* صفة الشركة */}
        <Field
          label="صفة الشركة"
          name="scope"
          type="select"
          value={form.scope}
          onChange={handleChange}
          error={errors.scope}
          options={[
            { value: "", label: "اختر صفة الشركة" },
            { value: "from", label: "من الشركة" },
            { value: "against", label: "ضد الشركة" },
          ]}
        />

        {/* رقم الدعوى */}
        <Field
          label="رقم الدعوى"
          name="case_number"
          value={form.case_number}
          onChange={handleChange}
          error={errors.case_number}
          placeholder="مثال: 1234/ق"
        />

        {/* سنة الدعوى */}
        <Field
          label="سنة الدعوى"
          name="case_year"
          value={form.case_year}
          onChange={handleChange}
          error={errors.case_year}
          placeholder="مثال: 2025"
        />

        {/* المحكمة */}
        <Field
          label="المحكمة"
          name="court"
          value={form.court}
          onChange={handleChange}
          error={errors.court}
          placeholder="مثال: محكمة شمال طرابلس الابتدائية"
        />

        {/* الخصم */}
        <Field
          label="الخصم"
          name="opponent"
          value={form.opponent}
          onChange={handleChange}
          error={errors.opponent}
          placeholder="اسم الخصم أو الجهة"
        />

        {/* الموضوع */}
        <Field
          label="الموضوع"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          error={errors.subject}
          placeholder="مثال: مطالبة مالية، إنهاء عقد، تعويض..."
        />

        {/* تاريخ رفع الدعوى */}
        <Field
          label="تاريخ رفع الدعوى"
          name="filing_date"
          type="date"
          value={form.filing_date}
          onChange={handleChange}
          error={errors.filing_date}
        />

        {/* الحالة */}
        <Field
          label="الحالة"
          name="status"
          type="select"
          value={form.status}
          onChange={handleChange}
          error={errors.status}
          options={[
            { value: "open", label: "مفتوحة" },
            { value: "in_progress", label: "قيد التنفيذ" },
            { value: "closed", label: "مغلقة" },
          ]}
        />

        {/* ملاحظات */}
        <div className="md:col-span-2 space-y-1">
          <label className={modalLabel}>
            ملاحظات
          </label>
          <textarea
            name="notes"
            value={form.notes || ""}
            onChange={handleChange}
            rows={3}
            className={`${modalInput} min-h-[110px]`}
            placeholder="أي تفاصيل إضافية حول ملف الدعوى..."
          />
        </div>
      </form>
    </ModalCard>
  );
}

/**
 * حقل موحّد للـ input / select مع ستايل مبني على التوكنز + إظهار الأخطاء
 */
function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  options = [],
  placeholder,
}) {
  return (
    <div className="space-y-1">
      <label className={modalLabel}>
        {label}
      </label>

      {type === "select" ? (
        <select
          name={name}
          value={value ?? ""}
          onChange={onChange}
          className={`${modalInput} ${
            error
              ? "border-destructive focus:ring-destructive/40"
              : "focus:border-ring"
          }`}
        >
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
          placeholder={placeholder}
          className={`${modalInput} ${
            error
              ? "border-destructive focus:ring-destructive/40"
              : "focus:border-ring"
          }`}
        />
      )}

      {error && (
        <p className={`${modalHelperText} font-semibold text-destructive`}>
          {error}
        </p>
      )}
    </div>
  );
}
