  import React, { useState, useEffect } from "react";
  import { toast } from "sonner";
  import ModalCard from "../common/ModalCard";

  // القيم الافتراضية للنموذج
  const EMPTY_FORM = {
    id: null,
    case_number: "",
    court: "",
    opponent: "",
    scope: "from",
    results: "",
    subject: "",
    filing_date: "",
    status: "open",
    notes: "",
  };

  export default function LitigationActionModal({
    isOpen, onClose, onSubmit, initialData, actionTypes = [],
  }) {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(false);

    // تعيين القيم الأولية عند فتح النموذج
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

    // لا تظهر أي شيء إذا لم يكن النموذج مفتوحًا أو لم يتم تهيئته
    if (!isOpen || form === null) return null;

    // التعامل مع تغييرات المدخلات
    const handleChange = e => {
      const { name, value } = e.target;
      setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    // حفظ البيانات
    const handleSave = async () => {
      setLoading(true);
      console.log(form); // تحقق من محتويات النموذج
      try {
        await onSubmit(form); // إرسال البيانات
        onClose(); // إغلاق النموذج
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
            <InputField
              label="تاريخ الإجراء"
              type="date"
              name="action_date"
              value={form.action_date}
              onChange={handleChange}
              required
            />
            <SelectField
              label="نوع الإجراء"
              name="action_type_id"
              value={form.action_type_id}
              onChange={handleChange}
              options={actionTypes}
              required
            />
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
            <StatusField
              label="الحالة"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            />
          </div>
        </form>
      </ModalCard>
    );
  }
