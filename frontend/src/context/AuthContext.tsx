import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

type User = { id: number; name: string; email: string; roles?: string[]; permissions?: string[] };
type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);
export const useAuth = () => useContext(Ctx)!;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { data } = await api.get("/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post("/login", { email, password });
      localStorage.setItem("auth_token", data?.token);
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { setLoading(false); return; }
    refresh();
  }, []);

  const value = { user, loading, login, logout, refresh };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
