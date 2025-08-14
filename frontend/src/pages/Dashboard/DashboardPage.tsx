export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-card">
          <h3 className="text-lg font-semibold mb-2">العقود النشطة</h3>
          <p className="text-3xl font-bold text-accent">42</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-card">
          <h3 className="text-lg font-semibold mb-2">التحقيقات الجارية</h3>
          <p className="text-3xl font-bold text-primary">18</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-card">
          <h3 className="text-lg font-semibold mb-2">الاستشارات المعلقة</h3>
          <p className="text-3xl font-bold text-warning">7</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-card">
          <h3 className="text-lg font-semibold mb-2">الدعاوى القضائية</h3>
          <p className="text-3xl font-bold text-destructive">12</p>
        </div>
      </div>
    </div>
  );
}