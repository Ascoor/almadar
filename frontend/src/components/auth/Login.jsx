import { useState } from 'react';

import { FaEnvelope, FaLock } from 'react-icons/fa';
import useAuth from '../../components/auth/AuthUser';

const Login = ({
  onAuthStart,
  onAuthComplete,
  handleFormClose,
 
}) => {
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

  return (
    <div className="flex items-center justify-center min-h-screen ">
    <div className="w-full max-w-sm bg-[#333333] text-white rounded-3xl p-8 shadow-lg shadow-green-200/30 transform hover:scale-105 transition-all duration-300">
      <h2 className="text-3xl font-bold text-center text-[#7AC943] mb-4">
        تسجيل الدخول
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            required
            className="w-full py-3 pl-10 pr-4 bg-[#444] text-white border border-[#7AC943]/50 rounded-lg focus:ring-2 focus:ring-[#7AC943]/50"
          />
        </div>
        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            required
            className="w-full py-3 pl-10 pr-4 bg-[#444] text-white border border-[#7AC943]/50 rounded-lg focus:ring-2 focus:ring-[#7AC943]/50"
          />
        </div>
        <button
          type="submit"
          className="w-full font-bold py-2 bg-gradient-to-r from-[#7AC943] to-green-600 text-white rounded-lg shadow-lg hover:from-green-500 hover:to-green-700 transform hover:scale-105 transition-all"
        >
          تسجيل الدخول
        </button>
 
        <button
          onClick={handleFormClose}
          type="button"
          className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105"
        >
          إلغاء
        </button>
      </form>
    </div>
  </div>
);
};

export default Login;