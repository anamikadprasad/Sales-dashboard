"use client";

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold leading-none tracking-tight mb-6">{title}</h3>
      {children}
    </div>
  );
}
