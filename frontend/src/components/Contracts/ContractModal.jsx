import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ModalCard from "../common/ModalCard";
import { createContract, updateContract } from "../../services/api/contracts";

const EMPTY_FORM = {
  id: null,
  contract_category_id: "",
  scope: "local",
  number: "",
  value: "",
  contract_parties: "",
  start_date: "",
  end_date: "",
  notes: "",
  status: "active",
  summary: "",
  attachment: null,
  oldAttachment: null,
};

export default function ContractModal({
  isOpen,
  onClose,
  initialData = null,
  categories = [],
  reloadContracts,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [hasDuration, setHasDuration] = useState(false);
  const [loading, setLoading] = useState(false);

  // كلما تم فتح المودال أو تغيّرت بيانات initialData، نعيد تهيئة الـ form
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        id: initialData.id || null,
        contract_category_id: initialData.contract_category_id || "",
        scope: initialData.scope || "local",
        number: initialData.number || "",
        value: initialData.value != null ? initialData.value : "",
        contract_parties: initialData.contract_parties || "",
        start_date: initialData.start_date
          ? initialData.start_date.slice(0, 10)
          : "",
        end_date: initialData.end_date ? initialData.end_date.slice(0, 10) : "",
        notes: initialData.notes || "",
        status: initialData.status || "active",
        summary: initialData.summary || "",
        attachment: null,
        oldAttachment: initialData.attachment || null,
      });
      setHasDuration(Boolean(initialData.end_date));
    } else {
      setForm(EMPTY_FORM);
      setHasDuration(false);
    }

    setErrors({});
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.contract_category_id)
      newErrors.contract_category_id = "هذا الحقل مطلوب.";
    if (!form.number) newErrors.number = "يرجى إدخال رقم العقد.";
    if (!form.value) newErrors.value = "يرجى إدخال قيمة العقد.";
    if (!form.contract_parties)
      newErrors.contract_parties = "يرجى إدخال أطراف العقد.";
    if (!form.start_date) newErrors.start_date = "يرجى إدخال تاريخ البداية.";
    if (!form.summary) newErrors.summary = "يرجى كتابة ملخص للعقد.";
    if (hasDuration && !form.end_date)
      newErrors.end_date = "يرجى إدخال تاريخ الانتهاء.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attachment") {
      const file = files[0];
      if (file && file.type !== "application/pdf") {
        toast.error("📄 الملف يجب أن يكون بصيغة PDF فقط.");
        return;
      }
      setForm((prev) => ({ ...prev, attachment: file }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    // إزالة رسالة الخطأ عند التعديل
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.warning("⚠️ يرجى تعبئة الحقول الإلزامية.");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();

      Object.entries(form).forEach(([key, val]) => {
        if (key === "attachment" && val instanceof File) {
          payload.append("attachment", val);
        } else if (key !== "attachment" && key !== "oldAttachment" && val != null) {
          payload.append(key, val);
        }
      });

      if (form.id) {
        payload.append("_method", "PUT");
        await updateContract(form.id, payload);
        toast.success("✅ تم تعديل العقد بنجاح");
      } else {
        await createContract(payload);
        toast.success("✅ تم إضافة العقد بنجاح");
      }

      reloadContracts?.();
      onClose();
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      toast.error("❌ حدث خطأ أثناء حفظ العقد.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) =>
    `w-full p-2 border rounded-lg ${
      errors[name]
        ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30"
        : "border-gray-300 dark:border-zinc-700"
    }`;

  const errorText = (name) =>
    errors[name] ? <p className="text-xs text-red-600 mt-1">{errors[name]}</p> : null;

  return (
    <ModalCard
      isOpen={isOpen}
      title={initialData ? "تعديل العقد" : "إضافة عقد جديد"}
      loading={loading}
      onClose={onClose}
      onSubmit={handleSave}
      submitLabel={initialData ? "تحديث" : "إضافة"}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
        {/* التصنيف */}
        <div>
          <label className="block mb-1 text-sm">التصنيف</label>
          <select
            name="contract_category_id"
            value={form.contract_category_id}
            onChange={handleChange}
            className={inputClass("contract_category_id")}
            required
          >
            <option value="">اختر تصنيف</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errorText("contract_category_id")}
        </div>

        {/* النوع */}
        <div>
          <label className="block mb-1 text-sm">نوع العقد</label>
          <select
            name="scope"
            value={form.scope}
            onChange={handleChange}
            className={inputClass("scope")}
          >
            <option value="local">محلي</option>
            <option value="international">دولي</option>
          </select>
        </div>

        {/* الرقم */}
        <div>
          <label className="block mb-1 text-sm">رقم العقد</label>
          <input
            name="number"
            value={form.number}
            onChange={handleChange}
            className={inputClass("number")}
          />
          {errorText("number")}
        </div>

        {/* القيمة */}
        <div>
          <label className="block mb-1 text-sm">قيمة العقد</label>
          <input
            type="number"
            name="value"
            value={form.value}
            onChange={handleChange}
            className={inputClass("value")}
          />
          {errorText("value")}
        </div>

        {/* الأطراف */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">الأطراف المتعاقد معها</label>
          <textarea
            name="contract_parties"
            value={form.contract_parties}
            onChange={handleChange}
            rows={2}
            className={inputClass("contract_parties")}
          />
          {errorText("contract_parties")}
        </div>

        {/* البداية – النهاية */}
        <div>
          <label className="block mb-1 text-sm">
            {hasDuration ? "تاريخ بداية العقد" : "تاريخ العقد"}
          </label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className={inputClass("start_date")}
          />
          {errorText("start_date")}

          {hasDuration && (
            <div className="mt-2">
              <label className="block mb-1 text-sm">تاريخ النهاية</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className={inputClass("end_date")}
              />
              {errorText("end_date")}
            </div>
          )}
        </div>

        {/* هل للعقد مدة؟ */}
        <div>
          <label className="block mb-2 text-sm font-medium">هل للعقد مدة؟</label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="hasDuration"
                checked={hasDuration}
                onChange={() => setHasDuration(true)}
              />
              <span>نعم</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="hasDuration"
                checked={!hasDuration}
                onChange={() => setHasDuration(false)}
              />
              <span>لا</span>
            </label>
          </div>
        </div>

        {/* الحالة (فقط عند التعديل) */}
        {initialData && (
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm">الحالة</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass("status")}
            >
              <option value="active">ساري</option>
              <option value="expired">منتهي</option>
              <option value="terminated">مفسوخ</option>
              <option value="pending">قيد الانتظار</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        )}

        {/* الملخص */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">ملخص العقد</label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            rows={3}
            className={inputClass("summary")}
          />
          {errorText("summary")}
        </div>

        {/* الملاحظات */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">ملاحظات (اختياري)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            className={inputClass("notes")}
          />
        </div>

        {/* المرفقات */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">مرفق العقد (PDF فقط)</label>
          <input
            type="file"
            name="attachment"
            accept="application/pdf"
            onChange={handleChange}
            className={inputClass("attachment")}
          />

          {form.attachment ? (
            <p className="mt-1 text-sm text-green-600">
              {form.attachment.name}
            </p>
          ) : form.oldAttachment ? (
            <a
              href={`/storage/${form.oldAttachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-blue-600 underline"
            >
              عرض المرفق الحالي
            </a>
          ) : null}
        </div>
      </div>
    </ModalCard>
  );
}
