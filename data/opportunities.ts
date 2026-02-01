import { Opportunity } from "@/types/opportunities";

export const opportunitiesData: Opportunity[] = [
  {
    id: "OPP001",
    customerName: "MedTech",
    assignedTo: "John Doe",
    stage: "Proposal Sent",
    probability: 70,
    expectedCloseDate: "2026-02-10",
    expectedValueQAR: 350000,
    category: "NDR",
  },
  {
    id: "OPP002",
    customerName: "QAFAC",
    assignedTo: "Akhil Aliyar",
    stage: "Negotiation",
    probability: 80,
    expectedCloseDate: "2026-02-05",
    expectedValueQAR: 500000,
    category: "PAM",
  },
  {
    id: "OPP003",
    customerName: "Al Ahli Hospital",
    assignedTo: "Jane Doe",
    stage: "Qualification",
    probability: 40,
    expectedCloseDate: "2026-03-01",
    expectedValueQAR: 180000,
    category: "GRC",
  },
];