import React, { useState, useEffect, useContext } from 'react';
import { Phone, User } from 'lucide-react';
import { AuthContext } from '@/components/auth/AuthContext';
import API_CONFIG from '@/config/config';

const roleTranslations = { 1: 'أدمن', 2: 'موظف', 3: 'مستخدم' };

const translateRoleToEnglish = (arabic) =>
  Object.keys(roleTranslations).find((k) => roleTranslations[k] === arabic) || '';

export default function UserModalForm({
  isOpen,
  onClose,
  selectedUser,
  refreshUsers,
  createUser,  // passed as a prop
  updateUser,  // passed as a prop
}) {
  // Initialize the formData state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role_id: '',
    emailPrefix: '',
    image: null,
  });

  const [imageFile, setImageFile] = useState(null);  // For the uploaded image
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (selectedUser) {
      // Load user data into the form
      const [emailPrefix] = selectedUser.email?.split('@') || [''];
      setFormData({
        name: selectedUser.name || '',
        phone: selectedUser.phone || '',
        role: selectedUser.role?.name || '',
        emailPrefix,
        image: selectedUser.image ? API_CONFIG.baseURL + selectedUser.image : null,
      });
      setImageFile(null);
    } else {
      // Reset to blank state when adding new user
      setFormData({
        name: '',
        phone: '',
        role_id: '',
        emailPrefix: '',
        image: null,
      });
      setImageFile(null);
    }
    setValidationErrors({});
    setIsSubmitting(false);
  }, [isOpen, selectedUser]);

  // Handle changes to form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection for image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors({});

    if (!formData.name || !formData.phone || !formData.role || !formData.emailPrefix) {
      setValidationErrors({
        name: !formData.name,
        phone: !formData.phone,
        role: !formData.role_id,
        emailPrefix: !formData.emailPrefix,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('phone', formData.phone);
      payload.append('role', translateRoleToEnglish(formData.role_id ));
      payload.append('email', `${formData.emailPrefix}@hadathah.org`);
      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (selectedUser && selectedUser.id) {
        await updateUser(selectedUser.id, payload);
      } else {
        await createUser(payload);
      }

      refreshUsers();
      onClose();
    } catch (error) {
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
      } else {
        alert('حدث خطأ أثناء حفظ المستخدم.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-6 text-center">
          {selectedUser ? 'تعديل المستخدم' : 'إضافة مستخدم'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block mb-1 flex items-center">
              <User className="ml-2" /> إسم الموظف
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                validationErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {validationErrors.name && (
              <p className="text-red-600 mt-1 text-sm">يرجى إدخال الاسم</p>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <label className="block mb-1 flex items-center">
              <Phone className="ml-2" /> رقم الهاتف
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                validationErrors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {validationErrors.phone && (
              <p className="text-red-600 mt-1 text-sm">يرجى إدخال رقم الهاتف</p>
            )}
          </div>

          {/* Role Select */}
          <div>
            <label className="block mb-1">الدور</label>
            <select
              name="role"
              value={formData.role_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                validationErrors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">اختر الدور</option>
              {Object.values(roleTranslations).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {validationErrors.role && (
              <p className="text-red-600 mt-1 text-sm">يرجى اختيار الدور</p>
            )}
          </div>

          {/* Email Prefix */}
          <div>
            <label className="block mb-1">البريد الإلكتروني</label>
            <div className="flex">
              <input
                name="emailPrefix"
                value={formData.emailPrefix}
                onChange={handleChange}
                className={`flex-1 p-2 border rounded-l ${
                  validationErrors.emailPrefix ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              <span className="p-2 border rounded-r bg-gray-200 dark:bg-gray-700 select-none">
                @hadathah.org
              </span>
            </div>
            {validationErrors.emailPrefix && (
              <p className="text-red-600 mt-1 text-sm">يرجى إدخال البريد الإلكتروني</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1">الصورة</label>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="w-full"
              accept="image/*"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="preview"
                className="w-24 h-24 mt-2 object-cover rounded"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {isSubmitting ? 'جاري الحفظ...' : selectedUser ? 'تحديث' : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
