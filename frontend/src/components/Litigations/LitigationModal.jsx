import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createLitigation, updateLitigation } from "../../services/api/litigations";
import API_CONFIG from "../../config/config";

const LitigationModal = ({ isOpen, onClose, initialData = null, reloadLitigations }) => {
  const [form, setForm] = useState({
    case_number: "",
    court: "",
    case_name: "",
    case_type: "",
    status: "pending",
    notes: "",
    hearing_date: "",
    attachment: null,
    oldAttachment: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        id: initialData.id,
        case_number: initialData.case_number || "",
        court: initialData.court || "",
        case_name: initialData.case_name || "",
        case_type: initialData.case_type || "",
        status: initialData.status || "pending",
        notes: initialData.notes || "",
        hearing_date: initialData.hearing_date || "",
        attachment: null,
        oldAttachment: initialData.attachment,
      });
    } else {
      resetForm();
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setForm({
      case_number: "",
      court: "",
      case_name: "",
      case_type: "",
      status: "pending",
      notes: "",
      hearing_date: "",
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

    if (!form.case_number || !form.court || !form.case_name || !form.case_type || !form.status) {
      toast.error("الرجاء ملء جميع الحقول الإلزامية.");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("case_number", form.case_number);
      payload.append("court", form.court);
      payload.append("case_name", form.case_name);
      payload.append("case_type", form.case_type);
      payload.append("status", form.status);
      payload.append("notes", form.notes || "");
      payload.append("hearing_date", form.hearing_date || "");

      if (form.attachment instanceof File) {
        payload.append("attachment", form.attachment);
      }

      if (form.id) {
        payload.append("_method", "PUT");
        await updateLitigation(form.id, payload);
        toast.success("تم تعديل الدعوى بنجاح 🎉");
      } else {
        await createLitigation(payload);
        toast.success("تم إضافة الدعوى بنجاح 🎉");
      }

      if (reloadLitigations) reloadLitigations();
      onClose();
      resetForm();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error("حدث خطأ أثناء حفظ الدعوى. تحقق من البيانات.");
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
          {initialData ? "تعديل الدعوى" : "إضافة دعوى جديدة"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">رقم الدعوى</label>
              <input
                type="text"
                name="case_number"
                value={form.case_number}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">المحكمة</label>
              <input
                type="text"
                name="court"
                value={form.court}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">اسم الدعوى</label>
              <input
                type="text"
                name="case_name"
                value={form.case_name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">نوع الدعوى</label>
              <input
                type="text"
                name="case_type"
                value={form.case_type}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">حالة الدعوى</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="pending">قيد الانتظار</option>
                <option value="ongoing">جارية</option>
                <option value="closed">مغلقة</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">تاريخ الجلسة</label>
              <input
                type="date"
                name="hearing_date"
                value={form.hearing_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">ملاحظات</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          {/* PDF Attachment */}
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">مرفق PDF</label>
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
                href={`${API_CONFIG.BASE_URL}/litigations/${form.id}/attachment`}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-1 text-blue-600 underline text-sm"
              >
                تحميل المرفق الحالي
              </a>
            ) : null}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-almadar-blue dark:bg-almadar-yellow text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              {initialData ? "حفظ التعديلات" : "إضافة الدعوى"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LitigationModal;
