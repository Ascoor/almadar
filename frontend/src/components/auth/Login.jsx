import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
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
const handleCancel = () => {
  handleFormClose();
  setEmail('');
  setPassword('');
}
  return (
   
    <div className="flex items-center justify-center ">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="w-full max-w-md bg-almadar-graphite-dark text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-300/10 transition-transform transform hover:scale-105 duration-300">
        <h2 className="text-3xl font-extrabold text-center text-almadar-mint-light mb-6 tracking-tight">
          تسجيل الدخول
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* البريد */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              required
              autoComplete="email"
              className="w-full py-3 pl-10 pr-4 bg-gray-700 text-white border border-gray-500/40 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* كلمة المرور */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              required
              autoComplete="current-password"
              className="w-full py-3 pl-10 pr-4 bg-gray-700 text-white border border-gray-500/40 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* زر الدخول */}
          <button
            type="submit"
            className="w-full py-3 font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg shadow hover:from-emerald-500 hover:to-emerald-300 hover:scale-105 transition-transform"
          >
            تسجيل الدخول
          </button>

          {/* زر الإلغاء */}
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-3 font-semibold text-white bg-almadar-sky-dark rounded-lg hover:bg-almadar-sky hover:text-black transition-colors hover:scale-105"
          >
            إلغاء
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
