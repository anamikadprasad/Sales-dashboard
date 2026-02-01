"use client";

import { useState, useMemo } from "react";
import { ChartCard } from "@/components/ui/ChartCard";
import { Employee } from "@/types/employees";
import { employeesData } from "@/data/employees";
import { validateEmployee, EmployeeFormData, ValidationErrors } from "@/lib/validation";


export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(employeesData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterActive, setFilterActive] = useState("All");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<Omit<Employee, "id">>({
    name: "",
    email: "",
    phone: "",
    department: "Sales",
    role: "",
    joinDate: new Date().toISOString().split("T")[0],
    status: "active",
    active: true,
    targetQARPerMonth: 0,
    actions: "",
  });

  const departments = useMemo(
    () => ["All", ...new Set(employees.map((e) => e.department))],
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = filterDept === "All" || emp.department === filterDept;
      return matchesSearch && matchesDept;
    });
  }, [employees, searchTerm, filterDept]);

 const handleAddClick = () => {
    setEditingId(null);
    setErrors({}); // Clear errors
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "Sales",
      role: "",
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
      active: true,
      targetQARPerMonth: 0,
      actions: "",
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      joinDate: employee.joinDate,
      status: employee.status,
      active: employee.active,
      targetQARPerMonth: employee.targetQARPerMonth,
      actions: employee.actions,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateEmployee(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop submission
    }

    // Clear errors if validation passes
    setErrors({});

    if (editingId) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingId ? { ...emp, ...formData } : emp
        )
      );
    } else {
      const newEmployee: Employee = {
        id: `EMP${String(Math.max(...employees.map((e) => parseInt(e.id.replace('EMP', '')) || 0), 0) + 1).padStart(3, '0')}`,
        ...formData,
      };
      setEmployees([...employees, newEmployee]);
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Employees</h1>
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
          >
            + Add Employee
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-64 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <ChartCard
              title={editingId ? "Edit Employee" : "Add New Employee"}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`w-full px-3 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.name ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`w-full px-3 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.email ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={`w-full px-3 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.phone ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* Department Field */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Department *</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className={`w-full px-3 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.department ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                  </div>

                  {/* Position Field */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Position *</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className={`w-full px-3 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.role ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                  </div>

                  {/* Join Date Field */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Join Date *</label>
                    <input
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) =>
                        setFormData({ ...formData, joinDate: e.target.value })
                      }
                      className={`w-full px-3 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.joinDate ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.joinDate && <p className="text-red-500 text-xs mt-1">{errors.joinDate}</p>}
                  </div>

                  {/* Status Field */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "active" | "inactive",
                        })
                      }
                      className={`w-full px-3 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.status ? "border-red-500" : "border-border"
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setErrors({}); // Clear errors when closing
                    }}
                    className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:opacity-80 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                  >
                    {editingId ? "Update" : "Add"} Employee
                  </button>
                </div>
              </form>
            </ChartCard>
          </div>
        )}

        {/* Table */}
        <ChartCard title={`Employees (${filteredEmployees.length})`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-3 font-semibold text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">
                    Email
                  </th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">
                    Phone
                  </th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">
                    Department
                  </th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">
                    Position
                  </th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">
                    Join Date
                  </th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-muted-foreground">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="p-3 font-medium">{emp.name}</td>
                      <td className="p-3 text-muted-foreground">{emp.email}</td>
                      <td className="p-3 text-muted-foreground">{emp.phone}</td>
                      <td className="p-3">{emp.department}</td>
                      <td className="p-3">{emp.role}</td>
                      <td className="p-3 text-muted-foreground">{emp.joinDate}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            emp.status === "active"
                              ? "bg-green-500/20 text-green-700 dark:text-green-400"
                              : "bg-red-500/20 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleEditClick(emp)}
                          className="text-primary hover:underline mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="text-destructive hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}