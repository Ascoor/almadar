import React, { useContext, useEffect, useState } from 'react';
import { getProfile, updateUser, changePassword } from '@/services/api/users';
import { AuthContext } from '@/context/AuthContext';
import { toast } from 'sonner';
import API_CONFIG from '../config/config';

export default function ProfilePage() {
  const { user, updateUserContext } = useContext(AuthContext); // جلب دالة updateUserContext من السياق

  const [profileData, setProfileData] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', image: null });
  const [preview, setPreview] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getProfile(user.id); // استخدم user.id
        setProfileData(res.user);
        setForm({ name: res.user.name, email: res.user.email, image: null });
        if (res.user.image) {
          setPreview(`${API_CONFIG.baseURL}/${res.user.image}`);
        }
      } catch {
        toast.error('فشل تحميل الملف الشخصي');
      }
    };
    if (user?.id) loadUser();
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('email', form.email);
    if (form.image) data.append('image', form.image);

    try {
      await updateUser(user.id, data); // استخدم user.id
      toast.success('✅ تم تحديث البيانات بنجاح');

      // بعد التحديث بنجاح، قم بإعادة تحميل البيانات من الخادم
      const res = await getProfile(user.id); // إعادة تحميل البيانات
      updateUserContext(res.user); // تحديث المستخدم في السياق المحلي
    } catch {
      toast.error('حدث خطأ أثناء التحديث');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePassword(user.id, passwordForm); // استخدم user.id
      toast.success('✅ تم تغيير كلمة المرور');
      setPasswordForm({
        old_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تغيير كلمة المرور');
    }
  };

  if (!user)
    return (
      <div className="mt-10 text-center text-muted">
        تحميل البيانات...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <div className="p-6 space-y-6 rounded-lg shadow bg-card">
        <h2 className="text-2xl font-bold">الملف الشخصي</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-fg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-fg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              الصورة الشخصية
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFormChange}
              className="w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="صورة المستخدم"
                className="w-24 h-24 mt-2 rounded-full object-cover"
              />
            )}
          </div>
          <button
            type="submit"
            className="rounded-2xl px-4 py-2 bg-primary text-[color:var(--primary-foreground)] hover:shadow-glow transition"
          >
            حفظ التغييرات
          </button>
        </form>
      </div>

      <div className="p-6 space-y-6 rounded-lg shadow bg-card">
        <h2 className="text-2xl font-bold">تغيير كلمة المرور</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              كلمة المرور الحالية
            </label>
            <input
              type="password"
              name="old_password"
              value={passwordForm.old_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  old_password: e.target.value,
                })
              }
              className="w-full rounded-xl bg-card border border-border text-fg placeholder:text-muted focus:ring-2 focus:ring-ring focus:border-border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              name="new_password"
              value={passwordForm.new_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  new_password: e.target.value,
                })
              }
              className="w-full rounded-xl bg-card border border-border text-fg placeholder:text-muted focus:ring-2 focus:ring-ring focus:border-border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              name="new_password_confirmation"
              value={passwordForm.new_password_confirmation}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  new_password_confirmation: e.target.value,
                })
              }
              className="w-full rounded-xl bg-card border border-border text-fg placeholder:text-muted focus:ring-2 focus:ring-ring focus:border-border px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl px-4 py-2 bg-accent text-fg hover:shadow-glow transition"
          >
            تغيير كلمة المرور
          </button>
        </form>
      </div>
    </div>
  );
}
