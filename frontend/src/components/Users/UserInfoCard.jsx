import { Mail,Phone } from 'lucide-react';  
import API_CONFIG from '../../config/config';

const UserInfoCard = ({ user }) => (
  <div className='neon-shadow mt-5  bg-gold/20 rounded-full  dark:bg-royal-dark border border-1 border-gold/80  dark:border-reded/80  p-6  shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-6 items-center text-center lg:text-left transition-transform duration-300 hover:scale-105'>
    {/* Section for User Avatar (will be displayed above info on small screens) */}
   
    {/* Section for User Info */}
    <div className=' lg:order-1 flex flex-col items-center lg:items-start space-y-4 text-right lg:text-right'>
      {/* User Name */}
      <h3 className='text-xl lg:text-2xl xl:text-3xl text-navy dark:text-gold-light font-bold transition-colors duration-300'>
        {user.name}
      </h3>

      {/* User Role */}
      <p className='text-md lg:text-lg xl:text-xl text-green-700 dark:text-green-400 font-semibold'>
        {user.role?.name}
      </p>

      {/* User Details */}
      <ul className='text-xs text-right lg:text-base xl:text-lg text-gray-800 dark:text-gray-200 space-y-4'>
      
        <li className='flex  items-center justify-center lg:justify-center'>
          <Phone className='ml-2 text-navy-light' />
          <span>رقم الهاتف: {user.phone}</span>
        </li>
        <li className='flex  items-center justify-center lg:justify-center'>
          <Mail className='ml-2 text-green-500' />
          <span>البريد الإلكتروني: {user.email}</span>
        </li>
      </ul>
   
    </div>
       <div className=' flex left-0    m-6 avatar right-6 w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-lg mx-auto lg:mx-0 transition-transform duration-300 hover:scale-110'>
      {user.image ? (
        <img
          src={`${API_CONFIG.baseURL}/${user.image}`}
          className='object-cover w-full h-full'
          alt='Avatar'
        />
      ) : (
        <div className='bg-gray-300 dark:bg-gray-600 flex  w-full h-full'>
          <span className='text-xl text-gray-800 dark:text-gray-200'>
            No Image
          </span>
        </div>
      )}
    </div>
  </div>
);

export default UserInfoCard;