import { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  CreditCard,
  AlertCircle,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  residentId: string;
  residentName?: string;
  amount: number;
  dueDate: string;
  description: string;
  status: "pending" | "paid" | "overdue";
  createdAt: string;
  paidDate?: string;
}

interface Resident {
  id: string;
  name: string;
  rollNumber: string;
}

interface PaymentStats {
  total: number;
  paid: number;
  pending: number;
  totalAmount: number;
  totalPaid: number;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [stats, setStats] = useState<PaymentStats>({
    total: 0,
    paid: 0,
    pending: 0,
    totalAmount: 0,
    totalPaid: 0,
  });
  const [formData, setFormData] = useState({
    residentId: "",
    amount: 0,
    dueDate: "",
    description: "",
  });
  const { toast } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    fetchPayments();
    fetchResidents();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/payments", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await fetch("/api/residents", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch residents");
      const data = await response.json();
      setResidents(data);
    } catch (error) {
      console.error("Failed to fetch residents:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/payments/stats", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.residentId ||
      !formData.amount ||
      !formData.dueDate ||
      !formData.description
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create payment");

      toast({
        title: "Success",
        description: "Payment record created successfully",
      });

      setShowDialog(false);
      resetForm();
      fetchPayments();
      fetchStats();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create payment",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (paymentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update payment status");

      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });

      fetchPayments();
      fetchStats();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const handleGenerateMonthly = async () => {
    if (
      !window.confirm(
        "Are you sure you want to generate monthly rent for all residents?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/payments/generate-monthly", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to generate monthly payments");

      toast({
        title: "Success",
        description: "Monthly rent generated for all residents",
      });

      fetchPayments();
      fetchStats();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate monthly payments",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      residentId: "",
      amount: 0,
      dueDate: "",
      description: "",
    });
  };

  const handleOpenDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.residentName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Payments</h1>
          <p className="text-muted-foreground">
            Manage resident payments and billing
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateMonthly}
            variant="outline"
            className="w-full md:w-auto"
          >
            Generate Monthly
          </Button>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                New Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Payment Record</DialogTitle>
                <DialogDescription>
                  Add a new payment record for a resident
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Resident *
                  </label>
                  <select
                    value={formData.residentId}
                    onChange={(e) =>
                      setFormData({ ...formData, residentId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">Select a resident</option>
                    {residents.map((resident) => (
                      <option key={resident.id} value={resident.id}>
                        {resident.name} ({resident.rollNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="e.g., Monthly Rent, Mess Fee"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Create Payment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Payments
              </p>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
            <CreditCard className="w-10 h-10 text-blue-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Paid</p>
              <p className="text-3xl font-bold text-foreground">{stats.paid}</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.pending}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Collection Rate
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalAmount > 0
                  ? Math.round((stats.totalPaid / stats.totalAmount) * 100)
                  : 0}
                %
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-500/20" />
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Financial Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-foreground">
              ₹{stats.totalAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Collected</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{stats.totalPaid.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Outstanding</p>
            <p className="text-2xl font-bold text-red-600">
              ₹{(stats.totalAmount - stats.totalPaid).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by resident name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-800 border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading payments...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No payments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Resident
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const overdue =
                    isOverdue(payment.dueDate) && payment.status !== "paid";
                  const finalStatus = overdue ? "overdue" : payment.status;

                  return (
                    <tr
                      key={payment.id}
                      className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-foreground font-medium">
                        {payment.residentName || payment.residentId}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">
                        ₹
                        {payment.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {payment.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={payment.status}
                          onChange={(e) =>
                            handleStatusUpdate(payment.id, e.target.value)
                          }
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer capitalize ${getStatusColor(
                            finalStatus
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowDetailsDialog(true);
                          }}
                          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Payment Record Information</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Resident</p>
                  <p className="font-medium text-foreground">
                    {selectedPayment.residentName ||
                      selectedPayment.residentId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-foreground">
                    ₹
                    {selectedPayment.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium text-foreground">
                    {selectedPayment.description}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      selectedPayment.status
                    )}`}
                  >
                    {selectedPayment.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedPayment.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedPayment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {selectedPayment.paidDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Paid Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedPayment.paidDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
