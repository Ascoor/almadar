import React from "react";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center text-center">
      <div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-4">الصفحة غير موجودة</p>
        <Link to="/" className="btn-hero">عودة للرئيسية</Link>
      </div>
    </div>
  );
}
