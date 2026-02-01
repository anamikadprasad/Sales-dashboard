"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { salesData } from "@/data/sales";
import { opportunitiesData } from "@/data/opportunities";
import { filterSales, computeSalesKPIs, formatSelectedPeriod, buildSalesByEmployeeData, buildSalesTrendData } from "@/lib/reportUtils";
import { ReportFilters, ReportType } from "@/types/reports";
import { SalesByEmployeeChart } from "@/components/charts/SalesByEmployeeChart";
import { SalesTrendChart } from "@/components/charts/SalesTrendChart";

function parseFiltersFromQuery(sp: ReturnType<typeof useSearchParams>): { reportType: ReportType; filters: ReportFilters } {
  const reportType = (sp.get("type") as ReportType) || "monthly";

  const employee = sp.get("employee") || "All";
  const category = sp.get("category") || "All";
  const monthRaw = sp.get("month") || "All";
  const yearRaw = sp.get("year") || "All";

  const month = monthRaw === "All" ? "All" : Number(monthRaw);
  const year = yearRaw === "All" ? "All" : Number(yearRaw);

  return {
    reportType,
    filters: {
      employee,
      category,
      month: Number.isFinite(month as number) ? (month as number) : "All",
      year: Number.isFinite(year as number) ? (year as number) : "All",
    },
  };
}

export default function ReportsPage() {
  const sp = useSearchParams();
  const { reportType, filters } = useMemo(() => parseFiltersFromQuery(sp), [sp]);

  const filteredSales = useMemo(() => filterSales(salesData, filters), [filters]);
  const kpis = useMemo(() => computeSalesKPIs(filteredSales), [filteredSales]);

  const selectedPeriod = formatSelectedPeriod(reportType, filters);
  const generatedAt = new Date().toLocaleString();

  // Filter opportunities by employee and category
  const filteredOpportunities = useMemo(() => {
    return opportunitiesData.filter((opp) => {
      if (filters.employee !== "All" && opp.assignedTo !== filters.employee) return false;
      if (filters.category !== "All" && opp.category !== filters.category) return false;
      return true;
    });
  }, [filters]);

  // Chart data
  const salesByEmployeeData = useMemo(() => buildSalesByEmployeeData(filteredSales), [filteredSales]);
  const salesTrendData = useMemo(() => buildSalesTrendData(filteredSales), [filteredSales]);

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Print CSS */}
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          .no-print { display: none !important; }
          .page-break { break-after: page; page-break-after: always; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          body { background: white; }
        }
        @media screen {
          body { background: #f5f5f5; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-8">
        {/* No-print buttons */}
        <div className="no-print mb-6 flex gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Print / Save PDF
          </button>
          <a
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            href="/import-export"
          >
            ← Back to Import/Export
          </a>
        </div>

        {/* Header */}
        <div className="border-2 border-black rounded-lg p-6 bg-gray-50 mb-6">
          <h1 className="text-3xl font-bold uppercase mb-3">Sales Performance Report</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div><span className="font-semibold">Report Type:</span> {reportType}</div>
            <div><span className="font-semibold">Selected Period:</span> {selectedPeriod}</div>
            <div><span className="font-semibold">Generated:</span> {generatedAt}</div>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="border-2 border-black rounded-lg p-6 bg-white mb-6">
          <h2 className="text-xl font-bold mb-4 uppercase">KPI Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-gray-300 p-4 rounded">
              <div className="text-xs text-gray-600 uppercase">Total Sales (QAR)</div>
              <div className="text-2xl font-bold mt-1">QAR {kpis.totalSales.toLocaleString()}</div>
            </div>
            <div className="border border-gray-300 p-4 rounded">
              <div className="text-xs text-gray-600 uppercase">Total GP (QAR)</div>
              <div className="text-2xl font-bold mt-1">QAR {kpis.totalGP.toLocaleString()}</div>
            </div>
            <div className="border border-gray-300 p-4 rounded">
              <div className="text-xs text-gray-600 uppercase">GP%</div>
              <div className="text-2xl font-bold mt-1">{kpis.gpPercent.toFixed(2)}%</div>
            </div>
            <div className="border border-gray-300 p-4 rounded">
              <div className="text-xs text-gray-600 uppercase">Deals Closed</div>
              <div className="text-2xl font-bold mt-1">{kpis.dealsClosed}</div>
            </div>
          </div>
        </div>

        {/* Sales Orders Table (Mandatory) */}
        <div className="border-2 border-black rounded-lg p-6 bg-white mb-6">
          <h2 className="text-xl font-bold mb-4 uppercase">Sales Orders (Mandatory)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-black bg-gray-100">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">Product/Service</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Cost</th>
                  <th className="p-3 text-right">GP</th>
                  <th className="p-3 text-right">GP%</th>
                  <th className="p-3 text-left">Payment</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((s) => (
                  <tr key={s.id} className="border-b border-gray-200">
                    <td className="p-3 font-mono text-xs">{s.id}</td>
                    <td className="p-3">{s.dealCloseDate || "-"}</td>
                    <td className="p-3">{s.customer}</td>
                    <td className="p-3">{s.employee}</td>
                    <td className="p-3">{s.productService || "-"}</td>
                    <td className="p-3">{s.category}</td>
                    <td className="p-3 text-right font-semibold">QAR {s.amountQAR.toLocaleString()}</td>
                    <td className="p-3 text-right">QAR {s.costQAR.toLocaleString()}</td>
                    <td className="p-3 text-right font-semibold">QAR {s.gp.toLocaleString()}</td>
                    <td className="p-3 text-right">{s.gpPercentage.toFixed(2)}%</td>
                    <td className="p-3">{String(s.paymentStatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Page break before opportunities */}
        <div className="page-break" />

        {/* Opportunities Table */}
        <div className="border-2 border-black rounded-lg p-6 bg-white mb-6">
          <h2 className="text-xl font-bold mb-4 uppercase">Opportunities Pipeline</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-black bg-gray-100">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Assigned To</th>
                  <th className="p-3 text-left">Stage</th>
                  <th className="p-3 text-right">Probability %</th>
                  <th className="p-3 text-right">Expected Value</th>
                  <th className="p-3 text-left">Expected Close</th>
                  <th className="p-3 text-left">Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpportunities.map((opp) => (
                  <tr key={opp.id} className="border-b border-gray-200">
                    <td className="p-3 font-mono text-xs">{opp.id}</td>
                    <td className="p-3">{opp.customerName}</td>
                    <td className="p-3">{opp.assignedTo}</td>
                    <td className="p-3">{opp.stage}</td>
                    <td className="p-3 text-right">{opp.probability}%</td>
                    <td className="p-3 text-right font-semibold">QAR {opp.expectedValueQAR.toLocaleString()}</td>
                    <td className="p-3">{opp.expectedCloseDate}</td>
                    <td className="p-3">{opp.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Page break before charts */}
        <div className="page-break" />

        {/* Charts Snapshot */}
        <div className="border-2 border-black rounded-lg p-6 bg-white">
          <h2 className="text-xl font-bold mb-4 uppercase">Charts Snapshot</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-300 rounded-lg p-4">
              <SalesByEmployeeChart data={salesByEmployeeData} />
            </div>

            <div className="border border-gray-300 rounded-lg p-4">
              <SalesTrendChart data={salesTrendData} />
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            Note: Charts are included in HTML/PDF export only.
          </div>
        </div>
      </div>
    </div>
  );
}