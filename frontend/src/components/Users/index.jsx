import { useEffect, useState } from 'react';
import { FaUserEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { deleteUser, getUsers } from '../../services/api/users';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers(); // استدعاء الدالة المحسّنة
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers(); // استخدام دالة axios بدلاً من fetch
      setUsers(data);
    } catch (error) {
      console.error('خطأ في جلب المستخدمين:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا المستخدم؟')) {
      try {
        await deleteUser(id); // استخدام الدالة الرسمية
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } catch (error) {
        console.error('فشل الحذف:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-right text-almadar-blue-dark dark:text-white">
        قائمة ايلمستخدمين
      </h2>

      {users.length === 0 ? (
        <div className="text-center text-gray-500">لا يوجد مستخدمين حتى الآن.</div>
      ) : (
        <table className="min-w-full text-sm text-right border-collapse">
          <thead>
            <tr className="bg-almadar-blue text-white">
              <th className="p-3 border">#</th>
              <th className="p-3 border">الاسم</th>
              <th className="p-3 border">البريد الإلكتروني</th>
              <th className="p-3 border">الدور</th>
              <th className="p-3 border">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  {user.roles?.[0]?.name ? (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                      {user.roles[0].name}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="p-3 space-x-2 space-x-reverse">
                  <Link
                    to={`/clients/edit/${user.id}`}
                    className="inline-block text-blue-600 hover:text-blue-800"
                    title="تعديل"
                  >
                    <FaUserEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="inline-block text-red-600 hover:text-red-800"
                    title="حذف"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;