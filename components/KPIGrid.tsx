"use client";

import { KPI } from "@/components/ui/KPI";

export function KPIGrid({
  totalSales,
  totalGP,
  gpPct,
  deals,
  topEmployee,
  topCategory,
}: {
  totalSales: number;
  totalGP: number;
  gpPct: string;
  deals: number;
  topEmployee: string;
  topCategory: string;
}) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPI title="Total Sales" value={`$${totalSales.toLocaleString()}`} />
      <KPI title="Total GP" value={`$${totalGP.toLocaleString()}`} />
      <KPI title="GP %" value={`${gpPct}%`} />
      <KPI title="Deals" value={deals} />
      <KPI title="Top Employee" value={topEmployee} />
      <KPI title="Top Category" value={topCategory} />
    </div>
  );
}
