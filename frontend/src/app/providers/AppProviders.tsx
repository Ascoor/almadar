import React from "react";

import { DirProvider } from "@/context/DirContext";
import { AuthProvider } from "@/context/AuthContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
        <DirProvider>
          
    <AuthProvider>
      {children}
    </AuthProvider>
        </DirProvider>
  );
}
