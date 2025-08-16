import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getProfile, updateUser, changePassword } from '@/services/api/users';
import { AuthContext } from '@/components/auth/AuthContext';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateUserContext } = useContext(AuthContext);

  const [profileData, setProfileData] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', image: null });
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const blobUrlRef = useRef(null);

  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getProfile(user.id);
        setProfileData(res.user);
        setForm({ name: res.user.name ?? '', email: res.user.email ?? '', image: null });
        if (res.image_url) setPreview(res.image_url);
      } catch (err) {
        toast.error('فشل تحميل الملف الشخصي');
      }
    };
    if (user?.id) loadUser();

    // تنظيف أي blob URL عند الخروج
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [user?.id]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files?.[0];
      if (!file) return;

      // تحقق من النوع والحجم
      if (!/^image\/(png|jpe?g|gif)$/i.test(file.type)) {
        toast.error('صيغة الصورة غير مدعومة (png/jpg/jpeg/gif فقط)');
        return;
      }
      const MAX = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX) {
        toast.error('الحد الأقصى للصورة 2MB');
        return;
      }

      setForm((prev) => ({ ...prev, image: file }));

      // ألغِ الرابط القديم لتفادي التسريب
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      const url = URL.createObjectURL(file);
      blobUrlRef.current = url;
      setPreview(url);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    const data = new FormData();
    data.append('name', form.name ?? '');
    data.append('email', form.email ?? '');
    if (form.image) data.append('image', form.image);

    try {
      setSaving(true);
      await updateUser(user.id, data);
      toast.success('✅ تم تحديث البيانات بنجاح');

      const res = await getProfile(user.id);
      updateUserContext(res.user);
      setProfileData(res.user);
      if (res.image_url) setPreview(res.image_url);

      // صفِّر اختيار الصورة
      setForm((prev) => ({ ...prev, image: null }));

      // لو كان في blob URL، الغِه
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        Object.values(err?.response?.data?.errors || {})[0]?.[0] ||
        'حدث خطأ أثناء التحديث';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setPwdSaving(true);
      await changePassword(user.id, passwordForm);
      toast.success('✅ تم تغيير كلمة المرور');
      setPasswordForm({ old_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        Object.values(err?.response?.data?.errors || {})[0]?.[0] ||
        'فشل تغيير كلمة المرور';
      toast.error(msg);
    } finally {
      setPwdSaving(false);
    }
  };

  if (!user) return <div className="text-center mt-10 text-gray-500">تحميل البيانات...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow space-y-6">
        <h2 className="text-2xl font-bold">الملف الشخصي</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              className="w-full rounded border px-3 py-2"
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              className="w-full rounded border px-3 py-2"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الصورة الشخصية</label>
            <input
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/jpg,image/gif"
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
            disabled={saving}
            className={`px-4 py-2 rounded text-white transition ${
              saving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow space-y-6">
        <h2 className="text-2xl font-bold">تغيير كلمة المرور</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">كلمة المرور الحالية</label>
            <input
              type="password"
              name="old_password"
              value={passwordForm.old_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
              className="w-full rounded border px-3 py-2"
              autoComplete="current-password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">كلمة المرور الجديدة</label>
            <input
              type="password"
              name="new_password"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              className="w-full rounded border px-3 py-2"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">تأكيد كلمة المرور</label>
            <input
              type="password"
              name="new_password_confirmation"
              value={passwordForm.new_password_confirmation}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })
              }
              className="w-full rounded border px-3 py-2"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={pwdSaving}
            className={`px-4 py-2 rounded text-white transition ${
              pwdSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {pwdSaving ? 'جارٍ التغيير...' : 'تغيير كلمة المرور'}
          </button>
        </form>
      </div>
    </div>
  );
}
