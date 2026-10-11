import React, { Suspense } from "react";
import { OrderSuccessClient } from "./order-success-client";

export async function generateStaticParams() {
  return [
    { id: "new" },
    { id: "confirmado" },
    { id: "FYF-2026-1001" },
    { id: "FYF-2026-1002" },
    { id: "FYF-2026-1003" },
  ];
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Cargando confirmación de pedido...</div>}>
      <OrderSuccessClient />
    </Suspense>
  );
}
