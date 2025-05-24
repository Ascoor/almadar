// src/components/UserMenu.jsx
import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Transition from '../../utils/Transition';
import { AuthContext } from '@/components/auth/AuthContext';
import { useSpinner } from'@/context/SpinnerContext';
import { toast } from 'sonner';

function UserMenu({ align = 'left' }) {
  const { user, logout } = useContext(AuthContext);
  const { showSpinner, hideSpinner } = useSpinner();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [userImage, setUserImage] = useState('/default-profile.png');
  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    if (user?.image) setUserImage(user.image);
  }, [user]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (
        !dropdown.current ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      ) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    showSpinner();  // أظهر overlay السبينر
    try {
      await logout();  // يمسح التوكن ويعيد user إلى null
      toast.success('✅ تم تسجيل الخروج بنجاح', {
        description: 'نراك قريبًا!',
      });
      navigate('/login');
    } catch (err) {
      toast.error('❌ حدث خطأ أثناء تسجيل الخروج');
    } finally {
      hideSpinner(); // أخفِ overlay السبينر
    }
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="inline-flex items-center gap-2 focus:outline-none"
      >
        <span className="hidden md:inline font-bold text-gold-light dark:text-gold-light">
          {user?.name}
        </span>
        <img
          src={userImage}
          onError={() => setUserImage('/default-profile.png')}
          alt="المستخدم"
          className="w-8 h-8 rounded-full object-cover"
        />
        <svg className="w-3 h-3 text-muted-foreground" viewBox="0 0 12 12">
          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
        </svg>
      </button>

      <Transition
        show={dropdownOpen}
        className={`absolute z-50 top-11 ${
          align === 'right' ? 'right-0' : 'left-0'
        } min-w-44 bg-popover border border-border rounded-lg shadow-lg py-2`}
        enter="transition ease-out duration-200"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <ul className="text-sm text-popover-foreground">
          <li>
            <Link
              to="/profile"
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2 hover:bg-muted"
            >
              الإعدادات
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-red-600 hover:bg-muted w-full text-right"
            >
              تسجيل الخروج
            </button>
          </li>
        </ul>
      </Transition>
    </div>
  );
}

export default UserMenu;
