import  { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { Bell } from 'lucide-react';

export default function DropdownNotifications() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current || !trigger.current) return;
      if (
        !dropdown.current.contains(target) &&
        !trigger.current.contains(target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (keyCode === 27) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, []);

  return (
  // ...الاستيرادات كما هي
<div className="relative inline-flex">
  <button
    ref={trigger}
    onClick={() => setDropdownOpen(!dropdownOpen)}
    className={`relative w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-all duration-300
      ${dropdownOpen
        ? 'bg-primary text-primary-foreground'
        : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground'}`}
  >
    {dropdownOpen ? (
      <Bell className="w-6 h-6 animate-bounce" />
    ) : (
      <Bell className="w-6 h-6" />
    )}
    <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white dark:border-background rounded-full animate-ping" />
  </button>

  {dropdownOpen && (
    <div
      ref={dropdown}
      className="absolute top-14 right-0 w-80 bg-popover text-popover-foreground border border-border py-2 rounded-xl shadow-xl z-50"
    >
      <div className="text-sm font-bold px-4 py-2 border-b border-border">
        الإشعارات
      </div>
      <ul className="divide-y divide-border">
        <li>
          <Link
            to="#0"
            onClick={() => setDropdownOpen(false)}
            className="flex gap-3 px-4 py-3 hover:bg-muted transition-colors"
          >
            <span className="text-blue-600 dark:text-blue-400 text-lg">📢</span>
            <div>
              <p className="font-semibold">تحديث جديد للسياسات</p>
              <p className="text-xs text-muted-foreground">يرجى مراجعتها</p>
              <p className="text-xs text-muted-foreground mt-1">منذ 3 ساعات</p>
            </div>
          </Link>
        </li>
        <li>
          <Link
            to="#0"
            onClick={() => setDropdownOpen(false)}
            className="flex gap-3 px-4 py-3 hover:bg-muted transition-colors"
          >
            <span className="text-green-600 dark:text-green-400 text-lg">🚀</span>
            <div>
              <p className="font-semibold">إطلاق ميزة جديدة</p>
              <p className="text-xs text-muted-foreground">جربها الآن</p>
              <p className="text-xs text-muted-foreground mt-1">منذ يومين</p>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  )}
</div>

  );
}
