import React, { useEffect, useState } from 'react';
import { FaUserEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users data (replace with your API call)
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users'); // ⬆️ لو عندك API Endpoint جاهز غير الرابط
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('خطأ في جلب المستخدمين:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-almadar-blue-dark dark:text-white">قائمة الموظفين</h2>
      {users.length === 0 ? (
        <div className="text-center text-gray-500">لا يوجد موظفين مسجلين.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-almadar-blue text-white">
                <th className="p-3 text-right">#</th>
                <th className="p-3 text-right">الاسم</th>
                <th className="p-3 text-right">البريد الالكتروني</th>
                <th className="p-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="p-3 text-right">{index + 1}</td>
                  <td className="p-3 text-right">{user.name}</td>
                  <td className="p-3 text-right">{user.email}</td>
                  <td className="p-3 text-right space-x-2 space-x-reverse">
                    <Link
                      to={`/clients/edit/${user.id}`}
                      className="inline-block p-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaUserEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="inline-block p-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  function handleDelete(id) {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا الموظف؟')) {
      // هنا تكتب كود الحذف الحقيقي
      setUsers(users.filter((user) => user.id !== id));
    }
  }
};

export default UsersList;
