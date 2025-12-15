import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ModalCard from "@/components/common/ModalCard";
import { modalInput, modalLabel } from "@/components/common/modalStyles";
import { getRoleLegalInvestigators } from "@/services/api/users";

const EMPTY_FORM = {
  employee_name: "",
  source: "",
  subject: "",
  case_number: "",
  status: "open",
  notes: "",
  assigned_to_user_id: "",
};

export default function InvestigationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [errors, setErrors] = useState({});

  // ✅ تهيئة الفورم
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        ...EMPTY_FORM,
        ...initialData,
        assigned_to_user_id:
          initialData.assigned_to_user_id || initialData.assigned_to_user?.id || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setErrors({});
  }, [isOpen, initialData]);

  // ✅ جلب legal investigators فقط
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const list = await getRoleLegalInvestigators();
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
    if (!form.employee_name) e.employee_name = "هذا الحقل مطلوب";
    if (!form.subject) e.subject = "هذا الحقل مطلوب";
    if (!form.assigned_to_user_id) e.assigned_to_user_id = "اختر المستخدم المسؤول";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFormSubmit = async () => {
    if (!validate()) {
      toast.warning("⚠️ يرجى تعبئة الحقول الإلزامية.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error("❌ Error saving investigation:", error);
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
      title={initialData ? "تعديل تحقيق" : "إضافة تحقيق"}
      onClose={onClose}
      onSubmit={handleFormSubmit}
      loading={loading}
    >
      <div className="space-y-6" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* اسم الموظف */}
          <div className="space-y-1">
            <label className={modalLabel}>اسم الموظف</label>
            <input
              name="employee_name"
              value={form.employee_name || ""}
              onChange={handleChange}
              className={inputClass("employee_name")}
            />
            {errors.employee_name && (
              <p className="text-xs text-red-600">{errors.employee_name}</p>
            )}
          </div>

          {/* المصدر */}
          <div className="space-y-1">
            <label className={modalLabel}>المصدر</label>
            <input
              name="source"
              value={form.source || ""}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          {/* الموضوع */}
          <div className="space-y-1">
            <label className={modalLabel}>الموضوع</label>
            <input
              name="subject"
              value={form.subject || ""}
              onChange={handleChange}
              className={inputClass("subject")}
            />
            {errors.subject && (
              <p className="text-xs text-red-600">{errors.subject}</p>
            )}
          </div>

          {/* رقم القضية */}
          <div className="space-y-1">
            <label className={modalLabel}>رقم القضية</label>
            <input
              name="case_number"
              value={form.case_number || ""}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          {/* الحالة */}
          <div className="space-y-1">
            <label className={modalLabel}>الحالة</label>
            <select
              name="status"
              value={form.status || "open"}
              onChange={handleChange}
              className={modalInput}
            >
              <option value="open">مفتوح</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="closed">مغلق</option>
            </select>
          </div>

          {/* المسؤول */}
          <div className="md:col-span-2 space-y-1">
            <label className={modalLabel}>المستخدم المسؤول (محقق قانوني)</label>
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

          {/* ملاحظات */}
          <div className="space-y-1 md:col-span-2">
            <label className={modalLabel}>ملاحظات</label>
            <textarea
              name="notes"
              rows={2}
              value={form.notes || ""}
              onChange={handleChange}
              className={`${modalInput} min-h-[110px]`}
            />
          </div>
        </div>
      </div>
    </ModalCard>
  );
}
