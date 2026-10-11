import React, { Suspense } from "react";
import { VoucherClient } from "./voucher-client";

export async function generateStaticParams() {
  return [
    { id: "detalle" },
    { id: "FYF-2026-1001" },
    { id: "FYF-2026-1002" },
    { id: "FYF-2026-1003" },
  ];
}

export default function OrderReceiptVoucherPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Cargando comprobante...</div>}>
      <VoucherClient />
    </Suspense>
  );
}
