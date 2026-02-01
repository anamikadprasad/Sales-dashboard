export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joinDate: string;
  status: "active" | "inactive";
  active: boolean;
  targetQARPerMonth: number;
  actions: string;
};