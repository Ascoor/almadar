// components/LegalAdvices/LegalAdviceModal.jsx
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ModalCard from "@/components/common/ModalCard";
import {
  modalInput,
  modalLabel,
  modalHelperText,
} from "@/components/common/modalStyles";
import { createLegalAdvice, updateLegalAdvice } from "@/services/api/legalAdvices";
import API_CONFIG from "@/config/config";
import { getRoleLawyer } from "@/services/api/users";

const EMPTY_FORM = {
  id: null,
  advice_type_id: "",
  topic: "",
  text: "",
  requester: "",
  issuer: "",
  advice_date: "",
  advice_number: "",
  assigned_to_user_id: "",
  attachment: null,
  oldAttachment: null,
};

export default function LegalAdviceModal({
  isOpen,
  onClose,
  adviceTypes = [],
  initialData = null,
  reload,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const [lawyers, setLawyers] = useState([]);
  const [lawyersLoading, setLawyersLoading] = useState(false);

  const [errors, setErrors] = useState({});

  // ✅ تهيئة الفورم عند فتح المودال
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        ...EMPTY_FORM,
        id: initialData.id ?? null,
        advice_type_id: initialData.advice_type_id ?? "",
        topic: initialData.topic ?? "",
        text: initialData.text ?? "",
        requester: initialData.requester ?? "",
        issuer: initialData.issuer ?? "",
        advice_date: initialData.advice_date?.slice(0, 10) ?? "",
        advice_number: initialData.advice_number ?? "",
        assigned_to_user_id:
          initialData.assigned_to_user_id ||
          initialData.assigned_to_user?.id ||
          initialData.assignedTo?.id ||
          "",
        attachment: null,
        oldAttachment: initialData.attachment ?? null,
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setErrors({});
  }, [isOpen, initialData]);

  // ✅ جلب المحامين فقط
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const fetchLawyers = async () => {
      setLawyersLoading(true);
      try {
        const list = await getRoleLawyer(); // role=lawyer
        if (mounted) setLawyers(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        toast.error("❌ فشل تحميل قائمة المحامين");
        if (mounted) setLawyers([]);
      } finally {
        if (mounted) setLawyersLoading(false);
      }
    };

    fetchLawyers();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const validate = () => {
    const e = {};

    if (!form.advice_type_id) e.advice_type_id = "نوع المشورة مطلوب";
    if (!form.topic) e.topic = "الموضوع مطلوب";
    if (!form.advice_number) e.advice_number = "رقم المشورة مطلوب";
    if (!form.assigned_to_user_id) e.assigned_to_user_id = "اختر المحامي المسؤول";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attachment") {
      const file = files?.[0];
      if (file && file.type !== "application/pdf") {
        toast.error("الملف يجب أن يكون بصيغة PDF فقط.");
        return;
      }
      setForm((prev) => ({ ...prev, attachment: file }));
      setErrors((prev) => ({ ...prev, attachment: undefined }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const inputClass = (name) =>
    `${modalInput} ${
      errors[name]
        ? "border-destructive focus:ring-destructive/40"
        : "focus:border-ring"
    }`;

  const handleSave = async () => {
    if (!validate()) {
      toast.warning("⚠️ يرجى تعبئة الحقول الإلزامية.");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (k === "oldAttachment") return;
        if (k === "attachment") {
          if (v instanceof File) payload.append("attachment", v);
          return;
        }
        if (v != null) payload.append(k, v);
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
      console.error(err);
      toast.error("❌ حدث خطأ أثناء الحفظ.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalCard
      isOpen={isOpen}
      title={initialData ? "تعديل رأي/مشورة" : "إضافة رأي/مشورة جديد"}
      loading={loading}
      onClose={onClose}
      onSubmit={handleSave}
      submitLabel={initialData ? "تحديث" : "إضافة"}
    >
      <form className="space-y-6 text-right" dir="rtl" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* نوع المشورة */}
          <div className="space-y-1">
            <label className={modalLabel}>نوع المشورة</label>
            <select
              name="advice_type_id"
              value={form.advice_type_id}
              onChange={handleChange}
              className={inputClass("advice_type_id")}
            >
              <option value="">-- اختر نوع المشورة --</option>
              {adviceTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.type_name}
                </option>
              ))}
            </select>
            {errors.advice_type_id && (
              <p className={`${modalHelperText} text-destructive font-semibold`}>
                {errors.advice_type_id}
              </p>
            )}
          </div>

          {/* الموضوع */}
          <div className="space-y-1">
            <label className={modalLabel}>الموضوع</label>
            <input
              name="topic"
              value={form.topic}
              onChange={handleChange}
              className={inputClass("topic")}
            />
            {errors.topic && (
              <p className={`${modalHelperText} text-destructive font-semibold`}>
                {errors.topic}
              </p>
            )}
          </div>

          {/* الجهة الطالبة */}
          <div className="space-y-1">
            <label className={modalLabel}>الجهة الطالبة</label>
            <input
              name="requester"
              value={form.requester}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          {/* الجهة المصدرة */}
          <div className="space-y-1">
            <label className={modalLabel}>الجهة المصدرة</label>
            <input
              name="issuer"
              value={form.issuer}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          {/* تاريخ المشورة */}
          <div className="space-y-1">
            <label className={modalLabel}>تاريخ المشورة</label>
            <input
              type="date"
              name="advice_date"
              value={form.advice_date}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          {/* رقم المشورة */}
          <div className="space-y-1">
            <label className={modalLabel}>رقم المشورة</label>
            <input
              name="advice_number"
              value={form.advice_number}
              onChange={handleChange}
              className={inputClass("advice_number")}
            />
            {errors.advice_number && (
              <p className={`${modalHelperText} text-destructive font-semibold`}>
                {errors.advice_number}
              </p>
            )}
          </div>

          {/* المحامي المسؤول (role=lawyer فقط) */}
          <div className="space-y-1 md:col-span-2">
            <label className={modalLabel}>المحامي المسؤول</label>
            <select
              name="assigned_to_user_id"
              value={form.assigned_to_user_id || ""}
              onChange={handleChange}
              className={inputClass("assigned_to_user_id")}
              disabled={lawyersLoading}
            >
              <option value="">
                {lawyersLoading ? "جاري تحميل المحامين..." : "اختر المحامي"}
              </option>
              {lawyers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.email ? `- ${u.email}` : ""}
                </option>
              ))}
            </select>
            {errors.assigned_to_user_id && (
              <p className={`${modalHelperText} text-destructive font-semibold`}>
                {errors.assigned_to_user_id}
              </p>
            )}
          </div>
        </div>

        {/* نص المشورة */}
        <div className="space-y-1">
          <label className={modalLabel}>نص المشورة</label>
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            rows={4}
            className={`${modalInput} min-h-[140px]`}
          />
        </div>

        {/* مرفق PDF */}
        <div className="space-y-2">
          <label className={modalLabel}>مرفق PDF</label>
          <input
            type="file"
            name="attachment"
            accept="application/pdf"
            onChange={handleChange}
            className={modalInput}
          />

          {form.attachment ? (
            <p className={`${modalHelperText} text-success`}>
              {form.attachment.name}
            </p>
          ) : form.oldAttachment ? (
            <a
              href={`${API_CONFIG.baseURL}/storage/${form.oldAttachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-primary underline"
            >
              عرض المرفق الحالي
            </a>
          ) : null}
        </div>
      </form>
    </ModalCard>
  );
}
