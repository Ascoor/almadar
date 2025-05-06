import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createContract, updateContract } from "../../services/api/contracts";
import API_CONFIG from "../../config/config";

const ContractsModal = ({ isOpen, onClose, initialData = null, categories = [], reloadContracts }) => {
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
    if (isOpen && initialData) {
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
  }, [isOpen, initialData]);

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

    if (!form.contract_category_id || !form.scope || !form.number || !form.contract_parties || !form.status) {
      toast.error("الرجاء ملء جميع الحقول الإلزامية.");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("contract_category_id", form.contract_category_id);
      payload.append("scope", form.scope);
      payload.append("contract_parties", form.contract_parties);
      payload.append("number", form.number);
      payload.append("value", form.value || "");
      payload.append("start_date", form.start_date || "");
      payload.append("end_date", form.end_date || "");
      payload.append("notes", form.notes || "");
      payload.append("status", form.status);
      payload.append("summary", form.summary || "");

      if (form.attachment instanceof File) {
        payload.append("attachment", form.attachment);
      }

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
      toast.error("حدث خطأ أثناء حفظ العقد. تحقق من البيانات.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-50">
            <div className="text-lg font-bold text-almadar-blue dark:text-almadar-yellow animate-pulse">
              جاري الحفظ...
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-almadar-blue dark:text-almadar-yellow">
          {initialData ? "تعديل العقد" : "إضافة عقد جديد"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">فئة العقد</label>
              <select
                name="contract_category_id"
                value={form.contract_category_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="">اختر فئة العقد</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">النطاق</label>
              <select
                name="scope"
                value={form.scope}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="local">محلي</option>
                <option value="international">دولي</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">رقم العقد</label>
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
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">الأطراف المتعاقدة</label>
              <input
                type="text"
                name="contract_parties"
                value={form.contract_parties}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">قيمة العقد</label>
              <input
                type="text"
                name="value"
                value={form.value}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">تاريخ البدء</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">تاريخ الانتهاء</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">ملاحظات</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">ملخص العقد</label>
              <textarea
                name="summary"
                value={form.summary}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">المرفق PDF</label>
              <input
                type="file"
                name="attachment"
                accept="application/pdf"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
              {form.attachment ? (
                <div className="mt-1 text-green-600 text-sm">{form.attachment.name}</div>
              ) : form.oldAttachment ? (
                <a
                  href={`${API_CONFIG.baseURL}/storage/${form.oldAttachment}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-blue-500 text-sm underline block"
                >
                  عرض المرفق الحالي
                </a>
              ) : null}
            </div>
          </div>

          {/* Buttons */}
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
              className="px-6 py-2 rounded-lg bg-almadar-blue hover:bg-emerald-700 dark:bg-almadar-yellow text-white dark:text-black font-bold"
            >
              {loading ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractsModal;
