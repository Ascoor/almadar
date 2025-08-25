import React from 'react';
import AddButton from '@/components/common/AddButton';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-2">
      <AddButton label="عقد" onClick={() => navigate('/contracts', { state: { openModal: true } })} />
      <AddButton label="مشورة" onClick={() => navigate('/legal/legal-advices', { state: { openModal: true } })} />
      <AddButton label="دعوى" onClick={() => navigate('/legal/litigations', { state: { openModal: true } })} />
    </div>
  );
}
