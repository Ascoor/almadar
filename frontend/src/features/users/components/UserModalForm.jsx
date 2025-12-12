import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import API_CONFIG from '@/config/config';
import { getRoles } from '@/services/api/users';
import {
  modalOverlay,
  modalContainer,
  modalInput,
  modalCancelButton,
  modalPrimaryButton,
  modalLabel,
} from '@/components/common/modalStyles';

const roleLabels = {
  admin: 'أدمن',
  staff: 'موظف',
  user: 'مستخدم',
};

const translateToArabic = (role) => roleLabels[role] || role;

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
    role: '',
    emailPrefix: '',
    image: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      initializeForm();
    }
  }, [isOpen, selectedUser]);

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      const rolesArray = Array.isArray(res) ? res : res.roles || [];
      setAvailableRoles(rolesArray);
    } catch (err) {
      console.error(err);
      toast.error('فشل تحميل الأدوار');
    }
  };

  const initializeForm = () => {
    if (isEdit) {
      const [prefix] = selectedUser.email?.split('@') || [''];
      const roleName = selectedUser.roles?.[0]?.name || '';
      setFormData({
        name: selectedUser.name || '',
        role: roleName, // استخدم اسم الدور الحقيقي
        emailPrefix: prefix,
        image: selectedUser.image ? `${API_CONFIG.baseURL}/${selectedUser.image}` : null,
      });
    } else {
      setFormData({ name: '', role: '', emailPrefix: '', image: null });
    }

    setImageFile(null);
    setValidationErrors({});
    setIsSubmitting(false);
  };

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
    if (!formData.role) errors.role = true;
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
      payload.append('roles[]', formData.role); // 👈 اسم الدور الفعلي من الـ API
      if (imageFile) payload.append('image', imageFile);

      if (isEdit) {
        await updateUser(selectedUser.id, payload);
  
      } else {
        await createUser(payload);
 
      }

      await refreshUsers();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('❌ فشل العملية، تحقق من الحقول أو الدور');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={modalOverlay}>
      <div className={`${modalContainer} max-w-lg`}>
        <h2 className="text-xl font-bold text-center mb-6 text-primary drop-shadow-sm">
          {isEdit ? 'تعديل المستخدم' : 'إضافة مستخدم'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <FormField
            label="اسم الموظف"
            icon={<User className="ml-2" />}
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={validationErrors.name}
            disabled={isSubmitting}
          />

          <div>
            <label className={modalLabel}>الدور</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`${modalInput} ${validationErrors.role ? 'border-destructive focus:ring-destructive/50' : ''}`}
            >
              <option value="">اختر الدور</option>
              {availableRoles.map((r) => (
                <option key={r.name} value={r.name}>
                  {translateToArabic(r.name)}
                </option>
              ))}
            </select>
            {validationErrors.role && (
              <p className="text-red-600 mt-1 text-xs">يرجى اختيار الدور</p>
            )}
          </div>

          <div>
            <label className={modalLabel}>البريد الإلكتروني</label>
            <div className="flex overflow-hidden rounded-xl border border-border/90 bg-[color:var(--card)] shadow-md focus-within:ring-2 focus-within:ring-ring">
              <input
                name="emailPrefix"
                value={formData.emailPrefix}
                onChange={handleChange}
                disabled={isSubmitting}
                className="flex-1 bg-transparent p-2.5 text-fg placeholder:text-muted-foreground/80 focus:outline-none"
              />
              <span className="p-2.5 bg-muted text-xs select-none text-fg">@almadar.ly</span>
            </div>
            {validationErrors.emailPrefix && (
              <p className="text-red-600 mt-1 text-xs">يرجى إدخال البريد الإلكتروني</p>
            )}
          </div>

          <div>
            <label className={modalLabel}>الصورة</label>
            <input
              type="file"
              accept="image/*"
              disabled={isSubmitting}
              onChange={handleFileChange}
              className={`${modalInput} text-sm`}
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="preview"
                className="w-24 h-24 mt-3 object-cover rounded shadow border"
              />
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={modalCancelButton}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={modalPrimaryButton}
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
      <label className={`${modalLabel} flex items-center gap-2`}>
        {icon} {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${modalInput} ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-red-600 mt-1 text-xs">هذا الحقل مطلوب</p>}
    </div>
  );
}
