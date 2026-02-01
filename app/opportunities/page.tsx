"use client";

import { useState } from "react";
import { ChartCard } from "@/components/ui/ChartCard";
import { Opportunity } from "@/types/opportunities";
import { opportunitiesData } from "@/data/opportunities";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(opportunitiesData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Opportunity, "id">>({
    expectedCloseDate: new Date().toISOString().split("T")[0],
    customerName: "",
    assignedTo: "",
    stage: "Qualification",
    probability: 10,
    expectedValueQAR: 0,
    category: "",
  });

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      expectedCloseDate: new Date().toISOString().split("T")[0],
      customerName: "",
      assignedTo: "",
      stage: "Qualification",
      probability: 10,
      expectedValueQAR: 0,
      category: "",
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (opp: Opportunity) => {
    setEditingId(opp.id);
    setFormData({
      expectedCloseDate: opp.expectedCloseDate,
      customerName: opp.customerName,
      assignedTo: opp.assignedTo,
      stage: opp.stage,
      probability: opp.probability,
      expectedValueQAR: opp.expectedValueQAR,
      category: opp.category,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this opportunity?")) {
      setOpportunities(opportunities.filter((o) => o.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setOpportunities(
        opportunities.map((o) =>
          o.id === editingId ? { ...o, ...formData } : o
        )
      );
    } else {
      const newOpp: Opportunity = {
        id: `OPP${String(
          Math.max(...opportunities.map((o) => parseInt(o.id.replace("OPP", "")) || 0), 0) + 1
        ).padStart(3, "0")}`,
        ...formData,
      };
      setOpportunities([...opportunities, newOpp]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Opportunities</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
        >
          + New Opportunity
        </button>
      </div>

      {/* Section A: Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl">
            <ChartCard title={editingId ? "Edit Opportunity" : "Add Opportunity"}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Customer Name *</label>
                    <input
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Assigned To *</label>
                    <input
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Stage *</label>
                    <select
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.stage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stage: e.target.value as Opportunity["stage"],
                        })
                      }
                    >
                      <option value="Qualification">Qualification</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Closed Won">Closed Won</option>
                      <option value="Closed Lost">Closed Lost</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Probability (%) *</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.probability}
                      onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Expected Value (QAR) *</label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.expectedValueQAR}
                      onChange={(e) => setFormData({ ...formData, expectedValueQAR: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Expected Close Date *</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                      value={formData.expectedCloseDate}
                      onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
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
                    {editingId ? "Save Changes" : "Create Opportunity"}
                  </button>
                </div>
              </form>
            </ChartCard>
          </div>
        </div>
      )}

      {/* Section B: Opportunities Table */}
      <ChartCard title="Opportunities Pipeline">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-border text-muted-foreground font-medium">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Prob. %</th>
                <th className="p-4">Expected Value</th>
                <th className="p-4">Close Date</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-accent/50 transition-colors">
                  <td className="p-4 font-mono text-xs">{opp.id}</td>
                  <td className="p-4 font-medium">{opp.customerName}</td>
                  <td className="p-4">{opp.assignedTo}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                      {opp.stage}
                    </span>
                  </td>
                  <td className="p-4">{opp.probability}%</td>
                  <td className="p-4 font-semibold">QAR {opp.expectedValueQAR.toLocaleString()}</td>
                  <td className="p-4 text-muted-foreground">{opp.expectedCloseDate}</td>
                  <td className="p-4 text-muted-foreground">{opp.category}</td>
                  <td className="p-4 text-center space-x-3">
                    <button
                      onClick={() => handleEditClick(opp)}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(opp.id)}
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