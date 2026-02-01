"use client";

import { ChartCard } from "@/components/ui/ChartCard";
import { CustomerDatum } from "@/types/sales"; // Import from types/sales.ts

export function TopCustomersTable({
  customers,
}: {
  customers: CustomerDatum[];
}) {
  // Sort by revenue descending and take top 5
  const topCustomers = [...customers]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <ChartCard title="Top Customers">
      {topCustomers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No customer data available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-3 font-semibold text-muted-foreground">
                  Rank
                </th>
                <th className="text-left p-3 font-semibold text-muted-foreground">
                  Customer
                </th>
                <th className="text-right p-3 font-semibold text-muted-foreground">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c, index) => (
                <tr
                  key={c.customer}
                  className="border-b border-border hover:bg-accent/50 transition-colors"
                >
                  <td className="p-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </span>
                  </td>
                  <td className="p-3 font-medium">{c.customer}</td>
                  <td className="p-3 text-right font-semibold text-primary">
                    ${c.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ChartCard>
  );
} 