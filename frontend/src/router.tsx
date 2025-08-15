import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import RequireAuth from "@/app/guards/RequireAuth";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      {
        element: <RequireAuth />,
        children: [{ path: "dashboard", element: <Dashboard /> }]
      },
      { path: "*", element: <NotFound /> }
    ]
  }
]);
