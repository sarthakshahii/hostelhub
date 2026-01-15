import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye, Users, DoorOpen } from "lucide-react";

interface Hostel {
  id: string;
  name: string;
  address: string;
  type: "boys" | "girls" | "mixed";
  capacity: number;
  currentOccupancy: number;
  warden: string;
  createdAt: string;
}

export default function HostelsList() {
  const [hostels, setHostels] = useState<Hostel[]>([
    {
      id: "H1",
      name: "Hostel A",
      address: "North Campus, Block A",
      type: "boys",
      capacity: 120,
      currentOccupancy: 105,
      warden: "Raj Warden",
      createdAt: "2024-01-01",
    },
    {
      id: "H2",
      name: "Hostel B",
      address: "North Campus, Block B",
      type: "girls",
      capacity: 100,
      currentOccupancy: 92,
      warden: "Priya Warden",
      createdAt: "2024-01-02",
    },
    {
      id: "H3",
      name: "Hostel C",
      address: "South Campus, Block A",
      type: "mixed",
      capacity: 150,
      currentOccupancy: 128,
      warden: "Kumar Warden",
      createdAt: "2024-01-03",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredHostels = hostels.filter((hostel) =>
    hostel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "boys":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900";
      case "girls":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900";
      case "mixed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this hostel?")) {
      setHostels(hostels.filter((hostel) => hostel.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Hostels</h1>
        <p className="text-muted-foreground">
          Manage all hostel properties and assignments
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search hostels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800"
        />
        <Link
          to="/hostels/new"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Hostel
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHostels.map((hostel) => (
          <div
            key={hostel.id}
            className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {hostel.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {hostel.address}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded capitalize ${getTypeColor(hostel.type)}`}
              >
                {hostel.type}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>
                  {hostel.currentOccupancy} / {hostel.capacity} residents
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DoorOpen className="w-4 h-4" />
                <span>Warden: {hostel.warden}</span>
              </div>
            </div>

            {/* Occupancy Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Occupancy</span>
                <span className="font-semibold text-foreground">
                  {Math.round((hostel.currentOccupancy / hostel.capacity) * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2"
                  style={{
                    width: `${(hostel.currentOccupancy / hostel.capacity) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Link
                to={`/hostels/${hostel.id}`}
                className="flex-1 p-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4 inline mr-1" />
                View
              </Link>
              <Link
                to={`/hostels/${hostel.id}/edit`}
                className="flex-1 p-2 text-center text-sm font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 inline mr-1" />
                Edit
              </Link>
              <button
                onClick={() => handleDelete(hostel.id)}
                className="flex-1 p-2 text-center text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredHostels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No hostels found</p>
          <Link
            to="/hostels/new"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Create the first hostel →
          </Link>
        </div>
      )}
    </div>
  );
}
