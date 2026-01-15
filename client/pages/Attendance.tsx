import { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
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

interface AttendanceRecord {
  id: string;
  residentId: string;
  residentName?: string;
  status: "present" | "absent" | "leave";
  date: string;
  createdAt: string;
}

interface Resident {
  id: string;
  name: string;
  rollNumber: string;
}

interface AttendanceReport {
  totalRecords: number;
  present: number;
  absent: number;
  generatedAt: string;
}

export default function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(
    []
  );
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [showDialog, setShowDialog] = useState(false);
  const [report, setReport] = useState<AttendanceReport | null>(null);
  const [formData, setFormData] = useState({
    residentId: "",
    status: "present",
    date: new Date().toISOString().split("T")[0],
  });
  const { toast } = useToast();

  // Fetch attendance records and residents on component mount
  useEffect(() => {
    fetchAttendanceRecords();
    fetchResidents();
    fetchReport();
  }, []);

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/attendance", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch attendance records");
      const data = await response.json();
      setAttendanceRecords(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch attendance records",
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

  const fetchReport = async () => {
    try {
      const response = await fetch("/api/attendance/report", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch report");
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    }
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.residentId || !formData.status || !formData.date) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to mark attendance");

      toast({
        title: "Success",
        description: "Attendance marked successfully",
      });

      setShowDialog(false);
      resetForm();
      fetchAttendanceRecords();
      fetchReport();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to mark attendance",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAttendance = async (recordId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/attendance/${recordId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update attendance");

      toast({
        title: "Success",
        description: "Attendance updated successfully",
      });

      fetchAttendanceRecords();
      fetchReport();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update attendance",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      residentId: "",
      status: "present",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleOpenDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch =
      record.residentName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    const matchesDate = record.date === filterDate || filterDate === "";
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "absent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "leave":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4" />;
      case "absent":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Attendance</h1>
          <p className="text-muted-foreground">
            Mark and track student attendance
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Attendance</DialogTitle>
              <DialogDescription>
                Record attendance for a resident
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleMarkAttendance} className="space-y-4">
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
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="leave">Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
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
                  Mark Attendance
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
                Total Records
              </p>
              <p className="text-3xl font-bold text-foreground">
                {report?.totalRecords || 0}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-blue-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Present</p>
              <p className="text-3xl font-bold text-foreground">
                {report?.present || 0}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Absent</p>
              <p className="text-3xl font-bold text-foreground">
                {report?.absent || 0}
              </p>
            </div>
            <XCircle className="w-10 h-10 text-red-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Attendance Rate
              </p>
              <p className="text-3xl font-bold text-foreground">
                {report && report.totalRecords > 0
                  ? Math.round(
                      (report.present / report.totalRecords) * 100
                    )
                  : 0}
                %
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-500/20" />
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
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
        </select>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-slate-800 border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading attendance records...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No attendance records found.
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
                    Date
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
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      {record.residentName || record.residentId}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={record.status}
                        onChange={(e) =>
                          handleUpdateAttendance(record.id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer flex items-center gap-2 ${getStatusColor(
                          record.status
                        )}`}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="leave">Leave</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        {getStatusIcon(record.status)}
                        <span className="capitalize">{record.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
