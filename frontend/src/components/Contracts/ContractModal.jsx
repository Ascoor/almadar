import React, { useState, useEffect } from "react"; 
import { createContract, updateContract } from "../../services/api/contracts";
 import { toast } from 'sonner';

export default function ContractModal({ isOpen, onClose, initialData = null, categories = [], reloadContracts }) {
  const [form, setForm] = useState({
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
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm({
        id: initialData.id,
        contract_category_id: initialData.contract_category_id || "",
        scope: initialData.scope || "local",
        number: initialData.number || "",
        contract_parties: initialData.contract_parties || "",
        value: initialData.value || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
        notes: initialData.notes || "",
        status: initialData.status || "active",
        summary: initialData.summary || "",
        attachment: null,
        oldAttachment: initialData.attachment,
      });
    } else {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setForm({
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
      setForm(prev => ({ ...prev, attachment: file }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.attachment && !form.oldAttachment) {
      toast.error("يجب رفع مرفق PDF أو الإبقاء على الملف القديم.");
      return;
    }
    try {
      setLoading(true);
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "attachment" && value instanceof File) {
          payload.append("attachment", value);
        } else if (key !== "attachment" && key !== "oldAttachment" && value) {
          payload.append(key, value);
        }
      });
      if (form.id) {
        payload.append("_method", "PUT");
        await updateContract(form.id, payload);
        toast.success("تم تعديل العقد بنجاح 🎉");
      } else {
        await createContract(payload);
        toast.success("تم إضافة العقد بنجاح 🎉");
      }
      if (reloadContracts) reloadContracts();
      onClose();
      resetForm();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error("حدث خطأ أثناء حفظ العقد. تحقق من البيانات المدخلة.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-royal-dark  rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative transform-gpu">
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-50">
            <div className="text-lg font-bold text-blue-400 dark:text-gold animate-pulse">
              جاري الحفظ...
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 rounded-full bg-green dark:bg-navy-dark p-4 text-center text-navy-light/90  dark:text-gold-light">
          {initialData ? "تعديل العقد" : "إضافة عقد جديد"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-right">
          {/* التصنيف */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">التصنيف</label>
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

          {/* نوع العقد */}
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

          {/* رقم العقد */}
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

          {/* قيمة العقد */}
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

          {/* تواريخ البداية والنهاية */}
          <div className="grid grid-cols-2 gap-4">
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

          {/* حالة العقد */}
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

          {/* الملاحظات */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              الأطراف المتعاقد معها
            </label>
            <textarea
              name="contract_parties"
              value={form.contract_parties}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            ></textarea>
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

          {/* ملخص العقد */}
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

          {/* مرفق العقد */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              مرفق العقد (PDF فقط)
            </label>
            <input
              type="file"
              name="attachment"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
            {form.attachment ? (
              <div className="mt-2 text-blue-600 text-sm">{form.attachment.name}</div>
            ) : form.oldAttachment ? (
              <a
                href={`/storage/${form.oldAttachment}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-blue-500 text-sm block underline"
              >
                عرض المرفق الحالي
              </a>
            ) : null}
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-royal hover:bg-royal-dark dark:bg-yellow-400 text-white dark:text-black font-bold"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
