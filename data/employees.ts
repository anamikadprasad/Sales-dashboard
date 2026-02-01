import { Employee } from "@/types/employees";

export const employeesData: Employee[] = [
  {
    id: "EMP001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    department: "Sales",
    role: "Account Manager",  
    active: true,
    targetQARPerMonth: 250000,
    joinDate: "2023-01-15",
    status: "active",
    actions: "View Profile",
  },
  {
    id: "EMP002",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "098-765-4321",
    department: "Sales",
    role: "Sales Executive",  
    active: true,
    targetQARPerMonth: 150000,
    joinDate: "2022-11-20",
    status: "active",
    actions: "View Profile",
  },
  {
    id: "EMP003",
    name: "Akhil Aliyar",
    email: "akhil.aliyar@example.com",
    phone: "555-123-4567",
    department: "Sales",
    role: "Account Manager",  
    active: true,
    targetQARPerMonth: 300000,
    joinDate: "2021-06-10",
    status: "active",
    actions: "View Profile",
  }
];
