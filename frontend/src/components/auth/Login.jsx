import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import useAuth from '../../components/auth/AuthUser';

const Login = ({ onAuthStart, onAuthComplete, handleFormClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleFormClose();
    onAuthStart();
    const success = await login(email, password);
    if (success) {
      onAuthComplete(true, 'تم تسجيل الدخول بنجاح!');
    } else {
      onAuthComplete(false, 'فشل تسجيل الدخول. تحقق من البيانات.');
    }
  };

  const handleCancel = () => {
    handleFormClose();
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black  bg-opacity-60">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="w-full max-w-md bg-green-900/20 text-white rounded-2xl p-8 shadow-2xl border border-gray-800 scale-100 transition-all">
        <h2 className="text-3xl font-extrabold text-center text-emerald-400 mb-6 tracking-wide drop-shadow">
          تسجيل الدخول
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* البريد */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-4 text-emerald-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              required
              className="w-full py-3 pl-12 pr-4  bg-white border border-gray-700 text-black placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* كلمة المرور */}
          <div className="relative">
            <FaLock className="absolute top-3 left-4 text-emerald-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              required
              className="w-full py-3 pl-12 pr-4 bg-white border border-gray-700 text-black placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* زر الدخول */}
          <Button
            type="submit"
            className="w-full py-3 font-bold text-white bg-gradient-to-l from-emerald-400 via-emerald-500 to-green-600 rounded-lg shadow-md hover:from-emerald-600 hover:via-emerald-500 hover:to-emerald-500 hover:scale-105 transition-transform"
          >
            🚀 تسجيل الدخول
          </Button>

          {/* زر الإلغاء */}
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-3 font-semibold text-white bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-all hover:scale-105"
          >
            إلغاء
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
