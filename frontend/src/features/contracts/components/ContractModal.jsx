import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ModalCard from "@/components/common/ModalCard";
import { modalInput } from "@/components/common/modalStyles";
import { createContract, updateContract } from "@/services/api/contracts";
import { useLanguage } from "@/context/LanguageContext";
import { getRoleUsers } from "@/services/api/users";

const EMPTY_FORM = {
  id: null,
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
  assigned_to_user_id: "",
  attachment: null,
  oldAttachment: null,
};

export default function ContractModal({
  isOpen,
  onClose,
  initialData = null,
  categories = [],
  reloadContracts,
}) {
  const { translations } = useLanguage();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [hasDuration, setHasDuration] = useState(false);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // ✅ تهيئة الفورم عند فتح المودال أو تغيير initialData
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const hasEndDate = Boolean(initialData.end_date);

      setForm({
        id: initialData.id || null,
        contract_category_id: initialData.contract_category_id || "",
        scope: initialData.scope || "local",
        number: initialData.number || "",
        value: initialData.value != null ? initialData.value : "",
        contract_parties: initialData.contract_parties || "",
        start_date: initialData.start_date
          ? initialData.start_date.slice(0, 10)
          : "",
        end_date: initialData.end_date ? initialData.end_date.slice(0, 10) : "",
        notes: initialData.notes || "",
        status: initialData.status || "active",
        summary: initialData.summary || "",
        assigned_to_user_id:
          initialData.assigned_to_user_id ||
          initialData.assigned_to_user?.id ||
          "",
        attachment: null,
        oldAttachment: initialData.attachment || null,
      });

      setHasDuration(hasEndDate);
    } else {
      setForm(EMPTY_FORM);
      setHasDuration(false);
    }

    setErrors({});
  }, [isOpen, initialData]);

  // ✅ جلب Users (role=user فقط) مرة عند فتح المودال
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const res = await getRoleUsers("user");

        // يدعم: array أو {data: []}
        const list = Array.isArray(res) ? res : res?.data;
        if (mounted) setUsers(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        toast.error("❌ فشل تحميل قائمة المستخدمين");
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

  const validateForm = () => {
    const newErrors = {};

    if (!form.contract_category_id) newErrors.contract_category_id = "هذا الحقل مطلوب.";
    if (!form.number) newErrors.number = "يرجى إدخال رقم العقد.";

    if (!form.value) newErrors.value = "يرجى إدخال قيمة العقد.";
    else if (Number(form.value) <= 0) newErrors.value = "قيمة العقد يجب أن تكون أكبر من صفر.";

    if (!form.contract_parties) newErrors.contract_parties = "يرجى إدخال أطراف العقد.";
    if (!form.start_date) newErrors.start_date = "يرجى إدخال تاريخ البداية.";

    if (hasDuration && !form.end_date) newErrors.end_date = "يرجى إدخال تاريخ الانتهاء.";

    if (hasDuration && form.start_date && form.end_date && form.end_date < form.start_date) {
      newErrors.end_date = "تاريخ النهاية يجب أن يكون بعد أو مساوي لتاريخ البداية.";
    }

    if (!form.summary) newErrors.summary = "يرجى كتابة ملخص للعقد.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attachment") {
      const file = files?.[0];
      if (file && file.type !== "application/pdf") {
        toast.error("📄 الملف يجب أن يكون بصيغة PDF فقط.");
        return;
      }
      setForm((prev) => ({ ...prev, attachment: file }));
      setErrors((prev) => ({ ...prev, attachment: undefined }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDurationChange = (hasDurationValue) => {
    setHasDuration(hasDurationValue);

    if (!hasDurationValue) {
      setForm((prev) => ({ ...prev, end_date: "" }));
      setErrors((prev) => ({ ...prev, end_date: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.warning("⚠️ يرجى تعبئة الحقول الإلزامية بشكل صحيح.");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();

      Object.entries(form).forEach(([key, val]) => {
        if (key === "attachment") {
          if (val instanceof File) payload.append("attachment", val);
        } else if (key !== "oldAttachment" && val != null) {
          payload.append(key, val);
        }
      });

      if (form.id) {
        payload.append("_method", "PUT");
        await updateContract(form.id, payload);
        toast.success("✅ تم تعديل العقد بنجاح.");
      } else {
        await createContract(payload);
        toast.success("✅ تم إضافة العقد بنجاح.");
      }

      reloadContracts?.();
      onClose();
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      toast.error("❌ حدث خطأ أثناء حفظ العقد.");
    } finally {
      setLoading(false);
    }
  };

  const inputBaseClasses = `${modalInput} text-sm`;

  const inputClass = (name) =>
    `${inputBaseClasses} ${
      errors[name]
        ? "border-destructive focus:ring-destructive/40"
        : "focus:border-ring"
    }`;

  const errorText = (name) =>
    errors[name] ? (
      <p className="text-xs mt-1 text-red-600 dark:text-red-400">
        {errors[name]}
      </p>
    ) : null;

  return (
    <ModalCard
      isOpen={isOpen}
      title={initialData ? "تعديل العقد" : "إضافة عقد جديد"}
      loading={loading}
      onClose={onClose}
      onSubmit={handleSave}
      submitLabel={initialData ? "تحديث" : "إضافة"}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-xl p-4">
        {/* التصنيف */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            التصنيف <span className="text-red-500">*</span>
          </label>
          <select
            name="contract_category_id"
            value={form.contract_category_id}
            onChange={handleChange}
            className={inputClass("contract_category_id")}
            required
          >
            <option value="">اختر تصنيف</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errorText("contract_category_id")}
        </div>

        {/* النوع */}
        <div>
          <label className="block mb-1 text-sm font-medium">نوع العقد</label>
          <select
            name="scope"
            value={form.scope}
            onChange={handleChange}
            className={inputClass("scope")}
          >
            <option value="local">محلي</option>
            <option value="international">دولي</option>
          </select>
        </div>

        {/* الرقم */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            رقم العقد <span className="text-red-500">*</span>
          </label>
          <input
            name="number"
            value={form.number}
            onChange={handleChange}
            className={inputClass("number")}
          />
          {errorText("number")}
        </div>

        {/* القيمة */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            قيمة العقد <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="value"
            value={form.value}
            onChange={handleChange}
            className={inputClass("value")}
          />
          {errorText("value")}
        </div>

        {/* الأطراف */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium">
            الأطراف المتعاقد معها <span className="text-red-500">*</span>
          </label>
          <textarea
            name="contract_parties"
            value={form.contract_parties}
            onChange={handleChange}
            rows={2}
            className={inputClass("contract_parties")}
          />
          {errorText("contract_parties")}
        </div>

        {/* البداية – النهاية */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            {hasDuration ? "تاريخ بداية العقد" : "تاريخ العقد"}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className={inputClass("start_date")}
          />
          {errorText("start_date")}

          {hasDuration && (
            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium">
                تاريخ النهاية <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className={inputClass("end_date")}
              />
              {errorText("end_date")}
            </div>
          )}
        </div>

        {/* هل للعقد مدة؟ */}
        <div>
          <label className="block mb-2 text-sm font-medium">هل للعقد مدة؟</label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="hasDuration"
                checked={hasDuration}
                onChange={() => handleDurationChange(true)}
              />
              <span>نعم</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="hasDuration"
                checked={!hasDuration}
                onChange={() => handleDurationChange(false)}
              />
              <span>لا</span>
            </label>
          </div>
        </div>

        {/* الحالة (فقط عند التعديل) */}
        {initialData && (
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">الحالة</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass("status")}
            >
              <option value="active">ساري</option>
              <option value="expired">منتهي</option>
              <option value="terminated">مفسوخ</option>
              <option value="pending">قيد الانتظار</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        )} 
        {/* الملخص */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium">
            ملخص العقد <span className="text-red-500">*</span>
          </label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            rows={3}
            className={inputClass("summary")}
          />
          {errorText("summary")}
        </div>

        <div className="md:col-span-2">
  <label className="block mb-1 text-sm font-medium">
    المستخدم المسؤول
  </label>

  <select
    name="assigned_to_user_id"
    value={form.assigned_to_user_id || ""}
    onChange={handleChange}
    className={inputClass("assigned_to_user_id")}
  >
    <option value="">اختر المستخدم</option>

    {users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.name} {user.email ? `- ${user.email}` : ""}
      </option>
    ))}
  </select>
</div>


        {/* الملاحظات */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium">
            ملاحظات (اختياري)
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            className={inputClass("notes")}
          />
        </div>

        {/* المرفقات */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium">
            مرفق العقد (PDF فقط)
          </label>
          <input
            type="file"
            name="attachment"
            accept="application/pdf"
            onChange={handleChange}
            className={inputClass("attachment")}
          />

          {form.attachment ? (
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">
              {form.attachment.name}
            </p>
          ) : form.oldAttachment ? (
            <a
              href={`/storage/${form.oldAttachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-blue-600 dark:text-blue-400 underline"
            >
              عرض المرفق الحالي
            </a>
          ) : null}
        </div>
      </div>
    </ModalCard>
  );
}
