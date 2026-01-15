import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye, Mail, Phone } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "warden" | "student";
  hostelId?: string;
  rollNumber?: string;
  createdAt: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Admin",
      email: "admin@hostel.com",
      phone: "+91 9876543210",
      role: "admin",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Raj Warden",
      email: "warden@hostel.com",
      phone: "+91 9876543211",
      role: "warden",
      hostelId: "H1",
      createdAt: "2024-01-16",
    },
    {
      id: "3",
      name: "Student One",
      email: "student@hostel.com",
      phone: "+91 9876543212",
      role: "student",
      rollNumber: "2021001",
      hostelId: "H1",
      createdAt: "2024-01-17",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "warden":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "student":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Users</h1>
        <p className="text-muted-foreground">
          Manage all system users including admins, wardens, and students
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="warden">Warden</option>
          <option value="student">Student</option>
        </select>
        <Link
          to="/users/new"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add User
        </Link>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 justify-end">
                        <Link
                          to={`/users/${user.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <p className="text-muted-foreground">
                      No users found matching your criteria
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Users</p>
          <p className="text-2xl font-bold text-foreground">{users.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Admins</p>
          <p className="text-2xl font-bold text-foreground">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Wardens</p>
          <p className="text-2xl font-bold text-foreground">
            {users.filter((u) => u.role === "warden").length}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Students</p>
          <p className="text-2xl font-bold text-foreground">
            {users.filter((u) => u.role === "student").length}
          </p>
        </div>
      </div>
    </div>
  );
}
