import { useState, useRef, useEffect ,useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Transition from '../../utils/Transition';
import { AuthContext } from '@/components/auth/AuthContext';
import { useSpinner } from '@/context/SpinnerContext';
import { toast } from 'sonner';
import API_CONFIG from '@/config/config';

// Helper to build full avatar URL
function buildImageUrl(imagePath) {
  if (!imagePath) return null;
  if (/^https?:\/\//.test(imagePath)) return imagePath;
  return `${API_CONFIG.baseURL}/${imagePath}`;
}

export default function UserMenu({ align = 'right' }) {
  const { user, logout } = useContext(AuthContext);
  const { showSpinner, hideSpinner } = useSpinner();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('/default-profile.png');
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Update avatar src when user changes
  useEffect(() => {
    const url = buildImageUrl(user?.image);
    setAvatarSrc(url || '/default-profile.png');
  }, [user]);

  // Close on outside click or drag away
  useEffect(() => {
    const handleClickOrDrag = (event) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOrDrag);
    document.addEventListener('touchstart', handleClickOrDrag);
    return () => {
      document.removeEventListener('mousedown', handleClickOrDrag);
      document.removeEventListener('touchstart', handleClickOrDrag);
    };
  }, [dropdownOpen]);

  // Auto-close after 8 seconds
  useEffect(() => {
    if (!dropdownOpen) return;
    const timer = setTimeout(() => setDropdownOpen(false), 8000);
    return () => clearTimeout(timer);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    showSpinner();
    try {
      await logout();
      toast.success('✅ تم تسجيل الخروج بنجاح', { description: 'نراك قريبًا!' });
      navigate('/login');
    } catch {
      toast.error('❌ حدث خطأ أثناء تسجيل الخروج');
    } finally {
      hideSpinner();
    }
  };

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="inline-flex items-center gap-2 focus:outline-none"
      >
        <span className="hidden md:inline font-bold text-white dark:text-gold-light">
          {user?.name || 'زائر'}
        </span>
        <img
          src={avatarSrc}
          onError={() => setAvatarSrc('/default-profile.png')}
          alt={user?.name || 'المستخدم'}
          className="w-8 h-8 rounded-full object-cover"
        />
        <svg className="w-3 h-3 text-muted-foreground" viewBox="0 0 12 12">
          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
        </svg>
      </button>

      <Transition
        show={dropdownOpen}
        className={`absolute z-50 top-11 ${align === 'right' ? 'right-0' : 'left-0'} ` +
          'min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ' +
          'rounded-lg shadow-lg py-2 ring-1 ring-black ring-opacity-5'}
        enter="transition ease-out duration-200"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <ul className="text-sm text-gray-700 dark:text-gray-200">
          <li>
            <Link
              to="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              الملف الشخصى
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-right"
            >
              تسجيل الخروج
            </button>
          </li>
        </ul>
      </Transition>
    </div>
  );
}
