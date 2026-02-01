"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "@/components/ui/ChartCard";

export type SalesTrendDatum = {
  month: string;
  value: number;
};

export function SalesTrendChart({
  data,
}: {
  data: SalesTrendDatum[];
}) {
  return (
    <ChartCard title="Sales Trend">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="month"
            stroke="var(--color-muted-foreground)"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="var(--color-muted-foreground)"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `$${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #1f2937",
              color: "#e5e7eb",
            }}
            formatter={(value: number | undefined) => {
              if (value === undefined) return ["$0", "Revenue"];
              return [`$${value.toLocaleString()}`, "Revenue"];
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--primary)" // Use the primary theme color
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--primary)", strokeWidth: 2, stroke: "var(--background)" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
