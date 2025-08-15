import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function RequirePermission({ permission }: { permission: string }) {
  const { user } = useAuth();
  const allowed = user?.permissions?.includes(permission) || user?.roles?.includes(permission);
  if (!allowed) return <Navigate to="/" replace />;
  return <Outlet />;
}
