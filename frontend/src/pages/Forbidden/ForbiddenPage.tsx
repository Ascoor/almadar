export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-destructive">403</h1>
        <p className="text-xl mb-4">غير مسموح لك بالوصول إلى هذه الصفحة</p>
        <a href="/" className="text-accent hover:underline">العودة للصفحة الرئيسية</a>
      </div>
    </div>
  );
}