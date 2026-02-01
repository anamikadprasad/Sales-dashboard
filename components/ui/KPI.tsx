"use client";

export function KPI({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold tracking-tight text-primary">{value}</p>
    </div>
  );
}
