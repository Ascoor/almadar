import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, isReady } = useAuth();
  if (!isReady) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
