import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ModalCard from "@/components/common/ModalCard";
import {
  modalInput,
  modalLabel,
  modalHelperText,
} from "@/components/common/modalStyles";
import { getRoleLegalInvestigators } from "@/services/api/users";

const EMPTY_FORM = {
  id: null,
  action_date: "",
  action_type_id: "",
  officer_name: "",
  requirements: "",
  results: "",
  status: "pending",
  assigned_to_user_id: "",
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

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const isEdit = !!form.id;

  // ✅ تهيئة الفورم
  useEffect(() => {
    if (!isOpen) return;

    setForm(
      initialData
        ? {
            ...EMPTY_FORM,
            ...initialData,
            assigned_to_user_id:
              initialData.assigned_to_user_id ||
              initialData.assigned_to_user?.id ||
              "",
          }
        : EMPTY_FORM
    );

    setErrors({});
  }, [isOpen, initialData]);

  // ✅ جلب legal investigators فقط
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const list = await getRoleLegalInvestigators(); // role = legal_investigator
        if (mounted) setUsers(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        toast.error("❌ فشل تحميل قائمة المحققين القانونيين");
        if (mounted) setUsers([]);
      } finally {
        if (mounted) setUsersLoading(false);
      }
    };

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const inputBaseClasses = `${modalInput} text-sm`;
  const inputClass = (name) =>
    `${inputBaseClasses} ${
      errors[name]
        ? "border-destructive focus:ring-destructive/40"
        : "focus:border-ring"
    }`;

  const validate = () => {
    const e = {};
    if (!form.action_date) e.action_date = "هذا الحقل مطلوب";
    if (!form.action_type_id) e.action_type_id = "هذا الحقل مطلوب";
    if (!form.officer_name) e.officer_name = "هذا الحقل مطلوب";
    if (!form.assigned_to_user_id) e.assigned_to_user_id = "اختر المستخدم المسؤول";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.warning("⚠️ يرجى تعبئة الحقول الإلزامية.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error("InvestigationActionModal Save Error:", error);
      toast.error("❌ حدث خطأ أثناء الحفظ");
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
      title={isEdit ? "تعديل إجراء تحقيق" : "إضافة إجراء تحقيق"}
      submitLabel={isEdit ? "تحديث" : "إضافة"}
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
          <label className={modalLabel}>تاريخ الإجراء</label>
          <input
            type="date"
            name="action_date"
            value={form.action_date || ""}
            onChange={handleChange}
            className={inputClass("action_date")}
          />
          {errors.action_date && (
            <p className="text-xs text-red-600">{errors.action_date}</p>
          )}
        </div>

        {/* نوع الإجراء */}
        <div className="space-y-1">
          <label className={modalLabel}>نوع الإجراء</label>
          <select
            name="action_type_id"
            value={form.action_type_id || ""}
            onChange={handleChange}
            className={inputClass("action_type_id")}
          >
            <option value="">اختر النوع</option>
            {actionTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.action_name}
              </option>
            ))}
          </select>
          {errors.action_type_id && (
            <p className="text-xs text-red-600">{errors.action_type_id}</p>
          )}
        </div>

        {/* اسم القائم بالإجراء */}
        <div className="space-y-1">
          <label className={modalLabel}>اسم القائم بالإجراء</label>
          <input
            type="text"
            name="officer_name"
            value={form.officer_name || ""}
            onChange={handleChange}
            className={inputClass("officer_name")}
            placeholder="مثال: أ. عبدالله سالم"
          />
          <p className={`${modalHelperText} text-[0.78rem]`}>
            اكتب اسم المحامي أو المستشار المسؤول عن هذا الإجراء.
          </p>
          {errors.officer_name && (
            <p className="text-xs text-red-600">{errors.officer_name}</p>
          )}
        </div>

        {/* المتطلبات */}
        <div className="space-y-1">
          <label className={modalLabel}>المتطلبات</label>
          <input
            type="text"
            name="requirements"
            value={form.requirements || ""}
            onChange={handleChange}
            className={modalInput}
            placeholder="مثال: مستندات إضافية، شهود، تقارير..."
          />
        </div>

        {/* النتيجة */}
        <div className="space-y-1 md:col-span-2">
          <label className={modalLabel}>النتيجة</label>
          <input
            type="text"
            name="results"
            value={form.results || ""}
            onChange={handleChange}
            className={modalInput}
            placeholder="مثال: تم التنفيذ، جاري المتابعة..."
          />
        </div>

        {/* المسؤول */}
        <div className="md:col-span-2 space-y-1">
          <label className={modalLabel}>القائم بالإجراء</label>
          <select
            name="assigned_to_user_id"
            value={form.assigned_to_user_id || ""}
            onChange={handleChange}
            className={inputClass("assigned_to_user_id")}
            disabled={usersLoading}
          >
            <option value="">
              {usersLoading ? "جاري تحميل القائمة..." : "اختر المستخدم"}
            </option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} {u.email ? `- ${u.email}` : ""}
              </option>
            ))}
          </select>
          {errors.assigned_to_user_id && (
            <p className="text-xs text-red-600">{errors.assigned_to_user_id}</p>
          )}
        </div>

        {/* الحالة */}
        <div className="space-y-1">
          <label className={modalLabel}>الحالة</label>
          <select
            name="status"
            value={form.status || "pending"}
            onChange={handleChange}
            className={modalInput}
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
