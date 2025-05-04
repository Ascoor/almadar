import React, { useState, useEffect } from "react";

export default function LitigationModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [form, setForm] = useState({
    case_type: "from_company",
    case_number: "",
    court: "",
    opponents: "",
    subject: "",
    filing_date: "",
    status: "open",
    notes: "",
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
      case_type: "from_company",
      case_number: "",
      court: "",
      opponents: "",
      subject: "",
      filing_date: "",
      status: "open",
      notes: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error("❌ فشل الحفظ:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-50">
            <p className="text-lg font-semibold text-almadar-blue dark:text-almadar-yellow animate-pulse">
              جاري الحفظ...
            </p>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-almadar-blue dark:text-almadar-yellow">
          {initialData ? "تعديل دعوى" : "إضافة دعوى"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">صفة الشركة</label>
            <select name="case_type" value={form.case_type} onChange={handleChange} required className="input">
              <option value="from_company">مرفوعة من الشركة</option>
              <option value="against_company">مرفوعة على الشركة</option>
            </select>
          </div>
          <div>
            <label className="label">رقم الدعوى</label>
            <input type="text" name="case_number" value={form.case_number} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="label">المحكمة</label>
            <input type="text" name="court" value={form.court} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="label">الخصوم</label>
            <input type="text" name="opponents" value={form.opponents} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="label">الموضوع</label>
            <input type="text" name="subject" value={form.subject} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="label">تاريخ رفع الدعوى</label>
            <input type="date" name="filing_date" value={form.filing_date} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="label">الحالة</label>
            <select name="status" value={form.status} onChange={handleChange} required className="input">
              <option value="open">مفتوحة</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="closed">مغلقة</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">ملاحظات</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input" />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} className="btn bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:text-white">
              إلغاء
            </button>
            <button type="submit" disabled={loading} className="btn bg-almadar-blue hover:bg-green-700 dark:bg-almadar-yellow dark:text-black font-bold">
              {initialData ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
