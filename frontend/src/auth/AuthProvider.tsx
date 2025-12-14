import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

type Scope = "SELF" | "DEPARTMENT" | "ALL";

type AuthState = {
  user: any | null;
  roles: string[];
  permissions: string[];
  data_scope: Scope | null;
  token: string | null;
  isReady: boolean;
};

type AuthCtx = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  hasPerm: (perm: string) => boolean;
  hasAnyPerm: (perms: string[]) => boolean;
  hasRole: (role: string) => boolean;
  hasPermission?: (perm: string) => boolean;
  updateUserContext?: (user: any | null) => void;
  updatePermissions?: (perms: string[]) => void;
};

export const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    roles: [],
    permissions: [],
    data_scope: null,
    token: localStorage.getItem("token"),
    isReady: false,
  });

  const refresh = async () => {
    try {
      const res = await api.get("/user");
      setState((prev) => ({
        ...prev,
        user: res.data.user,
        roles: res.data.roles ?? [],
        permissions: res.data.permissions ?? [],
        data_scope: res.data.data_scope ?? null,
        isReady: true,
      }));
    } catch {
      setState({
        user: null,
        roles: [],
        permissions: [],
        data_scope: null,
        token: null,
        isReady: true,
      });
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      setState((prev) => ({ ...prev, token: res.data?.token ?? prev.token }));
      await refresh();
      return { success: true, user: res.data?.user };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || error?.message || "Authentication failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({
      user: null,
      roles: [],
      permissions: [],
      data_scope: null,
      token: null,
      isReady: true,
    });
  };

  const hasPerm = (perm: string) => state.permissions.includes(perm);
  const hasAnyPerm = (perms: string[]) => perms.some((p) => hasPerm(p));
  const hasRole = (role: string) => state.roles.includes(role);
  const updateUserContext = (user: any | null) => setState((prev) => ({ ...prev, user }));
  const updatePermissions = (perms: string[]) => setState((prev) => ({ ...prev, permissions: perms }));

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      refresh,
      hasPerm,
      hasAnyPerm,
      hasRole,
      hasPermission: hasPerm,
      isLoading: !state.isReady,
      updateUserContext,
      updatePermissions,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
