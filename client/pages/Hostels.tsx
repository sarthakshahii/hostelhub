import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Building2,
  MapPin,
  Users,
  Zap,
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

interface Hostel {
  id: string;
  name: string;
  address: string;
  type: string;
  capacity: number;
  wardenId: string;
  wardenName?: string;
  currentOccupancy: number;
  occupancyRate: number;
  availableRooms: number;
  status: "active" | "inactive";
  createdAt: string;
}

export default function Hostels() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "boys",
    capacity: 0,
    wardenId: "",
  });
  const { toast } = useToast();

  // Fetch hostels on component mount
  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/hostels", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch hostels");
      const data = await response.json();
      setHostels(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch hostels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.capacity) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const method = selectedHostel ? "PUT" : "POST";
      const url = selectedHostel
        ? `/api/hostels/${selectedHostel.id}`
        : "/api/hostels";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save hostel");

      toast({
        title: "Success",
        description: selectedHostel
          ? "Hostel updated successfully"
          : "Hostel created successfully",
      });

      setShowDialog(false);
      resetForm();
      fetchHostels();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save hostel",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this hostel? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/hostels/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete hostel");

      toast({
        title: "Success",
        description: "Hostel deleted successfully",
      });

      fetchHostels();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete hostel",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setFormData({
      name: hostel.name,
      address: hostel.address,
      type: hostel.type,
      capacity: hostel.capacity,
      wardenId: hostel.wardenId,
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      type: "boys",
      capacity: 0,
      wardenId: "",
    });
    setSelectedHostel(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const filteredHostels = hostels.filter((hostel) => {
    const matchesSearch =
      hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostel.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || hostel.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCapacity = hostels.reduce((sum, h) => sum + h.capacity, 0);
  const totalOccupancy = hostels.reduce((sum, h) => sum + h.currentOccupancy, 0);
  const averageOccupancy =
    hostels.length > 0
      ? Math.round((totalOccupancy / totalCapacity) * 100)
      : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Hostels</h1>
          <p className="text-muted-foreground">
            Create and manage all hostel properties
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Hostel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedHostel ? "Edit Hostel" : "Create New Hostel"}
              </DialogTitle>
              <DialogDescription>
                {selectedHostel
                  ? "Update hostel information"
                  : "Add a new hostel property to the system"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Hostel Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter hostel name"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter hostel address"
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
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value),
                      })
                    }
                    placeholder="Enter capacity"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Warden ID
                </label>
                <input
                  type="text"
                  value={formData.wardenId}
                  onChange={(e) =>
                    setFormData({ ...formData, wardenId: e.target.value })
                  }
                  placeholder="Enter warden ID"
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
                  {selectedHostel ? "Update" : "Create"} Hostel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Hostels</p>
              <p className="text-3xl font-bold text-foreground">{hostels.length}</p>
            </div>
            <Building2 className="w-10 h-10 text-blue-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Capacity
              </p>
              <p className="text-3xl font-bold text-foreground">{totalCapacity}</p>
            </div>
            <Users className="w-10 h-10 text-green-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Occupancy Rate
              </p>
              <p className="text-3xl font-bold text-foreground">
                {averageOccupancy}%
              </p>
            </div>
            <Zap className="w-10 h-10 text-orange-500/20" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search hostels..."
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Hostels Table */}
      <div className="bg-white dark:bg-slate-800 border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading hostels...
          </div>
        ) : filteredHostels.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No hostels found. Try creating one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Occupancy
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
                {filteredHostels.map((hostel) => (
                  <tr
                    key={hostel.id}
                    className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      {hostel.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {hostel.address}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground capitalize">
                      {hostel.type}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium text-foreground">
                          {hostel.currentOccupancy}/{hostel.capacity}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {hostel.occupancyRate}%
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          hostel.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }`}
                      >
                        {hostel.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedHostel(hostel);
                            setShowDetailsDialog(true);
                          }}
                          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(hostel)}
                          className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded text-yellow-600 dark:text-yellow-400 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(hostel.id)}
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
            <DialogTitle>{selectedHostel?.name}</DialogTitle>
            <DialogDescription>Hostel Details</DialogDescription>
          </DialogHeader>
          {selectedHostel && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium text-foreground">
                    {selectedHostel.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium text-foreground capitalize">
                    {selectedHostel.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Capacity</p>
                  <p className="font-medium text-foreground">
                    {selectedHostel.capacity}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Occupancy</p>
                  <p className="font-medium text-foreground">
                    {selectedHostel.currentOccupancy}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                  <p className="font-medium text-foreground">
                    {selectedHostel.occupancyRate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Rooms</p>
                  <p className="font-medium text-foreground">
                    {selectedHostel.availableRooms}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Warden ID</p>
                  <p className="font-medium text-foreground">
                    {selectedHostel.wardenName || selectedHostel.wardenId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-foreground capitalize">
                    {selectedHostel.status}
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
