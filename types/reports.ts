export type ReportType = "monthly" | "yearly";

export type ReportFormat = "csv" | "html" | "pdf";

export type ReportFilters = {
  employee: string;        // "All" or exact name
  category: string;        // "All" or exact category
  month: number | "All";   // 1..12 or "All"
  year: number | "All";    // e.g. 2026 or "All"
};