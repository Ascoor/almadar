import { useEffect, useState } from "react";
import ModalCard from "@/components/common/ModalCard";
import { modalInput, modalLabel, modalHelperText } from "@/components/common/modalStyles";

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

  const isEdit = !!form.id;

  useEffect(() => {
    if (!isOpen) return;

    // عند الفتح، إمّا نملأ البيانات القديمة أو نبدأ فورم جديد
    setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // تحقق بسيط قبل الإرسال
    if (!form.action_date || !form.action_type_id || !form.officer_name) {
      // يفضّل تخلي التوست من الأب لو تحب، لكن على الأقل ما نحاول نحفظ فورم ناقص
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form); // الأب مسؤول عن الحفظ + التوست
      onClose();
    } catch (error) {
      // الأب عنده try/catch، فمجرد إعادة الرمي هنا لو حاب
      console.error("InvestigationActionModal Save Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalCard
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "editAction" : "addAction"}
      submitLabel={isEdit ? "update" : "add"}
      onSubmit={handleSave}
      loading={loading}
    >
      <form
        dir="rtl"
        className="grid grid-cols-1 gap-4 text-right md:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* تاريخ الإجراء */}
        <div className="space-y-1">
          <label className={modalLabel}>
            تاريخ الإجراء
          </label>
          <input
            type="date"
            name="action_date"
            value={form.action_date}
            onChange={handleChange}
            className={`${modalInput} text-sm`}
            required
          />
        </div>

        {/* نوع الإجراء */}
        <div className="space-y-1">
          <label className={modalLabel}>
            نوع الإجراء
          </label>
          <select
            name="action_type_id"
            value={form.action_type_id}
            onChange={handleChange}
            className={`${modalInput} text-sm`}
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

        {/* اسم القائم بالإجراء */}
        <div className="space-y-1">
          <label className={modalLabel}>
            اسم القائم بالإجراء
          </label>
          <input
            type="text"
            name="officer_name"
            value={form.officer_name}
            onChange={handleChange}
            className={`${modalInput} text-sm`}
            placeholder="مثال: أ. عبدالله سالم"
            required
          />
          <p className={`${modalHelperText} text-[0.78rem]`}>
            اكتب اسم المحامي أو المستشار المسؤول عن هذا الإجراء.
          </p>
        </div>

        {/* المتطلبات */}
        <div className="space-y-1">
          <label className={modalLabel}>
            المتطلبات
          </label>
          <input
            type="text"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            className={`${modalInput} text-sm`}
            placeholder="مثال: مستندات إضافية، شهود، تقارير..."
          />
        </div>

        {/* النتيجة */}
        <div className="space-y-1 md:col-span-2">
          <label className={modalLabel}>
            النتيجة
          </label>
          <input
            type="text"
            name="results"
            value={form.results}
            onChange={handleChange}
            className={`${modalInput} text-sm`}
            placeholder="مثال: تم التنفيذ، جاري المتابعة، ملاحظات إضافية..."
          />
        </div>

        {/* الحالة */}
        <div className="space-y-1">
          <label className={modalLabel}>
            الحالة
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={`${modalInput} text-sm`}
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
