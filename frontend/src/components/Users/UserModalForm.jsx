import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import API_CONFIG from '@/config/config';

const roleTranslations = { 1: 'أدمن', 2: 'موظف', 3: 'مستخدم' };

const translateRoleToEnglish = (arabic) =>
  Object.keys(roleTranslations).find((k) => roleTranslations[k] === arabic) || '';

export default function UserModalForm({
  isOpen,
  onClose,
  selectedUser,
  refreshUsers,
  createUser,
  updateUser,
}) {
  const isEdit = !!selectedUser;

  const [formData, setFormData] = useState({
    name: '',
    role_id: '',
    emailPrefix: '',
    image: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit) {
      const [prefix] = selectedUser.email?.split('@') || [''];
      setFormData({
        name: selectedUser.name || '',
        role_id: selectedUser.roles?.[0]?.name || '',
        emailPrefix: prefix,
        image: selectedUser.image ? `${API_CONFIG.baseURL}/${selectedUser.image}` : null,
      });
    } else {
      setFormData({ name: '', role_id: '', emailPrefix: '', image: null });
    }

    setImageFile(null);
    setValidationErrors({});
    setIsSubmitting(false);
  }, [isOpen, selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = true;
    if (!formData.role_id) errors.role_id = true;
    if (!formData.emailPrefix) errors.emailPrefix = true;
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', `${formData.emailPrefix}@almadar.ly`);
      payload.append('roles[]', translateRoleToEnglish(formData.role_id));
      if (imageFile) payload.append('image', imageFile);

      if (isEdit) {
        await updateUser(selectedUser.id, payload);
        toast.success('✅ تم تعديل المستخدم');
      } else {
        await createUser(payload);
        toast.success('✅ تم إنشاء المستخدم');
      }

      await refreshUsers();
      onClose();
    } catch {
      toast.error('❌ فشل العملية، حاول مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          {isEdit ? 'تعديل المستخدم' : 'إضافة مستخدم'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          {/* الاسم */}
          <FormField
            label="اسم الموظف"
            icon={<User className="ml-2" />}
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={validationErrors.name}
            disabled={isSubmitting}
          />

          {/* الدور */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">الدور</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full p-2 rounded border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                validationErrors.role_id ? 'border-red-500' : 'border-gray-300 dark:border-zinc-600'
              }`}
            >
              <option value="">اختر الدور</option>
              {Object.values(roleTranslations).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {validationErrors.role_id && <p className="text-red-600 mt-1 text-xs">يرجى اختيار الدور</p>}
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
            <div className="flex rounded overflow-hidden border bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600">
              <input
                name="emailPrefix"
                value={formData.emailPrefix}
                onChange={handleChange}
                disabled={isSubmitting}
                className="flex-1 p-2 bg-transparent text-gray-900 dark:text-white"
              />
              <span className="p-2 bg-gray-100 dark:bg-zinc-700 text-gray-500 text-xs select-none">
                @almadar.ly
              </span>
            </div>
            {validationErrors.emailPrefix && (
              <p className="text-red-600 mt-1 text-xs">يرجى إدخال البريد الإلكتروني</p>
            )}
          </div>

          {/* الصورة */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">الصورة</label>
            <input
              type="file"
              accept="image/*"
              disabled={isSubmitting}
              onChange={handleFileChange}
              className="w-full text-sm text-gray-700 dark:text-gray-300"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="preview"
                className="w-24 h-24 mt-3 object-cover rounded shadow border"
              />
            )}
          </div>

          {/* الأزرار */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-800 dark:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white shadow"
            >
              {isSubmitting ? '...جاري الحفظ' : isEdit ? 'تحديث' : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, icon, name, value, onChange, error, disabled }) {
  return (
    <div>
      <label className="block mb-1 flex items-center font-medium text-gray-800 dark:text-gray-200">
        {icon} {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-2 rounded border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-zinc-600'
        }`}
      />
      {error && <p className="text-red-600 mt-1 text-xs">هذا الحقل مطلوب</p>}
    </div>
  );
}
  