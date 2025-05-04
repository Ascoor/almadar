import React, { useState, useEffect } from "react";

export default function InvestigationActionModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    action_date: "",
    action_type: "",
    officer_name: "",
    requirements: "",
    results: "",
    status: "",
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
      action_date: "",
      action_type: "",
      officer_name: "",
      requirements: "",
      results: "",
      status: "",
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
      console.error("Error saving action:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-50">
            <div className="text-lg font-bold text-almadar-blue dark:text-almadar-yellow animate-pulse">
              جاري الحفظ...
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-almadar-blue dark:text-almadar-yellow">
          {initialData ? "تعديل إجراء" : "إضافة إجراء"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">تاريخ الإجراء</label>
              <input
                type="date"
                name="action_date"
                value={form.action_date}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">نوع الإجراء</label>
              <input
                type="text"
                name="action_type"
                value={form.action_type}
                onChange={handleChange}
                required
                placeholder="مثال: جلسة استماع"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">اسم القائم بالإجراء</label>
              <input
                type="text"
                name="officer_name"
                value={form.officer_name}
                onChange={handleChange}
                required
                placeholder="مثال: د. فاطمة"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">المطلوب</label>
              <input
                type="text"
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                placeholder="مثال: تقديم إفادة"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">النتيجة</label>
              <input
                type="text"
                name="results"
                value={form.results}
                onChange={handleChange}
                placeholder="مثال: تم الاستماع للموظف"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">الحالة</label>
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

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-almadar-blue hover:bg-emerald-700 dark:bg-almadar-yellow text-white dark:text-black font-bold"
            >
              {loading ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
