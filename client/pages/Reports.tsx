import { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  CreditCard,
  AlertCircle,
  Download,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DashboardReport {
  totalUsers: number;
  totalHostels: number;
  totalRooms: number;
  totalResidents: number;
  occupancyRate: number;
}

interface AttendanceReport {
  totalRecords: number;
  present: number;
  absent: number;
  generatedAt: string;
}

interface PaymentReport {
  totalPayments: number;
  totalAmount: number;
  totalCollected: number;
  totalOutstanding: number;
  generatedAt: string;
}

interface ComplaintReport {
  totalComplaints: number;
  open: number;
  inProgress: number;
  resolved: number;
  resolutionRate: number;
  generatedAt: string;
}

interface OccupancyReport {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  occupancyPercentage: number;
  generatedAt: string;
}

interface FinancialReport {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  averageRentPerRoom: number;
  collectionRate: number;
  generatedAt: string;
}

export default function Reports() {
  const [activeReport, setActiveReport] = useState<
    "dashboard" | "attendance" | "payments" | "complaints" | "occupancy" | "financial"
  >("dashboard");
  const [loading, setLoading] = useState(false);
  const [dashboardReport, setDashboardReport] = useState<DashboardReport | null>(
    null
  );
  const [attendanceReport, setAttendanceReport] =
    useState<AttendanceReport | null>(null);
  const [paymentReport, setPaymentReport] = useState<PaymentReport | null>(null);
  const [complaintReport, setComplaintReport] =
    useState<ComplaintReport | null>(null);
  const [occupancyReport, setOccupancyReport] =
    useState<OccupancyReport | null>(null);
  const [financialReport, setFinancialReport] =
    useState<FinancialReport | null>(null);
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv" | "json">(
    "pdf"
  );
  const { toast } = useToast();

  // Fetch reports on component mount
  useEffect(() => {
    fetchAllReports();
  }, []);

  // Fetch specific report based on active tab
  useEffect(() => {
    switch (activeReport) {
      case "dashboard":
        fetchDashboardReport();
        break;
      case "attendance":
        fetchAttendanceReport();
        break;
      case "payments":
        fetchPaymentReport();
        break;
      case "complaints":
        fetchComplaintReport();
        break;
      case "occupancy":
        fetchOccupancyReport();
        break;
      case "financial":
        fetchFinancialReport();
        break;
    }
  }, [activeReport]);

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardReport(),
        fetchAttendanceReport(),
        fetchPaymentReport(),
        fetchComplaintReport(),
        fetchOccupancyReport(),
        fetchFinancialReport(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardReport = async () => {
    try {
      const response = await fetch("/api/reports/dashboard", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch dashboard report");
      const data = await response.json();
      setDashboardReport(data);
    } catch (error) {
      console.error("Failed to fetch dashboard report:", error);
    }
  };

  const fetchAttendanceReport = async () => {
    try {
      const response = await fetch("/api/reports/attendance", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch attendance report");
      const data = await response.json();
      setAttendanceReport(data);
    } catch (error) {
      console.error("Failed to fetch attendance report:", error);
    }
  };

  const fetchPaymentReport = async () => {
    try {
      const response = await fetch("/api/reports/payments", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch payment report");
      const data = await response.json();
      setPaymentReport(data);
    } catch (error) {
      console.error("Failed to fetch payment report:", error);
    }
  };

  const fetchComplaintReport = async () => {
    try {
      const response = await fetch("/api/reports/complaints", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch complaint report");
      const data = await response.json();
      setComplaintReport(data);
    } catch (error) {
      console.error("Failed to fetch complaint report:", error);
    }
  };

  const fetchOccupancyReport = async () => {
    try {
      const response = await fetch("/api/reports/occupancy", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch occupancy report");
      const data = await response.json();
      setOccupancyReport(data);
    } catch (error) {
      console.error("Failed to fetch occupancy report:", error);
    }
  };

  const fetchFinancialReport = async () => {
    try {
      const response = await fetch("/api/reports/financial", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch financial report");
      const data = await response.json();
      setFinancialReport(data);
    } catch (error) {
      console.error("Failed to fetch financial report:", error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        `/api/reports/export?format=${exportFormat}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to export report");

      toast({
        title: "Success",
        description: `Report exported as ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to export report",
        variant: "destructive",
      });
    }
  };

  const ReportCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <Icon className={`w-10 h-10 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
          <p className="text-muted-foreground">
            View comprehensive analytics and reports
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={exportFormat}
            onChange={(e) =>
              setExportFormat(e.target.value as "pdf" | "csv" | "json")
            }
            className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
          <Button onClick={handleExport} className="w-full md:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        <button
          onClick={() => setActiveReport("dashboard")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeReport === "dashboard"
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-slate-700 text-foreground hover:bg-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveReport("attendance")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeReport === "attendance"
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-slate-700 text-foreground hover:bg-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveReport("payments")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeReport === "payments"
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-slate-700 text-foreground hover:bg-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => setActiveReport("complaints")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeReport === "complaints"
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-slate-700 text-foreground hover:bg-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          Complaints
        </button>
        <button
          onClick={() => setActiveReport("occupancy")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeReport === "occupancy"
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-slate-700 text-foreground hover:bg-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          Occupancy
        </button>
        <button
          onClick={() => setActiveReport("financial")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeReport === "financial"
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-slate-700 text-foreground hover:bg-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          Financial
        </button>
      </div>

      {/* Dashboard Report */}
      {activeReport === "dashboard" && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Loading dashboard report...
            </div>
          ) : dashboardReport ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ReportCard
                  title="Total Users"
                  value={dashboardReport.totalUsers}
                  icon={Users}
                  color="text-blue-500/20"
                />
                <ReportCard
                  title="Total Hostels"
                  value={dashboardReport.totalHostels}
                  icon={BarChart3}
                  color="text-green-500/20"
                />
                <ReportCard
                  title="Total Rooms"
                  value={dashboardReport.totalRooms}
                  icon={Calendar}
                  color="text-orange-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReportCard
                  title="Total Residents"
                  value={dashboardReport.totalResidents}
                  icon={Users}
                  color="text-purple-500/20"
                />
                <ReportCard
                  title="Occupancy Rate"
                  value={`${dashboardReport.occupancyRate}%`}
                  icon={TrendingUp}
                  color="text-red-500/20"
                />
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      )}

      {/* Attendance Report */}
      {activeReport === "attendance" && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Loading attendance report...
            </div>
          ) : attendanceReport ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ReportCard
                  title="Total Records"
                  value={attendanceReport.totalRecords}
                  icon={Calendar}
                  color="text-blue-500/20"
                />
                <ReportCard
                  title="Present"
                  value={attendanceReport.present}
                  icon={Users}
                  color="text-green-500/20"
                  subtitle={`${
                    attendanceReport.totalRecords > 0
                      ? Math.round(
                          (attendanceReport.present /
                            attendanceReport.totalRecords) *
                            100
                        )
                      : 0
                  }%`}
                />
                <ReportCard
                  title="Absent"
                  value={attendanceReport.absent}
                  icon={AlertCircle}
                  color="text-red-500/20"
                  subtitle={`${
                    attendanceReport.totalRecords > 0
                      ? Math.round(
                          (attendanceReport.absent /
                            attendanceReport.totalRecords) *
                            100
                        )
                      : 0
                  }%`}
                />
              </div>

              <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Attendance Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Attendance Rate
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {attendanceReport.totalRecords > 0
                        ? Math.round(
                            (attendanceReport.present /
                              attendanceReport.totalRecords) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Absence Rate
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {attendanceReport.totalRecords > 0
                        ? Math.round(
                            (attendanceReport.absent /
                              attendanceReport.totalRecords) *
                              100
                        )
                        : 0}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Generated
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(attendanceReport.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      )}

      {/* Payments Report */}
      {activeReport === "payments" && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Loading payments report...
            </div>
          ) : paymentReport ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ReportCard
                  title="Total Payments"
                  value={paymentReport.totalPayments}
                  icon={CreditCard}
                  color="text-blue-500/20"
                />
                <ReportCard
                  title="Total Amount"
                  value={`₹${paymentReport.totalAmount.toLocaleString("en-IN")}`}
                  icon={TrendingUp}
                  color="text-green-500/20"
                />
                <ReportCard
                  title="Collected"
                  value={`₹${paymentReport.totalCollected.toLocaleString("en-IN")}`}
                  icon={Users}
                  color="text-purple-500/20"
                />
              </div>

              <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Payment Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Outstanding
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      ₹
                      {paymentReport.totalOutstanding.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Collection Rate
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {paymentReport.totalAmount > 0
                        ? Math.round(
                            (paymentReport.totalCollected /
                              paymentReport.totalAmount) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Generated
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(paymentReport.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      )}

      {/* Complaints Report */}
      {activeReport === "complaints" && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Loading complaints report...
            </div>
          ) : complaintReport ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ReportCard
                  title="Total Complaints"
                  value={complaintReport.totalComplaints}
                  icon={AlertCircle}
                  color="text-blue-500/20"
                />
                <ReportCard
                  title="Open"
                  value={complaintReport.open}
                  icon={Calendar}
                  color="text-yellow-500/20"
                />
                <ReportCard
                  title="Resolved"
                  value={complaintReport.resolved}
                  icon={Users}
                  color="text-green-500/20"
                />
              </div>

              <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Complaint Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold text-foreground">
                      {complaintReport.inProgress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Resolution Rate
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(complaintReport.resolutionRate)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Generated
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(complaintReport.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      )}

      {/* Occupancy Report */}
      {activeReport === "occupancy" && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Loading occupancy report...
            </div>
          ) : occupancyReport ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ReportCard
                  title="Total Rooms"
                  value={occupancyReport.totalRooms}
                  icon={Calendar}
                  color="text-blue-500/20"
                />
                <ReportCard
                  title="Occupied"
                  value={occupancyReport.occupiedRooms}
                  icon={Users}
                  color="text-green-500/20"
                />
                <ReportCard
                  title="Available"
                  value={occupancyReport.availableRooms}
                  icon={AlertCircle}
                  color="text-yellow-500/20"
                />
              </div>

              <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Occupancy Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Maintenance
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {occupancyReport.maintenanceRooms}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Occupancy %
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(occupancyReport.occupancyPercentage)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Generated
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(occupancyReport.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      )}

      {/* Financial Report */}
      {activeReport === "financial" && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Loading financial report...
            </div>
          ) : financialReport ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ReportCard
                  title="Total Revenue"
                  value={`₹${financialReport.totalRevenue.toLocaleString("en-IN")}`}
                  icon={TrendingUp}
                  color="text-green-500/20"
                />
                <ReportCard
                  title="Total Expenses"
                  value={`₹${financialReport.totalExpenses.toLocaleString("en-IN")}`}
                  icon={CreditCard}
                  color="text-red-500/20"
                />
                <ReportCard
                  title="Net Income"
                  value={`₹${financialReport.netIncome.toLocaleString("en-IN")}`}
                  icon={Users}
                  color="text-blue-500/20"
                />
              </div>

              <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Financial Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Avg Rent/Room
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹
                      {financialReport.averageRentPerRoom.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Collection Rate
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(financialReport.collectionRate)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Generated
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(financialReport.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
