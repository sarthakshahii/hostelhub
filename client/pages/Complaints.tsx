import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  MessageSquare,
  User,
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

interface Complaint {
  id: string;
  residentId: string;
  residentName?: string;
  hostelId: string;
  hostelName?: string;
  title: string;
  description: string;
  type: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "inProgress" | "resolved";
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Resident {
  id: string;
  name: string;
  rollNumber: string;
}

interface Hostel {
  id: string;
  name: string;
}

interface ComplaintStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

export default function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [stats, setStats] = useState<ComplaintStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [formData, setFormData] = useState({
    residentId: "",
    hostelId: "",
    title: "",
    description: "",
    type: "maintenance",
    priority: "medium",
  });
  const { toast } = useToast(); const { apiCall } = useApi();

  // Fetch complaints, residents and hostels on component mount
  useEffect(() => {
    fetchComplaints();
    fetchResidents();
    fetchHostels();
  }, []);

  // Update stats whenever complaints change
  useEffect(() => {
    setStats({
      total: complaints.length,
      open: complaints.filter((c) => c.status === "open").length,
      inProgress: complaints.filter((c) => c.status === "inProgress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
    });
  }, [complaints]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await apiCall("/api/complaints", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch complaints");
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch complaints",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await apiCall("/api/residents", {
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

  const fetchHostels = async () => {
    try {
      const response = await apiCall("/api/hostels", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch hostels");
      const data = await response.json();
      setHostels(data);
    } catch (error) {
      console.error("Failed to fetch hostels:", error);
    }
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.residentId ||
      !formData.hostelId ||
      !formData.title ||
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
      const response = await apiCall("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create complaint");

      toast({
        title: "Success",
        description: "Complaint created successfully",
      });

      setShowDialog(false);
      resetForm();
      fetchComplaints();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create complaint",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) {
      return;
    }

    try {
      const response = await apiCall(`/api/complaints/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete complaint");

      toast({
        title: "Success",
        description: "Complaint deleted successfully",
      });

      fetchComplaints();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete complaint",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    try {
      const response = await apiCall(`/api/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update complaint status");

      toast({
        title: "Success",
        description: "Complaint status updated successfully",
      });

      fetchComplaints();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update complaint status",
        variant: "destructive",
      });
    }
  };

  const handleAssign = async (complaintId: string, userId: string) => {
    try {
      const response = await apiCall(`/api/complaints/${complaintId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ assignedTo: userId }),
      });

      if (!response.ok) throw new Error("Failed to assign complaint");

      toast({
        title: "Success",
        description: "Complaint assigned successfully",
      });

      fetchComplaints();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to assign complaint",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      residentId: "",
      hostelId: "",
      title: "",
      description: "",
      type: "maintenance",
      priority: "medium",
    });
    setSelectedComplaint(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || complaint.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || complaint.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "inProgress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Complaints
          </h1>
          <p className="text-muted-foreground">
            Lodge and track student complaints
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-96 overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lodge New Complaint</DialogTitle>
              <DialogDescription>
                Create a new complaint report
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateComplaint} className="space-y-4">
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
                  Hostel *
                </label>
                <select
                  value={formData.hostelId}
                  onChange={(e) =>
                    setFormData({ ...formData, hostelId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Select a hostel</option>
                  {hostels.map((hostel) => (
                    <option key={hostel.id} value={hostel.id}>
                      {hostel.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter complaint title"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the complaint"
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="noise">Noise</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as
                          | "low"
                          | "medium"
                          | "high"
                          | "critical",
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
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
                  Submit Complaint
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Complaints
              </p>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
            <MessageSquare className="w-10 h-10 text-blue-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Open</p>
              <p className="text-3xl font-bold text-foreground">{stats.open}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">In Progress</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.inProgress}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-purple-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Resolved</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.resolved}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-green-500/20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search complaints..."
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
          <option value="open">Open</option>
          <option value="inProgress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Complaints Table */}
      <div className="bg-white dark:bg-slate-800 border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No complaints found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Resident
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Assigned
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      {complaint.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {complaint.residentName || complaint.residentId}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={complaint.status}
                        onChange={(e) =>
                          handleStatusUpdate(complaint.id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer capitalize ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        <option value="open">Open</option>
                        <option value="inProgress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        {complaint.assignedToName || "Unassigned"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowDetailsDialog(true);
                          }}
                          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(complaint.id)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedComplaint?.title}</DialogTitle>
            <DialogDescription>Complaint Details</DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="font-medium text-foreground">
                  {selectedComplaint.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Resident</p>
                  <p className="font-medium text-foreground">
                    {selectedComplaint.residentName ||
                      selectedComplaint.residentId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hostel</p>
                  <p className="font-medium text-foreground">
                    {selectedComplaint.hostelName ||
                      selectedComplaint.hostelId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium text-foreground capitalize">
                    {selectedComplaint.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(
                      selectedComplaint.priority
                    )}`}
                  >
                    {selectedComplaint.priority}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      selectedComplaint.status
                    )}`}
                  >
                    {selectedComplaint.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned To</p>
                  <p className="font-medium text-foreground">
                    {selectedComplaint.assignedToName || "Unassigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



