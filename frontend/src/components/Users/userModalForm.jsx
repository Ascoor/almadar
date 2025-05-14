import React, { useState, useEffect, useContext } from 'react';
import { Phone, User } from 'lucide-react';
import { AuthContext } from '@/components/auth/AuthContext';
import API_CONFIG from '@/config/config';

const positionTranslations = { designer: 'مصمم', social_reps: 'مندوب تسويق', sale_reps: 'مندوب مبيعات', multi_employees: 'موظف إدارى' };
const roleTranslations     = { 1: 'مدير', 2: 'موظف' };

const translatePositionToEnglish = arabic =>
  Object.keys(positionTranslations).find(k => positionTranslations[k] === arabic) || '';
const translateRoleToEnglish     = arabic =>
  Object.keys(roleTranslations).find(k => roleTranslations[k] === arabic) || '';

export default function UserModalForm({ isOpen, onClose, selectedUser, refreshUsers }) {
  const { http } = useContext(AuthContext);
  const [formData, setFormData]         = useState({ name:'', phone:'', skills:'', employee_position:'', covered_areas:'', position:'', role:'', emailPrefix:'', image:null });
  const [validationErrors, setErrors]   = useState({});
  const [imageFile, setImageFile]       = useState(null);
  const [isSubmitted, setIsSubmitted]   = useState(false);

  // initialize when opened
  useEffect(() => {
    if (!isOpen) return;
    if (selectedUser) {
      const [emailPrefix] = selectedUser.email.split('@');
      setFormData({
        name: selectedUser.name,
        phone: selectedUser.phone,
        skills: selectedUser.skills,
        employee_position: selectedUser.employee_position || '',
        covered_areas: selectedUser.covered_areas || '',
        position: selectedUser.position || '',
        role: selectedUser.role || '',
        emailPrefix,
        image: selectedUser.image ? API_CONFIG.baseURL + selectedUser.image : null,
      });
      setImageFile(null);
    } else {
      setFormData({ name:'', phone:'', skills:'', employee_position:'', covered_areas:'', position:'', role:'', emailPrefix:'', image:null });
      setImageFile(null);
    }
    setErrors({});
    setIsSubmitted(false);
  }, [isOpen, selectedUser]);

  const handleChange     = e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData(f => ({ ...f, image: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitted(true);
    const { name, phone, position, role, emailPrefix } = formData;
    if (!name||!phone||!position||!role||!emailPrefix) return;

    const payload = new FormData();
    // append everything except position/role (we’ll add their English codes separately)
    Object.entries(formData).forEach(([k, v]) => {
      if (['position','role'].includes(k)) return;
      payload.append(k, v);
    });
    payload.append('position', translatePositionToEnglish(position));
    payload.append('role', translateRoleToEnglish(role));
    if (imageFile) payload.append('image', imageFile);

    try {
      const url = selectedUser?.id
        ? `/api/employee-users/${selectedUser.id}`
        : `/api/employee-users`;
      await http.post(url, payload);
      refreshUsers();
      onClose();
    } catch (err) {
      console.error('Save user error', err);
      setErrors(err.response?.data?.errors || {});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 mx-4 overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          {selectedUser ? 'تعديل المستخدم' : 'إضافة مستخدم'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 flex items-center">
              <User className="ml-2" /> إسم الموظف
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              readOnly
            />
            {isSubmitted && !formData.name && <p className="text-red-500">مطلوب</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 flex items-center">
              <Phone className="ml-2" /> رقم الهاتف
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              readOnly
            />
            {isSubmitted && !formData.phone && <p className="text-red-500">مطلوب</p>}
          </div>

          {/* Position */}
          <div>
            <label className="block mb-1">المنصب</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled
            >
              <option value="">اختر المنصب</option>
              {Object.values(positionTranslations).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {isSubmitted && !formData.position && <p className="text-red-500">مطلوب</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1">الدور</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">اختر الدور</option>
              {Object.values(roleTranslations).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {isSubmitted && !formData.role && <p className="text-red-500">مطلوب</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1">البريد الإلكتروني</label>
            <div className="flex">
              <input
                name="emailPrefix"
                value={formData.emailPrefix}
                onChange={handleChange}
                className="flex-1 p-2 border rounded-l"
              />
              <span className="p-2 border rounded-r bg-gray-200">@hadathah.org</span>
            </div>
            {isSubmitted && !formData.emailPrefix && <p className="text-red-500">مطلوب</p>}
          </div>

          {/* Image */}
          <div>
            <label className="block mb-1">الصورة</label>
            <input type="file" onChange={handleFileChange} className="w-full" />
            {formData.image && (
              <img src={formData.image} alt="preview" className="w-24 h-24 mt-2 object-cover rounded" />
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              إلغاء
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {selectedUser ? 'تحديث' : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
