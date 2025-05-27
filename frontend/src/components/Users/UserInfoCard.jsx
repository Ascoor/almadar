import { Mail, Phone } from 'lucide-react';
import API_CONFIG from '../../config/config';

const UserInfoCard = ({ user }) => (
  <div className="relative bg-gradient-to-br from-[#fffbea] to-[#fdf6e3] dark:from-[#1b1b29] dark:to-[#0f172a] 
              border border-gold/60 dark:border-reded/60 shadow-xl rounded-3xl 
              p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center 
              transition-transform duration-300 hover:scale-105">

    {/* Avatar Section */}
    <div className="flex justify-center lg:justify-end">
      <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-gold dark:border-reded shadow-lg hover:scale-110 transition-transform duration-300">
        {user.image ? (
          <img
            src={`${API_CONFIG.baseURL}/${user.image}`}
            className="object-cover w-full h-full"
            alt="Avatar"
          />
        ) : (
          <div className="bg-gray-300 dark:bg-gray-700 flex items-center justify-center w-full h-full">
            <span className="text-xl text-gray-800 dark:text-gray-200">No Image</span>
          </div>
        )}
      </div>
    </div>

    {/* Info Section */}
    <div className="flex flex-col items-center lg:items-end space-y-4 text-right">
      {/* User Name */}
      <h3 className="text-2xl lg:text-3xl font-bold text-navy dark:text-gold-light transition-colors duration-300">
        {user.name}
      </h3>

      {/* User Role */}
      <p className="text-lg lg:text-xl font-semibold text-green-700 dark:text-green-400">
        {user.role?.name}
      </p>

      {/* Contact Info */}
      <ul className="text-sm lg:text-base text-gray-800 dark:text-gray-200 space-y-3">
        <li className="flex items-center justify-center lg:justify-end gap-2">
          <Phone className="text-navy-light" size={18} />
          <span>رقم الهاتف: {user.phone}</span>
        </li>
        <li className="flex items-center justify-center lg:justify-end gap-2">
          <Mail className="text-green-500" size={18} />
          <span>البريد الإلكتروني: {user.email}</span>
        </li>
      </ul>
    </div>
  </div>
);

export default UserInfoCard;
