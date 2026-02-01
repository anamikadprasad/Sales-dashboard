export type Opportunity = {
  id: string;
  customerName: string;
  assignedTo: string;
  stage: "Qualification" | "Proposal Sent" | "Negotiation" | "Closed Won" | "Closed Lost";
  probability: number;
  expectedCloseDate: string;
  expectedValueQAR: number;
  category: string;
};