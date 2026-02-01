export type Sale = {
  id: string;
  dealCloseDate?: string;
  customer: string;
  employee: string;
  productService?: string;
  category: string;
  contractType: string;
  billType: string | number;
  amountQAR: number;
  costQAR: number;
  paymentStatus: string | number;
  gp: number;
  gpPercentage: number;
};

export type ChartDatum = {
  name: string;
  value: number;
};

export type StageDatum = {
  stage: string;
  value: number;
};

export type CustomerDatum = {
  customer: string;
  revenue: number;
};