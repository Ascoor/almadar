import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  createLitigationAction,
  updateLitigationAction,
} from "@/services/api/litigations";

export default function LitigationActionModal({
  isOpen,
  onClose,
  initialData = null,
  litigationId,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    action_date: "",
    action_type: "",
    requirements: "",
    results: "",
    lawyer_name: "",
    location: "",
    notes: "",
    status: "pending",
  });

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
      requirements: "",
      results: "",
      lawyer_name: "",
      location: "",
      notes: "",
      status: "pending",
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
      if (initialData && initialData.id) {
        await updateLitigationAction(litigationId, initialData.id, form);
        toast.success("تم تحديث الإجراء بنجاح.");
      } else {
        await createLitigationAction(litigationId, form);
        toast.success("تم إضافة الإجراء بنجاح.");
      }

      onClose();
      onSuccess?.(); // إعادة تحميل البيانات من الأب
    } catch (err) {
      console.error(err);
      toast.error("فشل العملية، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center z-50">
            <p className="text-almadar-blue dark:text-almadar-yellow font-semibold animate-pulse">
              جاري المعالجة...
            </p>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-almadar-blue dark:text-almadar-yellow">
          {initialData ? "تعديل إجراء قضائي" : "إضافة إجراء قضائي"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">تاريخ الإجراء</label>
            <input
              type="date"
              name="action_date"
              value={form.action_date}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">نوع الإجراء</label>
            <input
              type="text"
              name="action_type"
              value={form.action_type}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">الطلبات</label>
            <input
              type="text"
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">النتيجة</label>
            <input
              type="text"
              name="results"
              value={form.results}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">المحامي</label>
            <input
              type="text"
              name="lawyer_name"
              value={form.lawyer_name}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">مكان الإجراء</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">ملاحظات</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="input-field"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">الحالة</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="pending">معلق</option>
              <option value="in_review">قيد المراجعة</option>
              <option value="done">منجز</option>
            </select>
          </div>

          {/* الأزرار */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-almadar-blue hover:bg-emerald-700 dark:bg-almadar-yellow text-white dark:text-black font-bold rounded"
            >
              {initialData ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
