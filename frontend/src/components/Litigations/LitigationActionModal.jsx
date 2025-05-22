import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ModalCard from "../common/ModalCard";

const EMPTY_FORM = {
  id: null,
  action_date: "",
  action_type_id: "",
  lawyer_name: "",
  requirements: "",
  location: "",
  notes: "",
  results: "",
  status: "pending",
};

export default function LitigationActionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  actionTypes = [],
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm({ ...EMPTY_FORM, ...initialData });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      toast.error("فشل في حفظ الإجراء");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalCard
      isOpen={isOpen}
      title={form.id ? "تعديل إجراء" : "إضافة إجراء"}
      onClose={onClose}
      onSubmit={handleSave}
      loading={loading}
      submitLabel={form.id ? "تحديث" : "إضافة"}
    >
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
        <div>
          <label className="block mb-1 text-sm">تاريخ الإجراء</label>
          <input
            type="date"
            name="action_date"
            value={form.action_date}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">نوع الإجراء</label>
          <select
            name="action_type_id"
            value={form.action_type_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">اختر النوع</option>
            {actionTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.action_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">اسم القائم بالإجراء</label>
          <input
            type="text"
            name="lawyer_name"
            value={form.lawyer_name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="مثال: د. فاطمة"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">المطلوب</label>
          <input
            type="text"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">جهة الإجراء</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">النتيجة</label>
          <input
            type="text"
            name="results"
            value={form.results}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">ملاحظات</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            rows={2}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">الحالة</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="pending">معلق</option>
            <option value="in_review">قيد المراجعة</option>
            <option value="done">منجز</option>
          </select>
        </div>
      </form>
    </ModalCard>
  );
}
