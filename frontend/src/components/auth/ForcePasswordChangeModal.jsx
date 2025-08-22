// src/components/auth/ForcePasswordChangeModal.jsx

import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { firstLoginPassword } from '@/services/api/users';
import { AuthContext } from '@/components/auth/AuthContext';

const ForcePasswordChangeModal = ({ onClose }) => {
  const { user, updateUserContext } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('كلمتا المرور غير متطابقتين');
      return;
    }

    setSubmitting(true);
    try {
      await firstLoginPassword(user.id, { password: newPassword });
      toast.success('تم تحديث كلمة المرور بنجاح');
      updateUserContext({ ...user, password_changed: 1 });
      onClose();
    } catch {
      toast.error('فشل تغيير كلمة المرور');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4 text-center text-red-600">يرجى تغيير كلمة المرور</h2>
        <Input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-3"
        />
        <Input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-5"
        />
        <Button
          disabled={submitting}
          onClick={handleSubmit}
          className="w-full"
        >
          {submitting ? 'جارٍ الحفظ...' : 'تحديث كلمة المرور'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ForcePasswordChangeModal;
