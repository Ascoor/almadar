import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as { from?: { pathname?: string } } | undefined)?.from?.pathname ?? "/dashboard";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      nav(from, { replace: true });
    } catch (e) {
      const message = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErr(message ?? "فشل تسجيل الدخول");
    }
  };

  return (
    <div className="min-h-[calc(100vh-0px)] grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-center">تسجيل الدخول</h2>
        <label className="block mb-2 text-sm">البريد الإلكتروني</label>
        <input className="w-full mb-3 rounded-lg border border-border bg-background px-3 py-2"
               type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label className="block mb-2 text-sm">كلمة المرور</label>
        <input className="w-full mb-4 rounded-lg border border-border bg-background px-3 py-2"
               type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {err && <div className="mb-3 text-destructive text-sm">{err}</div>}
        <button disabled={loading}
                className="w-full btn-hero disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? "جاري تسجيل الدخول..." : "دخول"}
        </button>
      </form>
      {loading && <div className="fixed inset-0 pointer-events-none" />}
    </div>
  );
}
