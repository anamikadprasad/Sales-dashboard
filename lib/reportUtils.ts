import { Sale } from "@/types/sales";
import { ReportFilters, ReportType } from "@/types/reports";

export function getYearMonthFromDate(date?: string) {
  if (!date) return { year: null as number | null, month: null as number | null };
  const [y, m] = date.split("-").map((x) => Number(x));
  if (!y || !m) return { year: null, month: null };
  return { year: y, month: m };
}

export function filterSales(data: Sale[], filters: ReportFilters) {
  return data.filter((s) => {
    const { year, month } = getYearMonthFromDate(s.dealCloseDate);

    if (filters.employee !== "All" && s.employee !== filters.employee) return false;
    if (filters.category !== "All" && s.category !== filters.category) return false;

    if (filters.year !== "All" && year !== filters.year) return false;
    if (filters.month !== "All" && month !== filters.month) return false;

    return true;
  });
}

export function computeSalesKPIs(filteredSales: Sale[]) {
  const totalSales = filteredSales.reduce((sum, s) => sum + (s.amountQAR || 0), 0);
  const totalGP = filteredSales.reduce((sum, s) => sum + (s.gp || 0), 0);
  const dealsClosed = filteredSales.length;

  const gpPercent = totalSales > 0 ? (totalGP / totalSales) * 100 : 0;

  return { totalSales, totalGP, gpPercent, dealsClosed };
}

export function formatSelectedPeriod(reportType: ReportType, filters: ReportFilters) {
  if (reportType === "monthly") {
    const y = filters.year === "All" ? "All Years" : String(filters.year);
    const m = filters.month === "All" ? "All Months" : String(filters.month).padStart(2, "0");
    return `${y}-${m}`;
  }
  return filters.year === "All" ? "All Years" : String(filters.year);
}

// NEW: Build chart data for SalesByEmployeeChart
export function buildSalesByEmployeeData(sales: Sale[]) {
  const grouped = sales.reduce<Record<string, number>>((acc, s) => {
    acc[s.employee] = (acc[s.employee] || 0) + s.amountQAR;
    return acc;
  }, {});

  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}

// NEW: Build chart data for SalesTrendChart
export function buildSalesTrendData(sales: Sale[]) {
  const grouped = sales.reduce<Record<string, number>>((acc, s) => {
    const { year, month } = getYearMonthFromDate(s.dealCloseDate);
    if (!year || !month) return acc;
    const key = `${year}-${String(month).padStart(2, "0")}`;
    acc[key] = (acc[key] || 0) + s.amountQAR;
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month, value }));
}