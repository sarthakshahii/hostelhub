import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  DoorOpen,
  Users,
  AlertCircle,
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

interface Room {
  id: string;
  hostelId: string;
  hostelName?: string;
  roomNumber: string;
  capacity: number;
  currentOccupancy: number;
  type: string;
  status: "available" | "occupied" | "maintenance";
  createdAt: string;
}

interface Hostel {
  id: string;
  name: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    hostelId: "",
    roomNumber: "",
    capacity: 0,
    type: "standard",
  });
  const { toast } = useToast();

  // Fetch rooms and hostels on component mount
  useEffect(() => {
    fetchRooms();
    fetchHostels();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
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
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch rooms",
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

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.hostelId || !formData.roomNumber || !formData.capacity) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const method = selectedRoom ? "PUT" : "POST";
      const url = selectedRoom ? `/api/rooms/${selectedRoom.id}` : "/api/rooms";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save room");

      toast({
        title: "Success",
        description: selectedRoom
          ? "Room updated successfully"
          : "Room created successfully",
      });

      setShowDialog(false);
      resetForm();
      fetchRooms();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save room",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete room");

      toast({
        title: "Success",
        description: "Room deleted successfully",
      });

      fetchRooms();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete room",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (roomId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update room status");

      toast({
        title: "Success",
        description: "Room status updated successfully",
      });

      fetchRooms();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update room status",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      hostelId: room.hostelId,
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      type: room.type,
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({
      hostelId: "",
      roomNumber: "",
      capacity: 0,
      type: "standard",
    });
    setSelectedRoom(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.hostelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false);
    const matchesStatus = filterStatus === "all" || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: rooms.length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    available: rooms.filter((r) => r.status === "available").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "occupied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "maintenance":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Rooms</h1>
          <p className="text-muted-foreground">
            Manage hostel rooms and allocations
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedRoom ? "Edit Room" : "Create New Room"}
              </DialogTitle>
              <DialogDescription>
                {selectedRoom
                  ? "Update room information"
                  : "Add a new room to the system"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
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
                  Room Number *
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                  placeholder="e.g., 101, 102"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="shared">Shared</option>
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
                  {selectedRoom ? "Update" : "Create"} Room
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
              <p className="text-sm text-muted-foreground mb-1">Total Rooms</p>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
            <DoorOpen className="w-10 h-10 text-blue-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Occupied</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.occupied}
              </p>
            </div>
            <Users className="w-10 h-10 text-blue-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Available</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.available}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-green-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Maintenance</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.maintenance}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-orange-500/20" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search rooms..."
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
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {/* Rooms Table */}
      <div className="bg-white dark:bg-slate-800 border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading rooms...
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No rooms found. Try creating one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Room Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Hostel
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
                {filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      {room.roomNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {room.hostelName || room.hostelId}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground capitalize">
                      {room.type}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium text-foreground">
                          {room.currentOccupancy}/{room.capacity}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={room.status}
                        onChange={(e) =>
                          handleStatusUpdate(room.id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(
                          room.status
                        )}`}
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedRoom(room);
                            setShowDetailsDialog(true);
                          }}
                          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(room)}
                          className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded text-yellow-600 dark:text-yellow-400 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
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
            <DialogTitle>Room {selectedRoom?.roomNumber}</DialogTitle>
            <DialogDescription>Room Details</DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hostel</p>
                  <p className="font-medium text-foreground">
                    {selectedRoom.hostelName || selectedRoom.hostelId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room Type</p>
                  <p className="font-medium text-foreground capitalize">
                    {selectedRoom.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium text-foreground">
                    {selectedRoom.capacity}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Occupancy</p>
                  <p className="font-medium text-foreground">
                    {selectedRoom.currentOccupancy}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      selectedRoom.status
                    )}`}
                  >
                    {selectedRoom.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedRoom.createdAt).toLocaleDateString()}
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
