import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Users,
  UserCheck,
  UserX,
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
import { useStudents } from "@/hooks/useStudents";

interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  hostelId: string;
  hostelName?: string;
  roomId?: string;
  roomNumber?: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface Hostel {
  id: string;
  name: string;
}

interface Room {
  id: string;
  roomNumber: string;
  hostelId: string;
}

export default function Residents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const { students, loading: studentsLoading } = useStudents();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null
  );
  const [filteredRoomsByHostel, setFilteredRoomsByHostel] = useState<Room[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rollNumber: "",
    hostelId: "",
    roomId: "",
  });
  const { toast } = useToast();

  // Fetch residents, hostels and rooms on component mount
  useEffect(() => {
    fetchResidents();
    fetchHostels();
    fetchRooms();
  }, []);

  useEffect(() => {
    if (formData.hostelId) {
      const filtered = rooms.filter(
        (room) => room.hostelId === formData.hostelId
      );
      setFilteredRoomsByHostel(filtered);
    } else {
      setFilteredRoomsByHostel([]);
    }
  }, [formData.hostelId, rooms]);

  const fetchResidents = async () => {
    setLoading(true);
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
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch residents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHostels = async () => {
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
      console.error("Failed to fetch hostels:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.rollNumber ||
      !formData.hostelId
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const method = selectedResident ? "PUT" : "POST";
      const url = selectedResident
        ? `/api/residents/${selectedResident.id}`
        : "/api/residents";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save resident");

      toast({
        title: "Success",
        description: selectedResident
          ? "Resident updated successfully"
          : "Resident created successfully",
      });

      setShowDialog(false);
      resetForm();
      fetchResidents();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save resident",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this resident?")) {
      return;
    }

    try {
      const response = await fetch(`/api/residents/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete resident");

      toast({
        title: "Success",
        description: "Resident deleted successfully",
      });

      fetchResidents();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete resident",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (residentId: string) => {
    try {
      const response = await fetch(`/api/residents/${residentId}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to update resident status");

      toast({
        title: "Success",
        description: "Resident status updated successfully",
      });

      fetchResidents();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update resident status",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (resident: Resident) => {
    setSelectedResident(resident);
    setFormData({
      name: resident.name,
      email: resident.email,
      phone: resident.phone,
      rollNumber: resident.rollNumber,
      hostelId: resident.hostelId,
      roomId: resident.roomId || "",
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      rollNumber: "",
      hostelId: "",
      roomId: "",
    });
    setSelectedResident(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch =
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || resident.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: residents.length,
    active: residents.filter((r) => r.status === "active").length,
    inactive: residents.filter((r) => r.status === "inactive").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Residents</h1>
          <p className="text-muted-foreground">
            Manage student residents and room allocations
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Resident
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedResident ? "Edit Resident" : "Add New Resident"}
              </DialogTitle>
              <DialogDescription>
                {selectedResident
                  ? "Update resident information"
                  : "Add a new student resident"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Roll Number *
                </label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, rollNumber: e.target.value })
                  }
                  placeholder="Enter roll number"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                />
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
                  Room (Optional)
                </label>
                <select
                  value={formData.roomId}
                  onChange={(e) =>
                    setFormData({ ...formData, roomId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                  disabled={!formData.hostelId}
                >
                  <option value="">Select a room (optional)</option>
                  {filteredRoomsByHostel.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.roomNumber}
                    </option>
                  ))}
                </select>
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
                  {selectedResident ? "Update" : "Add"} Resident
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
              <p className="text-sm text-muted-foreground mb-1">
                Total Residents
              </p>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.active}
              </p>
            </div>
            <UserCheck className="w-10 h-10 text-green-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Inactive</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.inactive}
              </p>
            </div>
            <UserX className="w-10 h-10 text-red-500/20" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or roll number..."
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

      {/* Residents Table */}
      <div className="bg-white dark:bg-slate-800 border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading residents...
          </div>
        ) : filteredResidents.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No residents found. Try adding one!
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
                    Roll Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Hostel
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Room
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
                {filteredResidents.map((resident) => (
                  <tr
                    key={resident.id}
                    className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      {resident.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {resident.rollNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {resident.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {resident.hostelName || resident.hostelId}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {resident.roomNumber ? `Room ${resident.roomNumber}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleStatusUpdate(resident.id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          resident.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 hover:bg-red-200"
                        }`}
                      >
                        {resident.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedResident(resident);
                            setShowDetailsDialog(true);
                          }}
                          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(resident)}
                          className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded text-yellow-600 dark:text-yellow-400 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(resident.id)}
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
            <DialogTitle>{selectedResident?.name}</DialogTitle>
            <DialogDescription>Resident Details</DialogDescription>
          </DialogHeader>
          {selectedResident && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">
                    {selectedResident.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">
                    {selectedResident.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roll Number</p>
                  <p className="font-medium text-foreground">
                    {selectedResident.rollNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hostel</p>
                  <p className="font-medium text-foreground">
                    {selectedResident.hostelName || selectedResident.hostelId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-medium text-foreground">
                    {selectedResident.roomNumber
                      ? `Room ${selectedResident.roomNumber}`
                      : "Not assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      selectedResident.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {selectedResident.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedResident.createdAt).toLocaleDateString()}
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
