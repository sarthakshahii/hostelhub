import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Eye,
  UtensilsCrossed,
  Users,
  TrendingUp,
  Calendar,
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

interface MessMenu {
  id: string;
  date: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  createdAt: string;
}

interface MessAttendance {
  id: string;
  residentId: string;
  residentName?: string;
  date: string;
  status: "attended" | "absent";
  createdAt: string;
}

interface MessStats {
  totalMenus: number;
  totalAttendance: number;
  averageDailyCount: number;
}

interface Resident {
  id: string;
  name: string;
  rollNumber: string;
}

export default function Mess() {
  const [menus, setMenus] = useState<MessMenu[]>([]);
  const [attendance, setAttendance] = useState<MessAttendance[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<MessStats>({
    totalMenus: 0,
    totalAttendance: 0,
    averageDailyCount: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [activeTab, setActiveTab] = useState<"menu" | "attendance">("menu");
  const [showMenuDialog, setShowMenuDialog] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MessMenu | null>(null);
  const [menuFormData, setMenuFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    breakfast: "",
    lunch: "",
    dinner: "",
  });
  const [attendanceFormData, setAttendanceFormData] = useState({
    residentId: "",
    date: new Date().toISOString().split("T")[0],
    status: "attended",
  });
  const { toast } = useToast(); const { apiCall } = useApi();

  // Fetch data on component mount
  useEffect(() => {
    fetchMenus();
    fetchAttendance();
    fetchResidents();
    fetchStats();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await apiCall("/api/mess/menu", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch menus");
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch menus",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await apiCall("/api/mess/attendance", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch attendance");
      const data = await response.json();
      setAttendance(data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
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

  const fetchStats = async () => {
    try {
      const response = await apiCall("/api/mess/stats", {
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

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!menuFormData.breakfast || !menuFormData.lunch || !menuFormData.dinner) {
      toast({
        title: "Validation Error",
        description: "Please fill all meal fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiCall("/api/mess/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(menuFormData),
      });

      if (!response.ok) throw new Error("Failed to create menu");

      toast({
        title: "Success",
        description: "Menu created successfully",
      });

      setShowMenuDialog(false);
      setMenuFormData({
        date: new Date().toISOString().split("T")[0],
        breakfast: "",
        lunch: "",
        dinner: "",
      });
      fetchMenus();
      fetchStats();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create menu",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this menu?")) {
      return;
    }

    try {
      const response = await apiCall(`/api/mess/menu/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete menu");

      toast({
        title: "Success",
        description: "Menu deleted successfully",
      });

      fetchMenus();
      fetchStats();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete menu",
        variant: "destructive",
      });
    }
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!attendanceFormData.residentId || !attendanceFormData.status) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiCall("/api/mess/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(attendanceFormData),
      });

      if (!response.ok) throw new Error("Failed to mark attendance");

      toast({
        title: "Success",
        description: "Attendance marked successfully",
      });

      setShowAttendanceDialog(false);
      setAttendanceFormData({
        residentId: "",
        date: new Date().toISOString().split("T")[0],
        status: "attended",
      });
      fetchAttendance();
      fetchStats();
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

  const filteredMenus = menus.filter((menu) => {
    return !filterDate || menu.date === filterDate || filterDate === "";
  });

  const filteredAttendance = attendance.filter((att) => {
    const matchesSearch =
      att.residentName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) || false;
    const matchesDate = att.date === filterDate || filterDate === "";
    return matchesSearch && matchesDate;
  });

  const getDailyCount = (date: string) => {
    return attendance.filter(
      (att) => att.date === date && att.status === "attended"
    ).length;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mess Management
          </h1>
          <p className="text-muted-foreground">
            Manage mess menus and attendance
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Menus</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalMenus}
              </p>
            </div>
            <UtensilsCrossed className="w-10 h-10 text-blue-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Attendance
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalAttendance}
              </p>
            </div>
            <Users className="w-10 h-10 text-green-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Avg Daily Count
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats.averageDailyCount}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-500/20" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab("menu")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "menu"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Menu Management
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "attendance"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Attendance
        </button>
      </div>

      {/* Menu Tab */}
      {activeTab === "menu" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">
              Mess Menus
            </h2>
            <Dialog open={showMenuDialog} onOpenChange={setShowMenuDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Menu</DialogTitle>
                  <DialogDescription>
                    Add meals for a specific date
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateMenu} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={menuFormData.date}
                      onChange={(e) =>
                        setMenuFormData({
                          ...menuFormData,
                          date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Breakfast *
                    </label>
                    <input
                      type="text"
                      value={menuFormData.breakfast}
                      onChange={(e) =>
                        setMenuFormData({
                          ...menuFormData,
                          breakfast: e.target.value,
                        })
                      }
                      placeholder="e.g., Bread, Butter, Milk"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Lunch *
                    </label>
                    <input
                      type="text"
                      value={menuFormData.lunch}
                      onChange={(e) =>
                        setMenuFormData({
                          ...menuFormData,
                          lunch: e.target.value,
                        })
                      }
                      placeholder="e.g., Rice, Dal, Vegetables"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Dinner *
                    </label>
                    <input
                      type="text"
                      value={menuFormData.dinner}
                      onChange={(e) =>
                        setMenuFormData({
                          ...menuFormData,
                          dinner: e.target.value,
                        })
                      }
                      placeholder="e.g., Chapati, Curry"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMenuDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Create Menu
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-border rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading menus...
              </div>
            ) : filteredMenus.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No menus found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Breakfast
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Lunch
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Dinner
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Daily Count
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMenus.map((menu) => (
                      <tr
                        key={menu.id}
                        className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-foreground font-medium">
                          {new Date(menu.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {menu.breakfast}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {menu.lunch}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {menu.dinner}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground font-medium">
                          {getDailyCount(menu.date)} residents
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedMenu(menu);
                                setShowDetailsDialog(true);
                              }}
                              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenu(menu.id)}
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
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">Attendance</h2>
            <Dialog
              open={showAttendanceDialog}
              onOpenChange={setShowAttendanceDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Mark Attendance
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mark Mess Attendance</DialogTitle>
                  <DialogDescription>
                    Record resident mess attendance
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleMarkAttendance} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Resident *
                    </label>
                    <select
                      value={attendanceFormData.residentId}
                      onChange={(e) =>
                        setAttendanceFormData({
                          ...attendanceFormData,
                          residentId: e.target.value,
                        })
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
                      Date *
                    </label>
                    <input
                      type="date"
                      value={attendanceFormData.date}
                      onChange={(e) =>
                        setAttendanceFormData({
                          ...attendanceFormData,
                          date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Status *
                    </label>
                    <select
                      value={attendanceFormData.status}
                      onChange={(e) =>
                        setAttendanceFormData({
                          ...attendanceFormData,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                    >
                      <option value="attended">Attended</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAttendanceDialog(false)}
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
          </div>

          <div className="bg-white dark:bg-slate-800 border border-border rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading attendance...
              </div>
            ) : filteredAttendance.length === 0 ? (
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
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((att) => (
                      <tr
                        key={att.id}
                        className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-foreground font-medium">
                          {att.residentName || att.residentId}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(att.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              att.status === "attended"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            {att.status}
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
      )}

      {/* Menu Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Menu for {selectedMenu && new Date(selectedMenu.date).toLocaleDateString()}</DialogTitle>
            <DialogDescription>Daily Meal Plan</DialogDescription>
          </DialogHeader>
          {selectedMenu && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Breakfast</p>
                <p className="font-medium text-foreground">{selectedMenu.breakfast}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Lunch</p>
                <p className="font-medium text-foreground">{selectedMenu.lunch}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Dinner</p>
                <p className="font-medium text-foreground">{selectedMenu.dinner}</p>
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Attendance for this date
                </p>
                <p className="font-medium text-foreground">
                  {getDailyCount(selectedMenu.date)} residents attended
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



