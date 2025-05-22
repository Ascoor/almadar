import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ModalCard from "../common/ModalCard";
import { createLitigation, updateLitigation } from "../../services/api/litigations";

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
  reloadLitigations
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
    setForm((f) => ({ ...f, [name]: name === "case_year" ? String(value) : value }));
    setErrors((e) => ({ ...e, [name]: "" }));
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

  return (
    <ModalCard
      isOpen={isOpen}
      title={initialData ? "تعديل دعوى" : "إضافة دعوى"}
      loading={loading}
      onClose={onClose}
      onSubmit={handleSave}
      submitLabel={initialData ? "تحديث" : "إضافة"}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            label: "صفة الشركة",
            name: "scope",
            type: "select",
            options: [
              { value: "from", label: "من الشركة" },
              { value: "against", label: "ضد الشركة" },
            ]
          },
          { label: "رقم الدعوى", name: "case_number" },
          { label: "سنة الدعوى", name: "case_year" },
          { label: "المحكمة", name: "court" },
          { label: "الخصم", name: "opponent" },
          { label: "الموضوع", name: "subject" },
          { label: "تاريخ رفع الدعوى", name: "filing_date", type: "date" },
          {
            label: "الحالة",
            name: "status",
            type: "select",
            options: [
              { value: "open", label: "مفتوحة" },
              { value: "in_progress", label: "قيد التنفيذ" },
              { value: "closed", label: "مغلقة" },
            ]
          } 
        ].map(({ label, name, type = "text", options }) => (
          <div key={name}>
            <label className="block mb-1 text-sm text-muted-foreground">{label}</label>
            {type === "select" ? (
              <select
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 rounded-lg border ${errors[name] ? 'border-red-500' : 'border-border'} bg-background text-foreground`}
              >
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 rounded-lg border ${errors[name] ? 'border-red-500' : 'border-border'} bg-background text-foreground`}
              />
            )}
            {errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name]}</p>}
          </div>
        ))}
      </div>

      <div className="md:col-span-2 mt-4">
        <label className="block mb-1 text-sm text-muted-foreground">ملاحظات</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
        />
      </div>
    </ModalCard>
  );
}
