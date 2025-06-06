import { useEffect, useState } from "react";
import ModalCard from "../common/ModalCard";

const EMPTY_FORM = {
  id: null,
  action_date: "",
  action_type_id: "",
  officer_name: "",
  requirements: "",
  results: "",
  status: "pending",
};

export default function InvestigationActionModal({
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
    setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSubmit(form); // المسؤول عن التنبيهات
      onClose();
    } catch (error) {
      throw error; // يُترك للوالد التعامل مع الخطأ
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalCard
      isOpen={isOpen}
      onClose={onClose}
      title={form.id ? "تعديل إجراء" : "إضافة إجراء"}
      submitLabel={form.id ? "تحديث" : "إضافة"}
      onSubmit={handleSave}
      loading={loading}
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
            name="officer_name"
            value={form.officer_name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="مثال: أ. عبدالله"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">المتطلبات</label>
          <input
            type="text"
            name="requirements"
            value={form.requirements}
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
