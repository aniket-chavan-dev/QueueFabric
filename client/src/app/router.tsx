import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RequireAuth from "@/features/auth/components/RequireAuth";

import JobsDashboard from "@/features/jobs/pages/JobsDashboard/JobsDashboard";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import JobDetailPage from "@/features/jobs/pages/JobDetailPage"


export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },

      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },

      {
        element: <RequireAuth />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: "/dashboard",
                element: <JobsDashboard />,
              },
              {
                path: "/jobs/:id",
                element: <JobDetailPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
