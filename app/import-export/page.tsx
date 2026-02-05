"use client";

import { useMemo, useState } from "react";
import { salesData } from "@/data/sales";
import { filterSales, computeSalesKPIs, formatSelectedPeriod } from "@/lib/reportUtils";
import { buildCsv, downloadTextFile } from "@/lib/csv";
import { ReportFilters, ReportFormat, ReportType } from "@/types/reports";
import { ChartCard } from "@/components/ui/ChartCard";
import { opportunitiesData } from "@/data/opportunities"; 

const MONTHS = [
  { label: "All", value: "All" },
  { label: "01", value: 1 }, { label: "02", value: 2 }, { label: "03", value: 3 },
  { label: "04", value: 4 }, { label: "05", value: 5 }, { label: "06", value: 6 },
  { label: "07", value: 7 }, { label: "08", value: 8 }, { label: "09", value: 9 },
  { label: "10", value: 10 }, { label: "11", value: 11 }, { label: "12", value: 12 },
];

export default function ImportExportPage() {
  const [reportType, setReportType] = useState<ReportType>("monthly");

  const [filters, setFilters] = useState<ReportFilters>({
    employee: "All",
    category: "All",
    month: "All",
    year: "All",
  });

  const employees = useMemo(() => ["All", ...Array.from(new Set(salesData.map((s) => s.employee)))], []);
  const categories = useMemo(() => ["All", ...Array.from(new Set(salesData.map((s) => s.category)))], []);
  const years = useMemo(() => {
    const ys = new Set<number>();
    for (const s of salesData) {
      if (!s.dealCloseDate) continue;
      const y = Number(s.dealCloseDate.split("-")[0]);
      if (y) ys.add(y);
    }
    return ["All", ...Array.from(ys).sort((a, b) => a - b)];
  }, []);

  const filteredSales = useMemo(() => filterSales(salesData, filters), [filters]);
  const kpis = useMemo(() => computeSalesKPIs(filteredSales), [filteredSales]);

  const selectedPeriod = formatSelectedPeriod(reportType, filters);

  // Filter opportunities based on current filters
  const filteredOpportunities = useMemo(() => {
    return opportunitiesData.filter(opp => 
      (filters.employee === "All" || opp.assignedTo === filters.employee) &&
      (filters.category === "All" || opp.category === filters.category)
    );
  }, [filters]);

  const buildReportQuery = () => {
    const params = new URLSearchParams();
    params.set("type", reportType);
    params.set("employee", filters.employee);
    params.set("category", filters.category);
    params.set("month", String(filters.month));
    params.set("year", String(filters.year));
    return params.toString();
  };

  const exportCsv = () => {
    // Minimum requirement: sales orders table at least
    const rows = filteredSales.map((s) => ({
      id: s.id,
      dealCloseDate: s.dealCloseDate || "",
      customer: s.customer,
      employee: s.employee,
      productService: s.productService || "",
      category: s.category,
      contractType: s.contractType,
      billType: s.billType,
      amountQAR: s.amountQAR,
      costQAR: s.costQAR,
      gp: s.gp,
      gpPercentage: s.gpPercentage,
      paymentStatus: s.paymentStatus,
    }));

    const csv = buildCsv(rows);
    const fileName = `report_${reportType}_${selectedPeriod}.csv`;
    downloadTextFile(fileName, csv, "text/csv;charset=utf-8");
  };

  const exportHtml = () => {
  const generatedAt = new Date().toLocaleString();

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Report ${reportType} ${selectedPeriod}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: white; }
    h1 { margin: 0 0 8px; text-transform: uppercase; }
    h2 { margin: 24px 0 12px; text-transform: uppercase; border-bottom: 2px solid black; padding-bottom: 4px; }
    .meta { color: #555; font-size: 12px; margin-bottom: 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .kpi { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0; }
    .kpi div { border: 1px solid #ddd; padding: 12px; border-radius: 8px; background: #f9f9f9; }
    .kpi div span { display: block; font-size: 10px; color: #666; text-transform: uppercase; }
    .kpi div b { display: block; font-size: 20px; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin: 16px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; font-weight: bold; text-transform: uppercase; }
    .right { text-align: right; }
    @media print { 
      @page { size: A4; margin: 12mm; } 
      tr { page-break-inside: avoid; } 
      thead { display: table-header-group; }
      h2 { page-break-before: always; }
    }
  </style>
</head>
<body>
  <h1>Sales Performance Report</h1>
  <div class="meta">
    <div><b>Report Type:</b> ${reportType}</div>
    <div><b>Selected Period:</b> ${selectedPeriod}</div>
    <div><b>Generated:</b> ${generatedAt}</div>
  </div>

  <h2>KPI Summary</h2>
  <div class="kpi">
    <div><span>Total Sales (QAR)</span><b>QAR ${kpis.totalSales.toLocaleString()}</b></div>
    <div><span>Total GP (QAR)</span><b>QAR ${kpis.totalGP.toLocaleString()}</b></div>
    <div><span>GP%</span><b>${kpis.gpPercent.toFixed(2)}%</b></div>
    <div><span>Deals Closed</span><b>${kpis.dealsClosed}</b></div>
  </div>

  <h2>Sales Orders (Mandatory)</h2>
  <table>
    <thead>
      <tr>
        <th>ID</th><th>Date</th><th>Customer</th><th>Employee</th><th>Product/Service</th>
        <th>Category</th><th class="right">Amount</th><th class="right">Cost</th><th class="right">GP</th><th class="right">GP%</th><th>Payment</th>
      </tr>
    </thead>
    <tbody>
      ${filteredSales.map((s) => `
        <tr>
          <td>${s.id}</td>
          <td>${s.dealCloseDate || ""}</td>
          <td>${s.customer}</td>
          <td>${s.employee}</td>
          <td>${s.productService || ""}</td>
          <td>${s.category}</td>
          <td class="right">${s.amountQAR.toLocaleString()}</td>
          <td class="right">${s.costQAR.toLocaleString()}</td>
          <td class="right">${s.gp.toLocaleString()}</td>
          <td class="right">${Number(s.gpPercentage).toFixed(2)}</td>
          <td>${String(s.paymentStatus)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <h2>Opportunities Pipeline</h2>
  <table>
    <thead>
      <tr>
        <th>ID</th><th>Customer</th><th>Assigned To</th><th>Stage</th><th class="right">Probability %</th><th class="right">Expected Value</th><th>Expected Close</th><th>Category</th>
      </tr>
    </thead>
    <tbody>
      ${filteredOpportunities.map((opp) => `
        <tr>
          <td>${opp.id}</td>
          <td>${opp.customerName}</td>
          <td>${opp.assignedTo}</td>
          <td>${opp.stage}</td>
          <td class="right">${opp.probability}%</td>
          <td class="right">${opp.expectedValueQAR.toLocaleString()}</td>
          <td>${opp.expectedCloseDate}</td>
          <td>${opp.category}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
</body>
</html>`;

  const fileName = `report_${reportType}_${selectedPeriod}.html`;
  downloadTextFile(fileName, html, "text/html;charset=utf-8");
};

  const exportPdf = () => {
    // Open the report page (print-friendly) with same filters, then user uses Print -> Save as PDF
    const url = `/reports?${buildReportQuery()}`;
    window.open(url, "_blank");
  };

  const handleExport = (format: ReportFormat) => {
    if (format === "csv") return exportCsv();
    if (format === "html") return exportHtml();
    return exportPdf();
  };

  const resetFilters = () => {
    setFilters({ employee: "All", category: "All", month: "All", year: "All" });
    setReportType("monthly");
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-6 space-y-6">
      <h1 className="text-3xl font-bold">Import / Export Reports</h1>

      {/* Slicer-style Filters */}
      <ChartCard title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Employee</label>
            <select
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md"
              value={filters.employee}
              onChange={(e) => setFilters((p) => ({ ...p, employee: e.target.value }))}
            >
              {employees.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Month</label>
            <select
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md"
              value={String(filters.month)}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  month: e.target.value === "All" ? "All" : Number(e.target.value),
                }))
              }
            >
              {MONTHS.map((m) => (
                <option key={String(m.value)} value={String(m.value)}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Year</label>
            <select
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md"
              value={String(filters.year)}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  year: e.target.value === "All" ? "All" : Number(e.target.value),
                }))
              }
            >
              {years.map((y) => <option key={String(y)} value={String(y)}>{y}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Product Category</label>
            <select
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md"
              value={filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md hover:bg-accent"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </ChartCard>

      {/* Report Type + Export */}
      <ChartCard title="Export">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setReportType("monthly")}
              className={`px-3 py-2 rounded-md border border-border ${reportType === "monthly" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setReportType("yearly")}
              className={`px-3 py-2 rounded-md border border-border ${reportType === "yearly" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            >
              Yearly
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleExport("csv")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport("html")}
              className="px-4 py-2 border border-border rounded-md hover:bg-accent"
            >
              Export HTML
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="px-4 py-2 border border-border rounded-md hover:bg-accent"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Current selection: <span className="text-foreground font-medium">{reportType}</span>, period{" "}
          <span className="text-foreground font-medium">{selectedPeriod}</span>, rows{" "}
          <span className="text-foreground font-medium">{filteredSales.length}</span>
        </div>
      </ChartCard>

      {/* KPI PREVIEW */}
      <ChartCard title="KPI Summary Preview">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-accent/30 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground uppercase">Total Sales (QAR)</p>
            <p className="text-2xl font-bold mt-1">QAR {kpis.totalSales.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-accent/30 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground uppercase">Total GP (QAR)</p>
            <p className="text-2xl font-bold mt-1">QAR {kpis.totalGP.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-accent/30 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground uppercase">GP%</p>
            <p className="text-2xl font-bold mt-1">{kpis.gpPercent.toFixed(2)}%</p>
          </div>
          <div className="p-4 bg-accent/30 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground uppercase">Deals Closed</p>
            <p className="text-2xl font-bold mt-1">{kpis.dealsClosed}</p>
          </div>
        </div>
      </ChartCard>

      {/* SALES ORDERS PREVIEW */}
      <ChartCard title={`Sales Orders Preview`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-3 text-muted-foreground">ID</th>
                <th className="text-left p-3 text-muted-foreground">Date</th>
                <th className="text-left p-3 text-muted-foreground">Customer</th>
                <th className="text-left p-3 text-muted-foreground">Employee</th>
                <th className="text-left p-3 text-muted-foreground">Product/Service</th>
                <th className="text-left p-3 text-muted-foreground">Category</th>
                <th className="text-right p-3 text-muted-foreground">Amount (QAR)</th>
                <th className="text-right p-3 text-muted-foreground">Cost (QAR)</th>
                <th className="text-right p-3 text-muted-foreground">GP (QAR)</th>
                <th className="text-right p-3 text-muted-foreground">GP%</th>
                <th className="text-left p-3 text-muted-foreground">Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-6 text-center text-muted-foreground">
                    No sales orders found for the selected filters
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-border hover:bg-accent/50">
                    <td className="p-3 font-medium">{sale.id}</td>
                    <td className="p-3">{sale.dealCloseDate || "—"}</td>
                    <td className="p-3">{sale.customer}</td>
                    <td className="p-3">{sale.employee}</td>
                    <td className="p-3">{sale.productService || "—"}</td>
                    <td className="p-3">{sale.category}</td>
                    <td className="p-3 text-right">{sale.amountQAR.toLocaleString()}</td>
                    <td className="p-3 text-right">{sale.costQAR.toLocaleString()}</td>
                    <td className="p-3 text-right">{sale.gp.toLocaleString()}</td>
                    <td className="p-3 text-right">{Number(sale.gpPercentage).toFixed(2)}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        sale.paymentStatus === "Paid" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {sale.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* OPPORTUNITIES PREVIEW */}
      <ChartCard title={`Opportunities Pipeline Preview`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-3 text-muted-foreground">ID</th>
                <th className="text-left p-3 text-muted-foreground">Customer</th>
                <th className="text-left p-3 text-muted-foreground">Assigned To</th>
                <th className="text-left p-3 text-muted-foreground">Stage</th>
                <th className="text-right p-3 text-muted-foreground">Probability %</th>
                <th className="text-right p-3 text-muted-foreground">Expected Value (QAR)</th>
                <th className="text-left p-3 text-muted-foreground">Expected Close</th>
                <th className="text-left p-3 text-muted-foreground">Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpportunities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-muted-foreground">
                    No opportunities found for the selected filters
                  </td>
                </tr>
              ) : (
                filteredOpportunities.map((opp) => (
                  <tr key={opp.id} className="border-b border-border hover:bg-accent/50">
                    <td className="p-3 font-medium">{opp.id}</td>
                    <td className="p-3">{opp.customerName}</td>
                    <td className="p-3">{opp.assignedTo}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                        {opp.stage}
                      </span>
                    </td>
                    <td className="p-3 text-right">{opp.probability}%</td>
                    <td className="p-3 text-right">{opp.expectedValueQAR.toLocaleString()}</td>
                    <td className="p-3">{opp.expectedCloseDate}</td>
                    <td className="p-3">{opp.category}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}