import React, { useEffect, useContext } from "react";
import { AuthContext } from "@/components/auth/AuthContext";
import { initEcho } from "@/lib/echo";

export default function EchoInitializer({ children }) {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    initEcho({
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }, [token]);

  return <>{children}</>;
}
