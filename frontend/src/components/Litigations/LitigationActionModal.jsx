import  { useState, useEffect } from "react";
import { toast } from "sonner"; 
export default function LitigationActionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  actionTypes = [],
}) {
  const [form, setForm] = useState({
    action_date: "",
    action_type_id: "",
    litigation_id: "",
    action_date: "",
    requirements: "",
    lawyer_name: "",
    notes: "",
    location: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);

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
    action_type_id: "",
    litigation_id: "",
    action_date: "",
    requirements: "",
    lawyer_name: "",
    notes: "",
    location: "",
    status: "",
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
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error("Error saving action:", error);
      toast.error("فشل في حفظ الإجراء");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] transform transition-all duration-300">
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-50 rounded-2xl">
            <div className="text-lg font-bold text-primary dark:text-yellow-400 animate-pulse">
              جاري الحفظ...
            </div>
          </div>
        )}

        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-6 rounded-full bg-green dark:bg-navy-dark p-4 text-center text-navy-light/90 dark:text-gold-light">
          {initialData ? "تعديل إجراء" : "إضافة إجراء"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-right">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Action Date */}
            <InputField
              label="تاريخ الإجراء"
              type="date"
              name="action_date"
              value={form.action_date}
              onChange={handleChange}
              required
            />

            {/* Action Type */}
            <SelectField
              label="نوع الإجراء"
              name="action_type_id"
              value={form.action_type_id}
              onChange={handleChange}
              options={actionTypes}
              required
            />

            <InputField
              label="اسم القائم بالإجراء"
              name="lawyer_name"
              value={form.lawyer_name}
              onChange={handleChange}
              placeholder="مثال: د. فاطمة"
              required
            />

            <InputField
              label="المطلوب"
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              placeholder="مثال: تقديم إفادة"
            />

            <InputField
              label="جهة الإجراء"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="مثال: الشهر العقاري"
            />

            <InputField
              label="ملاحظات"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="مثال: تقديم إفادة"
            />

            <InputField
              label="النتيجة"
              name="results"
              value={form.results}
              onChange={handleChange}
              placeholder="مثال: تم الاستماع للموظف"
            />

            {/* Status */}
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                الحالة
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="">اختر الحالة</option>
                <option value="pending">معلق</option>
                <option value="in_review">قيد المراجعة</option>
                <option value="done">منجز</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg ${
                initialData ? "bg-blue-600" : "bg-green-600"
              } text-white hover:opacity-90 font-bold transition`}
            >
              {loading ? "جاري الحفظ..." : initialData ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable input component
const InputField = ({ label, name, value, onChange, placeholder = "", type = "text", required = false }) => (
  <div>
    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
    />
  </div>
);

// Reusable select component
const SelectField = ({ label, name, value, onChange, options = [], required = false }) => (
  <div>
    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
    >
      <option value="" disabled>
        اختر نوع الإجراء
      </option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.action_name}
        </option>
      ))}
    </select>
  </div>
);