import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/Spinner";

export default function RequireAuth() {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <Spinner label="جاري التحقق من الجلسة..." />;
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;
  return <Outlet />;
}
