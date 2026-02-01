"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ChartCard } from "@/components/ui/ChartCard";

export type CategoryDatum = {
  category: string;
  value: number;
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function RevenueByCategoryChart({
  data,
  chartType = "bar",
}: {
  data: CategoryDatum[];
  chartType?: "bar" | "pie";
}) {
  return (
    <ChartCard title="Revenue by Product Category">
      {chartType === "bar" ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="category"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number | undefined) => {
                if (value === undefined) return ["$0", "Revenue"];
                return [`$${value.toLocaleString()}`, "Revenue"];
              }}
            />
            <Bar dataKey="value" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => {
                const displayName = name || "Unknown";
                const displayPercent = percent ? (percent * 100).toFixed(0) : "0";
                return `${displayName}: ${displayPercent}%`;
              }}
              outerRadius={80}
              fill="var(--chart-1)"
              dataKey="value"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number | undefined) => {
                if (value === undefined) return ["$0", "Revenue"];
                return [`$${value.toLocaleString()}`, "Revenue"];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}