import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import LoadingBar from "@/components/LoadingBar";
import { useRouteProgress } from "@/hooks/useRouteProgress";

export default function AppLayout() {
  useRouteProgress();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LoadingBar />
      <Sidebar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
