// PermissionRow Component
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';

const translatePermission = name => {
  switch (name) {
    case 'show':
      return 'عرض';
    case 'add':
      return 'إضافة';
    case 'update':
      return 'تحديث';
    case 'delete':
      return 'حذف';
    default:
      return name;
  }
};

const translateSection = section => {
  switch (section) {
    case 'Orders':
      return 'الطلبات';
    case 'Customers':
      return 'العملاء';
    case 'Users':
      return 'المستخدمين';
    case 'MultiEmployees':
      return 'الموظفين';
    case 'Designs':
      return 'التصميمات';
    case 'Designers':
      return 'مصممين الجرافيك';
    case 'SocialReps':
      return 'مندوبي التسويق';
    case 'SaleReps':
      return 'مندوبي المبيعات';
    case 'Offers':
      return 'العروض';
    case 'Products':
      return 'المنتجات';
    case 'Categories':
      return 'التصنيفات';
    case 'Invoices':
      return 'الفواتير';
    case 'Payments':
      return 'المدفوعات';
    case 'Reports':
      return 'التقارير';
    default:
      return section;
  }
};

const PermissionRow = ({ action, enabled, onChange }) => (
  <div className='flex items-center justify-between w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-2'>
    <label className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
      {action}
    </label>
    <button
      onClick={onChange}
      className='focus:outline-none cursor-pointer text-2xl'
    >
      {enabled ? (
        <BsToggleOn className='text-green-500' />
      ) : (
        <BsToggleOff className='text-red-500' />
      )}
    </button>
  </div>
);

const PermissionsSection = ({
  section,
  permissions,
  handlePermissionChange,
}) => (
  <div className='permissions-section mb-5 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg'>
    <h3 className='text-lg font-extrabold text-center text-green-800 dark:text-white mb-4'>
      {translateSection(section)}
    </h3>
    <div className='flex flex-wrap'>
      {permissions.map(permission => (
        <PermissionRow
          key={`${section}-${permission.name}`}
          action={translatePermission(permission.name)}
          enabled={permission.enabled}
          onChange={() => handlePermissionChange(section, permission.name)}
        />
      ))}
    </div>
  </div>
);

export default PermissionsSection;