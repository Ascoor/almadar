// components/ContractModal.jsx
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
  const [loading, setLoading] = useState(false);

  // initialize form when opening
  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm({
        ...EMPTY_FORM,
        ...initialData,
        oldAttachment: initialData.attachment,
        start_date: initialData.start_date?.slice(0, 10) || "",
        end_date: initialData.end_date?.slice(0, 10) || "",
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
      setForm((f) => ({ ...f, attachment: file }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }; 
   const handleSave = async () => {
    // validation
 
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
        {/* Category */}
        <div>
          <label className="block mb-1 text-sm">التصنيف</label>
          <select
            name="contract_category_id"
            value={form.contract_category_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="">اختر تصنيف</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Scope */}
        <div>
          <label className="block mb-1 text-sm">نوع العقد</label>
          <select
            name="scope"
            value={form.scope}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="local">محلي</option>
            <option value="international">دولي</option>
          </select>
        </div>

        {/* Number */}
        <div>
          <label className="block mb-1 text-sm">رقم العقد</label>
          <input
            name="number"
            value={form.number}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Value */}
        <div>
          <label className="block mb-1 text-sm">قيمة العقد</label>
          <input
            type="number"
            name="value"
            value={form.value}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Parties */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">الأطراف المتعاقد معها</label>
          <textarea
            name="contract_parties"
            value={form.contract_parties}
            onChange={handleChange}
            rows={2}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Dates */}
        <div>
          <label className="block mb-1 text-sm">تاريخ البداية</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">تاريخ النهاية</label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Status */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">الحالة</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="active">ساري</option>
            <option value="expired">منتهي</option>
            <option value="terminated">مفسوخ</option>
            <option value="pending">قيد الانتظار</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">ملاحظات</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Summary */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">ملخص العقد</label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Attachment */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">مرفق العقد (PDF فقط)</label>
          <input
            type="file"
            name="attachment"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
          {form.attachment ? (
            <p className="mt-1 text-sm text-green-600">{form.attachment.name}</p>
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
