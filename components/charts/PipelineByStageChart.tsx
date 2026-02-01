"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "@/components/ui/ChartCard";

export type PipelineStageDatum = {
  stage: string;
  value: number;
};

export function PipelineByStageChart({
  data,
}: {
  data: PipelineStageDatum[];
}) {
  return (
    <ChartCard title="Pipeline by Stage">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="stage"
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
              if (value === undefined) return ["$0", "Value"];
              return [`$${value.toLocaleString()}`, "Value"];
            }}
          />
          <Bar
            dataKey="value"
            fill="var(--chart-2)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}