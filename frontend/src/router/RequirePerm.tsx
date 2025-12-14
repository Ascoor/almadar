import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export function RequirePerm({ perm, children }: { perm: string; children: JSX.Element }) {
  const { user, isReady, hasPerm } = useAuth();
  if (!isReady) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!hasPerm(perm)) return <Navigate to="/forbidden" replace />;
  return children;
}
