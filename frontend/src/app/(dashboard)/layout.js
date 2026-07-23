"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import "@/styles/dashboard.css";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-body">
          <Sidebar />
          <main className="dashboard-main">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
