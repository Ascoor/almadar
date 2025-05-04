import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createLegalAdvice, updateLegalAdvice } from "../../services/api/legalAdvices";

import API_CONFIG from "../../config/config";
export default function LegalAdviceModal({ isOpen, onClose, initialData = null, reload }) {
  const [form, setForm] = useState({
    type: "",
    topic: "",
    text: "",
    requester: "",
    issuer: "",
    advice_date: "",
    advice_number: "",
    attachment: null,
    oldAttachment: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        attachment: null,
        oldAttachment: initialData.attachment,
      });
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setForm({
      type: "",
      topic: "",
      text: "",
      requester: "",
      issuer: "",
      advice_date: "",
      advice_number: "",
      attachment: null,
      oldAttachment: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment") {
      const file = files[0];
      if (file && file.type !== "application/pdf") {
        toast.error("الملف يجب أن يكون بصيغة PDF فقط.");
        return;
      }
      setForm((prev) => ({ ...prev, attachment: file }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value && key !== "oldAttachment") {
        payload.append(key, value);
      }
    });

    if (form.id) payload.append("_method", "PUT");

    try {
      if (form.id) {
        await updateLegalAdvice(form.id, payload);
        toast.success("تم تعديل المشورة بنجاح.");
      } else {
        await createLegalAdvice(payload);
        toast.success("تم إضافة المشورة بنجاح.");
      }
      reload?.();
      onClose();
    } catch (err) {
      toast.error("حدث خطأ أثناء الحفظ.");
      console.error(err);
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
          {initialData ? "تعديل المشورة القانونية" : "إضافة مشورة قانونية"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* بيانات أساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">نوع المشورة</label>
              <input type="text" name="type" value={form.type} onChange={handleChange}
                required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">الموضوع</label>
              <input type="text" name="topic" value={form.topic} onChange={handleChange}
                required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">الجهة الطالبة</label>
              <input type="text" name="requester" value={form.requester} onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">الجهة المصدرة</label>
              <input type="text" name="issuer" value={form.issuer} onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">تاريخ المشورة</label>
              <input type="date" name="advice_date" value={form.advice_date} onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">رقم المشورة</label>
              <input type="text" name="advice_number" value={form.advice_number} onChange={handleChange}
                required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
          </div>

          {/* نص المشورة */}
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">نص المشورة</label>
            <textarea name="text" value={form.text} onChange={handleChange} rows="4"
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
          </div>

          {/* مرفق PDF */}
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">مرفق PDF</label>
            <input type="file" name="attachment" accept="application/pdf" onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            {form.attachment ? (
              <div className="mt-1 text-green-600 text-sm">{form.attachment.name}</div>
            ) : form.oldAttachment ? (
              <a             href={`${API_CONFIG.baseURL}/storage/${form.oldAttachment}`}
         
              target="_blank" rel="noopener noreferrer"
                className="mt-1 text-blue-500 text-sm underline block">
                عرض المرفق الحالي
              </a>
            ) : null}
          </div>

          {/* أزرار */}
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 text-gray-900 dark:text-white">
              إلغاء
            </button>
            <button type="submit" disabled={loading}
              className="px-6 py-2 rounded-lg bg-almadar-blue hover:bg-emerald-700 dark:bg-almadar-yellow text-white dark:text-black font-bold">
              {loading ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
