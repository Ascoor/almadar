export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-4">الصفحة غير موجودة</p>
        <a href="/" className="text-accent hover:underline">العودة للصفحة الرئيسية</a>
      </div>
    </div>
  );
}