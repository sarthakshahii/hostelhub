import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  DoorOpen,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ClipboardList,
  UtensilsCrossed,
  CreditCard,
  BarChart3,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

interface ModuleCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}

const Dashboard = () => {
  const stats: StatCard[] = [
    {
      label: "Total Hostels",
      value: "8",
      change: "+2 this month",
      icon: <Building2 className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Active Residents",
      value: "342",
      change: "+12 this week",
      icon: <Users className="w-6 h-6" />,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      label: "Rooms Available",
      value: "45",
      change: "-3 this week",
      icon: <DoorOpen className="w-6 h-6" />,
      color: "from-teal-500 to-teal-600",
    },
    {
      label: "Open Complaints",
      value: "12",
      change: "5 resolved today",
      icon: <AlertCircle className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const modules: ModuleCard[] = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Hostels",
      description: "Manage hostel properties and information",
      href: "/hostels",
      color: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
    },
    {
      icon: <DoorOpen className="w-8 h-8" />,
      title: "Rooms",
      description: "Allocate and manage hostel rooms",
      href: "/rooms",
      color: "from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Residents",
      description: "Register and manage student residents",
      href: "/residents",
      color: "from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900",
    },
    {
      icon: <ClipboardList className="w-8 h-8" />,
      title: "Attendance",
      description: "Track and manage student attendance",
      href: "/attendance",
      color: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Complaints",
      description: "Track and resolve student complaints",
      href: "/complaints",
      color: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: "Mess Management",
      description: "Manage meal plans and menus",
      href: "/mess",
      color: "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Payments",
      description: "Process payments and invoices",
      href: "/payments",
      color: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Reports",
      description: "Generate analytics and reports",
      href: "/reports",
      color: "from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900",
    },
  ];

  const recentActivity = [
    {
      icon: <Users className="w-4 h-4" />,
      action: "New resident registered",
      detail: "John Doe in Hostel A",
      time: "2 hours ago",
    },
    {
      icon: <AlertCircle className="w-4 h-4" />,
      action: "Complaint resolved",
      detail: "Water issue in Room 205",
      time: "4 hours ago",
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      action: "Payment received",
      detail: "Hostel A - Monthly fees",
      time: "1 day ago",
    },
    {
      icon: <DoorOpen className="w-4 h-4" />,
      action: "Room allocated",
      detail: "Room 301, Hostel B",
      time: "2 days ago",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl lg:rounded-2xl p-6 lg:p-8 text-primary-foreground shadow-lg">
        <h1 className="text-2xl lg:text-4xl font-bold mb-2">Welcome to HostelHub</h1>
        <p className="text-base lg:text-lg opacity-90">
          Manage your hostel operations efficiently. Monitor residents, rooms,
          complaints, and more.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white", stat.color)}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Modules Grid */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-2">
              Management Modules
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground">
              Access all features to manage your hostel
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {modules.map((module, index) => (
              <Link
                key={index}
                to={module.href}
                className={cn(
                  "group relative overflow-hidden rounded-xl border border-border p-6 transition-all hover:shadow-lg hover:border-primary/50 bg-card",
                  "hover:scale-105"
                )}
              >
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity", module.color)} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {module.icon}
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-1">
                    {module.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.detail}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Notifications</h3>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">8</p>
          <p className="text-sm text-muted-foreground">Pending notifications</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-foreground">Revenue</h3>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">$45,600</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-foreground">Occupancy</h3>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">87%</p>
          <p className="text-sm text-muted-foreground">Across all hostels</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
