import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye, Mail, Phone } from "lucide-react";

interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  hostel: string;
  room: string;
  status: "active" | "inactive";
  joinDate: string;
}

export default function ResidentsList() {
  const [residents, setResidents] = useState<Resident[]>([
    {
      id: "R1",
      name: "Student One",
      email: "student1@example.com",
      phone: "+91 9876543210",
      rollNumber: "2021001",
      hostel: "Hostel A",
      room: "205",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: "R2",
      name: "Student Two",
      email: "student2@example.com",
      phone: "+91 9876543211",
      rollNumber: "2021002",
      hostel: "Hostel B",
      room: "310",
      status: "active",
      joinDate: "2024-01-16",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filtered = residents.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rollNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Residents</h1>
        <p className="text-muted-foreground">Manage student residents</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary dark:bg-slate-800"
        />
        <Link
          to="/residents/new"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Resident
        </Link>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Hostel / Room
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((resident) => (
                <tr key={resident.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {resident.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {resident.rollNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {resident.hostel} / Room {resident.room}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800">
                      {resident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Eye className="w-4 h-4 cursor-pointer text-blue-600" />
                    <Edit2 className="w-4 h-4 cursor-pointer text-green-600" />
                    <Trash2 className="w-4 h-4 cursor-pointer text-red-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
