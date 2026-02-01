"use client";

import { useMemo, useState } from "react";
import { salesData } from "@/data/sales";
import { KPIGrid } from "@/components/KPIGrid";
import { SalesByEmployeeChart } from "@/components/charts/SalesByEmployeeChart";
import { TopCustomersTable } from "@/components/tables/TopCustomersTable";
import { SalesTrendChart } from "@/components/charts/SalesTrendChart";
import { PipelineByStageChart } from "@/components/charts/PipelineByStageChart";
import { RevenueByCategoryChart } from "@/components/charts/RevenueByCategoryChart";
import { CustomerDatum } from "@/types/sales";
import { ChartCard } from "@/components/ui/ChartCard";

const MONTHS = [
  { label: "All", value: "All" },
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

export default function SalesDashboard() {
  const [filterEmployee, setFilterEmployee] = useState<string>("All");
  const [filterMonth, setFilterMonth] = useState<string>("All");
  const [filterYear, setFilterYear] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  // Extract unique values for filters
  const employees = useMemo(
    () => ["All", ...Array.from(new Set(salesData.map((s) => s.employee)))],
    []
  );

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(salesData.map((s) => s.category)))],
    []
  );

  const years = useMemo(() => {
    const ys = new Set<string>();
    for (const s of salesData) {
      if (!s.dealCloseDate) continue;
      const y = s.dealCloseDate.split("-")[0];
      if (y) ys.add(y);
    }
    return ["All", ...Array.from(ys).sort()];
  }, []);

  // Filter sales data
  const filteredData = useMemo(() => {
    return salesData.filter((sale) => {
      const matchesEmployee = filterEmployee === "All" || sale.employee === filterEmployee;
      const matchesCategory = filterCategory === "All" || sale.category === filterCategory;

      let matchesMonth = true;
      let matchesYear = true;

      if (sale.dealCloseDate) {
        const [year, month] = sale.dealCloseDate.split("-");

        if (filterMonth !== "All") {
          matchesMonth = month === filterMonth;
        }

        if (filterYear !== "All") {
          matchesYear = year === filterYear;
        }
      }

      return matchesEmployee && matchesCategory && matchesMonth && matchesYear;
    });
  }, [filterEmployee, filterMonth, filterYear, filterCategory]);

  // Reset filters
  const handleResetFilters = () => {
    setFilterEmployee("All");
    setFilterMonth("All");
    setFilterYear("All");
    setFilterCategory("All");
  };

  // 1. KPI calculations
  const totalSales = filteredData.reduce((s, d) => s + d.amountQAR, 0);
  const totalGP = filteredData.reduce((s, d) => s + (d.amountQAR - d.costQAR), 0);

  // 2. Sales by Employee
  const salesByEmployee = Object.values(
    filteredData.reduce<Record<string, { name: string; value: number }>>(
      (acc, d) => {
        acc[d.employee] ??= { name: d.employee, value: 0 };
        acc[d.employee].value += d.amountQAR;
        return acc;
      },
      {}
    )
  );

  // 3. Sales Trend (Extracting month from dealCloseDate)
  const salesTrend = Object.values(
    filteredData.reduce<Record<string, { month: string; value: number }>>(
      (acc, d) => {
        const month = d.dealCloseDate ? d.dealCloseDate.split("-")[1] : "01";
        const key = `M${month}`;
        acc[key] ??= { month: key, value: 0 };
        acc[key].value += d.amountQAR;
        return acc;
      },
      {}
    )
  );

  // 4. Pipeline (Using contractType as stage)
  const pipelineByStage = Object.values(
    filteredData.reduce<Record<string, { stage: string; value: number }>>(
      (acc, d) => {
        const stage = d.contractType;
        acc[stage] ??= { stage: stage, value: 0 };
        acc[stage].value += d.amountQAR;
        return acc;
      },
      {}
    )
  );

  // 5. Revenue by Category
  const revenueByCategory = Object.values(
    filteredData.reduce<Record<string, { category: string; value: number }>>(
      (acc, d) => {
        acc[d.category] ??= { category: d.category, value: 0 };
        acc[d.category].value += d.amountQAR;
        return acc;
      },
      {}
    )
  );

  // 6. Top Customers
  const topCustomers: CustomerDatum[] = useMemo(() => {
    const reduced = filteredData.reduce<Record<string, CustomerDatum>>(
      (acc, d) => {
        if (!acc[d.customer]) {
          acc[d.customer] = { customer: d.customer, revenue: 0 };
        }
        acc[d.customer].revenue += d.amountQAR;
        return acc;
      },
      {}
    );
    return Object.values(reduced)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold">Sales Dashboard</h1>

      {/* Filters Section */}
      <ChartCard title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Employee Filter */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Employee
            </label>
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {employees.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Month
            </label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Year
            </label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2 bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing{" "}
          <span className="text-foreground font-medium">
            {filteredData.length}
          </span>{" "}
          of{" "}
          <span className="text-foreground font-medium">{salesData.length}</span>{" "}
          sales orders
        </div>
      </ChartCard>

      {/* KPIs */}
      <KPIGrid
        totalSales={totalSales}
        totalGP={totalGP}
        gpPct="30.0"
        deals={filteredData.length}
        topEmployee={salesByEmployee[0]?.name ?? "-"}
        topCategory="-"
      />

      {/* Row 1: Sales by Employee + Sales Trend */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <SalesByEmployeeChart data={salesByEmployee} />
        </div>
        <div className="flex-1">
          <SalesTrendChart data={salesTrend} />
        </div>
      </div>

      {/* Row 2: Pipeline by Stage + Revenue by Category */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <PipelineByStageChart data={pipelineByStage} />
        </div>
        <div className="flex-1">
          <RevenueByCategoryChart data={revenueByCategory} chartType="bar" />
        </div>
      </div>

      {/* Row 3: Top Customers */}
      <TopCustomersTable customers={topCustomers} />
    </div>
  );
}