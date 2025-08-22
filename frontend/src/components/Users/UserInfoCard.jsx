import { Mail, Phone } from 'lucide-react';
import API_CONFIG from '../../config/config';
const roleLabels = {
  admin: 'أدمن',
  staff: 'موظف',
  user: 'مستخدم',
};
const UserInfoCard = ({ user }) => (
  <div className="bg-gradient-to-br from-[#fffbea] to-[#fdf6e3] dark:from-[#1b1b29] dark:to-[#0f172a] 
    border border-gold/60 dark:border-reded/60 shadow-xl rounded-3xl 
    p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 text-right">

    {/* الصورة */}
    <div className="shrink-0">
      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-gold dark:border-reded shadow-lg">
        {user.image ? (
          <img
            src={`${API_CONFIG.baseURL}/${user.image}`}
            className="object-cover w-full h-full"
            alt="صورة المستخدم"
          />
        ) : (
          <div className="bg-gray-300 dark:bg-gray-700 flex items-center justify-center w-full h-full">
            <span className="text-sm text-gray-800 dark:text-gray-200">بدون صورة</span>
          </div>
        )}
      </div>
    </div>

    {/* معلومات المستخدم */}
    <div className="flex-1 space-y-3">
      {/* الاسم */}
      <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold-light">
        {user.name}
      </h3>

      {/* الدور */}
      {user.role?.name && (
        <p className="text-green-700 dark:text-green-400 font-semibold">
          الدور: {user.role.name}
        </p>
      )}

      {/* تاريخ الإنشاء */}
      {user.created_at && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          تم الإنشاء: {new Date(user.created_at).toLocaleDateString('ar-EG')}
        </p>
      )}

      {/* بيانات التواصل */}
      <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-2">
        {user.phone && (
          <li className="flex items-center gap-2 justify-start sm:justify-end">
            <Phone size={16} className="text-navy-light" />
            <span>{user.phone}</span>
          </li>
        )}
{Array.isArray(user.roles) && user.roles.length > 0 && (
  <p className="text-green-700 dark:text-green-400 font-semibold">
    الدور: {user.roles.map(r => roleLabels[r.name] || r.name).join('، ')}
  </p>
)}
        {user.email && (
          <li className="flex items-center gap-2 justify-start sm:justify-end">
            <Mail size={16} className="text-green-500" />
            <span>{user.email}</span>
          </li>
        )}
      </ul>
    </div>
  </div>
);

export default UserInfoCard;
