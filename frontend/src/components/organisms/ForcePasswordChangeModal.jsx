// src/components/auth/ForcePasswordChangeModal.jsx

import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { firstLoginPassword } from '@/services/api/users';
import { AuthContext } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { modalOverlay, modalContainer, modalHeading } from '@/components/common/modalStyles';

const ForcePasswordChangeModal = ({ onClose }) => {
  const { user, updateUserContext } = useContext(AuthContext);
  const { t } = useLanguage();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(t('passwordMismatch'));
      return;
    }

    setSubmitting(true);
    try {
      await firstLoginPassword(user.id, { password: newPassword });
      toast.success(t('passwordUpdated'));
      updateUserContext({ ...user, password_changed: 1 });
      onClose();
    } catch {
      toast.error(t('passwordChangeFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className={modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={`${modalContainer} max-w-md sm:p-8 space-y-4`}>
        <h2 className={`${modalHeading} text-red-600 dark:text-red-400`}>
          {t('changePasswordPrompt')}
        </h2>
        <Input
          type="password"
          placeholder={t('newPassword')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-1"
        />
        <Input
          type="password"
          placeholder={t('confirmPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-2"
        />
        <Button
          disabled={submitting}
          onClick={handleSubmit}
          className="w-full"
        >
          {submitting ? t('loading') : t('update')}
        </Button>
      </div>
    </motion.div>
  );
};

export default ForcePasswordChangeModal;
