import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { createLegalAdvice, updateLegalAdvice } from "../../services/api/legalAdvices";
import API_CONFIG from "../../config/config";

const LegalAdviceModal = ({ isOpen, onClose, initialData = null, reload }) => {
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative transform-gpu">
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-50">
            <div className="text-lg font-bold text-blue-400 dark:text-yellow-400 animate-pulse">
              جاري الحفظ...
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 bg-green-100 p-4 dark:bg-royal-dark/30 rounded-full text-center text-blue-400 dark:text-yellow-400">
          {initialData ? "تعديل الرأى / المشورة" : "إضافة رأى / مشورة جديد"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "نوع المشورة", name: "type" },
              { label: "الموضوع", name: "topic" },
              { label: "الجهة الطالبة", name: "requester" },
              { label: "الجهة المصدرة", name: "issuer" },
              { label: "تاريخ المشورة", name: "advice_date", type: "date" },
              { label: "رقم المشورة", name: "advice_number" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-sm mb-1 text-muted-foreground">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={["type", "topic", "advice_number"].includes(name)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm mb-1 text-muted-foreground">نص المشورة</label>
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-muted-foreground">مرفق PDF</label>
            <input
              type="file"
              name="attachment"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            />
            {form.attachment ? (
              <div className="mt-1 text-green-600 text-sm">{form.attachment.name}</div>
            ) : form.oldAttachment ? (
              <a
                href={`${API_CONFIG.baseURL}/storage/${form.oldAttachment}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-blue-500 text-sm underline block"
              >
                عرض المرفق الحالي
              </a>
            ) : null}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-reded text-foreground hover:bg-reded/80 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-bold"
            >
              {loading ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LegalAdviceModal;
