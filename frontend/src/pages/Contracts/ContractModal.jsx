import { useState, useEffect } from "react";

export default function ContractModal({ isOpen, onClose, onSave,categories, initialData = null }) {
  const [form, setForm] = useState({
    contract_category_id: "",
    scope: "local",
    number: "",
    value: "",
    start_date: "",
    end_date: "",
    notes: "",
    status: "active",
    summary: "",
    attachment: null,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        attachment: null,
      });
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setForm({
      contract_category_id: "",
      scope: "local",
      number: "",
      value: "",
      start_date: "",
      end_date: "",
      notes: "",
      status: "active",
      summary: "",
      attachment: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment") {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-almadar-green dark:text-almadar-yellow">
          {initialData ? "تعديل العقد" : "إضافة عقد جديد"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                التصنيف
              </label>
              <select
                name="contract_category_id"
                value={form.contract_category_id}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="">اختر تصنيف</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                نوع العقد
              </label>
              <select
                name="scope"
                value={form.scope}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="local">محلي</option>
                <option value="international">دولي</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                رقم العقد
              </label>
              <input
                type="text"
                name="number"
                value={form.number}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                قيمة العقد
              </label>
              <input
                type="number"
                name="value"
                value={form.value}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                تاريخ البداية
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                تاريخ النهاية
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              الحالة
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="active">ساري</option>
              <option value="expired">منتهي</option>
              <option value="terminated">مفسوخ</option>
              <option value="pending">قيد الانتظار</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              الملاحظات
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              ملخص العقد
            </label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              مرفق العقد (PDF)
            </label>
            <input
              type="file"
              name="attachment"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-almadar-green hover:bg-emerald-700 dark:bg-almadar-yellow dark:hover:bg-yellow-400 text-white dark:text-black font-bold"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
