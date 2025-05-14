
import {
Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import API_CONFIG from '../../../config/config';

const UserInfoCard = ({ user }) => (
  <div className='neon-shadow mt-5 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-6 items-center text-center lg:text-left transition-transform duration-300 hover:scale-105'>
    {/* Section for User Avatar (will be displayed above info on small screens) */}

    {/* Section for User Info */}
    <div className='order-2 lg:order-1 flex flex-col items-center lg:items-start space-y-4 text-right lg:text-right'>
      {/* User Name */}
      <h3 className='text-xl lg:text-2xl xl:text-3xl text-blue-700 dark:text-blue-400 font-bold transition-colors duration-300'>
        {user.name}
      </h3>

      {/* User Role */}
      <p className='text-md lg:text-lg xl:text-xl text-green-700 dark:text-green-400 font-semibold'>
        {user.role.name}
      </p>

      {/* User Details */}
      <ul className='text-xs text-right lg:text-base xl:text-lg text-gray-800 dark:text-gray-200 space-y-4'>
        <li className='flex  text-gray-700 dark:text-gray-300  items-center justify-center lg:justify-center'>
          <Calendar className='ml-2 text-blue-500' />
          <span>
            تاريخ التعيين: {format(new Date(user.created_at), 'yyyy-MM-dd')}
          </span>
        </li>

        <li className='flex  items-center justify-center lg:justify-center'>
          <Phone className='ml-2 text-yellow-500' />
          <span>رقم الهاتف: {user.phone}</span>
        </li>
        <li className='flex  items-center justify-center lg:justify-center'>
          <Mail className='ml-2 text-green-500' />
          <span>البريد الإلكتروني: {user.email}</span>
        </li>
      </ul>
    </div>
    <div className='order-1 avatar left-0 w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-lg mx-auto lg:mx-0 transition-transform duration-300 hover:scale-110'>
      {user.image ? (
        <img
          src={`${API_CONFIG.baseURL}${user.image}`}
          className='object-cover w-full h-full'
          alt='Avatar'
        />
      ) : (
        <div className='bg-gray-300 dark:bg-gray-600 flex items-center justify-center w-full h-full'>
          <span className='text-xl text-gray-800 dark:text-gray-200'>
            No Image
          </span>
        </div>
      )}
    </div>
  </div>
);

export default UserInfoCard;