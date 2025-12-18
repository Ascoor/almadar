import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { getRoleUsers } from '@/services/api/users';

export default function AssignmentSection({
  value,
  onAssign,
  loading,
  disabled,
}) {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(value ?? '');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getRoleUsers('user');
        if (!mounted) return;
        const arr = Array.isArray(list?.data) ? list.data : list;
        setUsers(Array.isArray(arr) ? arr : []);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setSelected(value ?? '');
  }, [value]);

  if (!onAssign) return null;

  return (
    <div className="rounded-xl border border-dashed border-border p-4 space-y-3">
      <div className="text-sm font-semibold">{t('assignments.title')}</div>
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Select value={selected?.toString()} onValueChange={setSelected} disabled={disabled}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder={t('assignments.selectAssignee')} />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={String(user.id)}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => onAssign(selected)} disabled={loading || disabled || !selected}>
          {t('assignments.assign')}
        </Button>
      </div>
    </div>
  );
}
