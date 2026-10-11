import React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard initialSession={null}>
      <div className="min-h-screen bg-slate-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </div>
      </div>
    </AdminAuthGuard>
  );
}
