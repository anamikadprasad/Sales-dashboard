"use client";

import { useState, useEffect } from "react";
import { ChartCard } from "@/components/ui/ChartCard";
import { Sale } from "@/types/sales";
import { salesData } from "@/data/sales";

export default function SalesOrdersPage() {
  const [salesOrders, setSalesOrders] = useState<Sale[]>(salesData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Sale, "id" | "gp" | "gpPercentage">>({
    dealCloseDate: new Date().toISOString().split("T")[0],
    customer: "",
    employee: "",
    productService: "",
    category: "",
    contractType: "Annual",
    billType: "Recurring",
    amountQAR: 0,
    costQAR: 0,
    paymentStatus: "Pending",
  });

  // Auto-calculate GP and GP%
  const [autoGP, setAutoGP] = useState(0);
  const [autoGPPercent, setAutoGPPercent] = useState(0);

  useEffect(() => {
    const gp = formData.amountQAR - formData.costQAR;
    const gpPercent = formData.amountQAR > 0 ? (gp / formData.amountQAR) * 100 : 0;
    setAutoGP(gp);
    setAutoGPPercent(gpPercent);
  }, [formData.amountQAR, formData.costQAR]);

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      dealCloseDate: new Date().toISOString().split("T")[0],
      customer: "",
      employee: "",
      productService: "",
      category: "",
      contractType: "Annual",
      billType: "Recurring",
      amountQAR: 0,
      costQAR: 0,
      paymentStatus: "Pending",
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (order: Sale) => {
    setEditingId(order.id);
    setFormData({
      dealCloseDate: order.dealCloseDate || new Date().toISOString().split("T")[0],
      customer: order.customer,
      employee: order.employee,
      productService: order.productService,
      category: order.category,
      contractType: order.contractType,
      billType: order.billType,
      amountQAR: order.amountQAR,
      costQAR: order.costQAR,
      paymentStatus: order.paymentStatus,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this sales order?")) {
      setSalesOrders(salesOrders.filter((o) => o.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder: Sale = {
      ...formData,
      gp: autoGP,
      gpPercentage: autoGPPercent,
      id: editingId || `S${String(
        Math.max(...salesOrders.map((o) => parseInt(o.id.replace("S", "")) || 0), 0) + 1
      ).padStart(2, "0")}`,
    };

    if (editingId) {
      setSalesOrders(salesOrders.map((o) => (o.id === editingId ? newOrder : o)));
    } else {
      setSalesOrders([...salesOrders, newOrder]);
    }

    setIsFormOpen(false);
  };

  const getPaymentStatusColor = (status: string | number) => {
    const statusStr = String(status);
    switch (statusStr) {
      case "Paid":
        return "bg-green-500/20 text-green-700 dark:text-green-400";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case "Overdue":
        return "bg-red-500/20 text-red-700 dark:text-red-400";
      case "Partially Paid":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sales Orders</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
        >
          + New Sales Order
        </button>
      </div>

      {/* Section A: Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <ChartCard title={editingId ? "Edit Sales Order" : "Add Sales Order"}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Deal Close Date *</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.dealCloseDate}
                      onChange={(e) => setFormData({ ...formData, dealCloseDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Customer Name *</label>
                    <input
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.customer}
                      onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Employee *</label>
                    <input
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.employee}
                      onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Product/Service</label>
                    <input
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.productService}
                      onChange={(e) => setFormData({ ...formData, productService: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Category *</label>
                    <input
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Contract Type *</label>
                    <select
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.contractType}
                      onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                    >
                      <option value="Annual">Annual</option>
                      <option value="One-Time">One-Time</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Bill Type *</label>
                    <select
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.billType}
                      onChange={(e) => setFormData({ ...formData, billType: e.target.value })}
                    >
                      <option value="Recurring">Recurring</option>
                      <option value="One-Time">One-Time</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Amount (QAR) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.amountQAR}
                      onChange={(e) => setFormData({ ...formData, amountQAR: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Cost (QAR) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.costQAR}
                      onChange={(e) => setFormData({ ...formData, costQAR: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Payment Status *</label>
                    <select
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Partially Paid">Partially Paid</option>
                    </select>
                  </div>

                  {/* Auto-calculated fields */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">GP (Auto)</label>
                    <input
                      type="text"
                      disabled
                      className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground cursor-not-allowed"
                      value={`QAR ${autoGP.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">GP % (Auto)</label>
                    <input
                      type="text"
                      disabled
                      className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground cursor-not-allowed"
                      value={`${autoGPPercent.toFixed(2)}%`}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-muted-foreground hover:bg-accent rounded-md transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition"
                  >
                    {editingId ? "Save Changes" : "Create Sales Order"}
                  </button>
                </div>
              </form>
            </ChartCard>
          </div>
        </div>
      )}

      {/* Section B: Sales Orders Table */}
      <ChartCard title={`Sales Orders (${salesOrders.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-border text-muted-foreground font-medium">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Employee</th>
                <th className="p-4">Product/Service</th>
                <th className="p-4">Category</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Cost</th>
                <th className="p-4">GP</th>
                <th className="p-4">GP %</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {salesOrders.map((order) => (
                <tr key={order.id} className="hover:bg-accent/50 transition-colors">
                  <td className="p-4 font-mono text-xs">{order.id}</td>
                  <td className="p-4 text-muted-foreground">{order.dealCloseDate}</td>
                  <td className="p-4 font-medium">{order.customer}</td>
                  <td className="p-4">{order.employee}</td>
                  <td className="p-4 text-muted-foreground">{order.productService || "-"}</td>
                  <td className="p-4">{order.category}</td>
                  <td className="p-4 font-semibold">QAR {order.amountQAR.toLocaleString()}</td>
                  <td className="p-4">QAR {order.costQAR.toLocaleString()}</td>
                  <td className="p-4 font-semibold text-primary">QAR {order.gp.toLocaleString()}</td>
                  <td className="p-4 font-semibold">{order.gpPercentage.toFixed(2)}%</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center space-x-3">
                    <button
                      onClick={() => handleEditClick(order)}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-destructive hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}