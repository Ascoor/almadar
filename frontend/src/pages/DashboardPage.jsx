import React from 'react';

const DashboardPage = () => {
  const cards = Array.from({ length: 6 });
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <div className="flex gap-2">
          <a href="#" className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground transition hover:bg-primary-muted">إجراء</a>
          <a href="#" className="rounded-xl bg-secondary px-4 py-2 text-sm text-secondary-foreground transition hover:bg-secondary/80">إجراء</a>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((_, i) => (
          <div key={i} className="rounded-2xl bg-card text-card-foreground shadow-card p-4 transition hover:bg-card-hover">
            <h2 className="mb-2 font-semibold">بطاقة {i + 1}</h2>
            <p className="text-sm text-muted-foreground">محتوى تجريبي للبطاقة.</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default DashboardPage;
