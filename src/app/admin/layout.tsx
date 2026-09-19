import React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getAdminSession } from "@/lib/auth";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  return (
    <AdminAuthGuard initialSession={session}>
      <div className="min-h-screen bg-slate-50 flex">
        <AdminSidebar session={session} />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </div>
      </div>
    </AdminAuthGuard>
  );
}
