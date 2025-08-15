import React from "react";
import { Outlet } from "react-router-dom";
import LoadingBar from "@/components/LoadingBar";
import { useRouteProgress } from "@/hooks/useRouteProgress";

export default function AppLayout() {
  useRouteProgress();
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <LoadingBar />
      <main className="p-4"><Outlet /></main>
    </div>
  );
}
