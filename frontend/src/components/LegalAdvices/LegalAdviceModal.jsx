// components/LegalAdvices/LegalAdviceModal.jsx
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ModalCard from "../common/ModalCard";
import { createLegalAdvice, updateLegalAdvice } from "../../services/api/legalAdvices";
import API_CONFIG from "../../config/config";

const EMPTY_FORM = {
  id: null,
  advice_type_id: "",
  topic: "",
  text: "",
  requester: "",
  issuer: "",
  advice_date: "",
  advice_number: "",
  attachment: null,
  oldAttachment: null,
};

export default function LegalAdviceModal({
  isOpen,
  onClose,
  adviceTypes = [],
  initialData = null,
  reload
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  // عند فتح المودال نملأ النموذج أو نفرغه
  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm({
        id: initialData.id,
        advice_type_id: initialData.advice_type_id || "",
        topic: initialData.topic || "",
        text: initialData.text || "",
        requester: initialData.requester || "",
        issuer: initialData.issuer || "",
        advice_date: initialData.advice_date?.slice(0, 10) || "",
        advice_number: initialData.advice_number || "",
        attachment: null,
        oldAttachment: initialData.attachment || null,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment") {
      const file = files[0];
      if (file && file.type !== "application/pdf") {
        toast.error("الملف يجب أن يكون بصيغة PDF فقط.");
        return;
      }
      setForm(prev => ({ ...prev, attachment: file }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v != null && k !== "oldAttachment") {
          payload.append(k, v);
        }
      });
      if (form.id) payload.append("_method", "PUT");

      if (form.id) {
        await updateLegalAdvice(form.id, payload);
        toast.success("✅ تم تعديل المشورة بنجاح");
      } else {
        await createLegalAdvice(payload);
        toast.success("✅ تم إضافة المشورة بنجاح");
      }

      reload?.();
      onClose();
    } catch (err) {
      toast.error("❌ حدث خطأ أثناء الحفظ.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCard
      isOpen={isOpen}
      title={initialData ? "تعديل رأي/مشورة" : "إضافة رأي/مشورة جديد"}
      loading={loading}
      onClose={onClose}
      onSubmit={handleSave}
      submitLabel={initialData ? "تحديث" : "إضافة"}
    >
      <form className="space-y-6 text-right">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* نوع المشورة */}
          <div>
            <label className="block mb-1 text-sm">نوع المشورة</label>
            <select
              name="advice_type_id"
              value={form.advice_type_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="">-- اختر نوع المشورة --</option>
              {adviceTypes.map(t => (
                <option key={t.id} value={t.id}>{t.type_name}</option>
              ))}
            </select>
          </div>

          {/* حقول نموذجية */}
          {[
            { label: "الموضوع", name: "topic", type: "text" },
            { label: "الجهة الطالبة", name: "requester", type: "text" },
            { label: "الجهة المصدرة", name: "issuer", type: "text" },
            { label: "تاريخ المشورة", name: "advice_date", type: "date" },
            { label: "رقم المشورة", name: "advice_number", type: "text" }
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block mb-1 text-sm">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required={["topic", "advice_number"].includes(name)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
          ))}
        </div>

        {/* نص المشورة */}
        <div>
          <label className="block mb-1 text-sm">نص المشورة</label>
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>

        {/* مرفق PDF */}
        <div>
          <label className="block mb-1 text-sm">مرفق PDF</label>
          <input
            type="file"
            name="attachment"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          />
          {form.attachment ? (
            <p className="mt-1 text-green-600">{form.attachment.name}</p>
          ) : form.oldAttachment ? (
            <a
              href={`${API_CONFIG.baseURL}/storage/${form.oldAttachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-blue-600 underline block"
            >
              عرض المرفق الحالي
            </a>
          ) : null}
        </div>
      </form>
    </ModalCard>
  );
}
