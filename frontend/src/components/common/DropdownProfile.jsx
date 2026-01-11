import { useMemo, useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Transition from '../../utils/Transition';
import { AuthContext } from '@/context/AuthContext';
import { useSpinner } from '@/context/SpinnerContext';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import API_CONFIG from '@/config/config';

// Helper to build full avatar URL
function buildImageUrl(imagePath) {
  if (!imagePath) return null;
  if (/^https?:\/\//.test(imagePath)) return imagePath;
  return `${API_CONFIG.baseURL}/${imagePath}`;
}

export default function UserMenu({ align = 'right' }) {
  const { user, roles, logout } = useContext(AuthContext);
  const { lang, dir } = useLanguage();
  const { showSpinner, hideSpinner } = useSpinner();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('/default-profile.png');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const normalizedRoles = useMemo(
    () =>
      Array.isArray(roles)
        ? roles.map((role) => String(role).toLowerCase())
        : [],
    [roles],
  );

  const roleBadges = useMemo(() => {
    if (normalizedRoles.length === 0) {
      return [
        {
          key: 'user',
          label: lang === 'ar' ? 'مستخدم' : 'User',
          className: 'bg-primary text-primary-foreground border-transparent',
        },
      ];
    }

    return normalizedRoles.map((role) => {
      if (role === 'admin') {
        return {
          key: role,
          label: lang === 'ar' ? 'مسؤول' : 'Admin',
          className: 'bg-rose-500 text-white border-transparent',
        };
      }
      if (role === 'moderator' || role === 'manager') {
        return {
          key: role,
          label: lang === 'ar' ? 'مشرف' : 'Moderator',
          className: 'bg-amber-500 text-white border-transparent',
        };
      }
      return {
        key: role,
        label: role,
        className: 'bg-primary text-primary-foreground border-transparent',
      };
    });
  }, [lang, normalizedRoles]);

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
    if (isLoggingOut) return;
    setDropdownOpen(false);
    showSpinner();
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('✅ تم تسجيل الخروج بنجاح', {
        description: 'نراك قريبًا!',
      });
      navigate('/', { replace: true });
    } catch {
      toast.error('❌ حدث خطأ أثناء تسجيل الخروج');
    } finally {
      setIsLoggingOut(false);
      hideSpinner();
    }
  };

  return (
    <div
      className="relative inline-block text-right"
      ref={dropdownRef}
      dir={dir}
    >
      <button
        ref={triggerRef}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="inline-flex items-center gap-2 focus:outline-none"
      >
        <span className="hidden md:inline font-bold text-fg">
          {user?.name || user?.email || (lang === 'ar' ? 'زائر' : 'Guest')}
        </span>
        <img
          src={avatarSrc}
          onError={() => setAvatarSrc('/default-profile.png')}
          alt={user?.name || 'المستخدم'}
          className="w-8 h-8 rounded-full object-cover"
        />
        <svg className="w-3 h-3 text-muted" viewBox="0 0 12 12">
          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
        </svg>
      </button>

      <Transition
        show={dropdownOpen}
        className={
          `absolute z-50 top-11 ${align === 'right' ? 'right-0' : 'left-0'} ` +
          'min-w-64 bg-card border border-border rounded-lg shadow-lg py-2 ring-1 ring-ring'
        }
        enter="transition ease-out duration-200"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-fg">
            {user?.name || (lang === 'ar' ? 'زائر' : 'Guest')}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email || (lang === 'ar' ? 'لا يوجد بريد' : 'No email')}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {roleBadges.map((badge) => (
              <Badge key={badge.key} className={badge.className}>
                {badge.label}
              </Badge>
            ))}
          </div>
        </div>
        <ul className="text-sm text-fg">
          <li>
            <Link
              to="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center px-4 py-2 hover:bg-muted"
            >
              {lang === 'ar' ? 'الملف الشخصي' : 'Profile'}
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-destructive hover:bg-muted text-right disabled:opacity-60"
              disabled={isLoggingOut}
            >
              {isLoggingOut
                ? lang === 'ar'
                  ? 'جاري تسجيل الخروج...'
                  : 'Signing out...'
                : lang === 'ar'
                  ? 'تسجيل الخروج'
                  : 'Sign Out'}
            </button>
          </li>
        </ul>
      </Transition>
    </div>
  );
}
