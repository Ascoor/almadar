import React from "react";
import { useAuth } from "../../auth/AuthProvider";

export function Can({ perm, children }: { perm: string; children: React.ReactNode }) {
  const { hasPerm } = useAuth();
  if (!hasPerm(perm)) return null;
  return <>{children}</>;
}
