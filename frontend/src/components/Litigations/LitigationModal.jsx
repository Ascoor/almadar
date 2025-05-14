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
  const [loading, setLoading] = useState(false);

  // Initialize or reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm({
        id: initialData.id,
        case_number: initialData.case_number || "",
        case_year: initialData.case_year || "",
        court: initialData.court || "",
        opponent: initialData.opponent || "",
        scope: initialData.scope || "from",
        subject: initialData.subject || "",
        filing_date: initialData.filing_date?.slice(0, 10) || "",
        status: initialData.status || "open",
        notes: initialData.notes || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [isOpen, initialData]);

 
  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      // تنسيق تاريخ ISO للـ <input type="date">
      const date = initialData.filing_date
        ? initialData.filing_date.slice(0, 10)
        : "";
      setForm({
        ...initialData,
        filing_date: date,
      });
    } else {
      // نموذج فارغ عند الإضافة
      setForm((f) => ({ ...f, id: null, case_number: "",case_year:"", court: "", opponent: "", scope: "from", subject: "", filing_date: "", status: "open", notes: "" }));
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.id) {
        // تعديل
        await updateLitigation(form.id, payload);
        toast.success("✅ تم تعديل الدعوى بنجاح");
      } else {
        // إضافة جديدة
        await createLitigation(payload);
        toast.success("✅ تمت إضافة الدعوى بنجاح");
      }
      // إعادة تحميل الجدول
      reloadLitigations?.();
      // إغلاق المودال
      onClose();
    } catch (err) {
      const errs = err?.response?.data?.errors;
      if (errs) {
        Object.values(errs)
          .flat()
          .forEach((msg) => toast.error(`❌ ${msg}`));
      } else {
        toast.error("❌ فشل الحفظ. تحقق من البيانات.");
      }
      console.error(err);
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
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
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
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
              />
            )}
          </div>
        ))}
      </div>

      {/* Notes (spans two columns) */}
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
