"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/components/ui/ChartCard";

type Datum = { name: string; value: number };

export function SalesByEmployeeChart({ data }: { data: Datum[] }) {
  return (
    <ChartCard title="Sales by Employee">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: number | undefined) => {
              if (value === undefined || value === null || isNaN(value)) return ["$0", "Sales"];
              return [`$${value.toLocaleString()}`, "Sales"];
            }}
            contentStyle={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            itemStyle={{ color: "var(--primary)" }}
          />
          <Bar 
            dataKey="value" 
            fill="var(--primary)" // Or var(--chart-1)
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
