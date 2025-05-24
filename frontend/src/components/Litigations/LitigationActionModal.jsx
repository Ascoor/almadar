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

  // Handle the opening of the modal and the initialization of the form
  useEffect(() => {
    if (!isOpen) return; // Only reset if the modal is opened
    if (initialData) {
      setForm({ ...EMPTY_FORM, ...initialData }); // If editing, fill in form with initial data
    } else {
      setForm(EMPTY_FORM); // If creating new, reset the form
    }
  }, [isOpen, initialData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save action (create or update)
  const handleSave = async () => {
    setLoading(true);
    try {
      await onSubmit(form); // Call onSubmit with form data
      onClose(); // Close the modal after saving
    } catch (err) {
      toast.error("فشل في حفظ الإجراء");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; // Don't render if the modal is not open

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
        {/* Action Date */}
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

        {/* Action Type */}
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

        {/* Lawyer Name */}
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

        {/* Requirements */}
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

        {/* Location */}
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

        {/* Results */}
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

        {/* Notes */}
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

        {/* Status */}
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
