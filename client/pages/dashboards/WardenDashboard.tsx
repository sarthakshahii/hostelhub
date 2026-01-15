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
  Bell,
  Key,
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

export default function WardenDashboard() {
  const stats: StatCard[] = [
    {
      label: "Residents in My Hostel",
      value: "87",
      change: "+3 this week",
      icon: <Users className="w-6 h-6" />,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      label: "Available Rooms",
      value: "12",
      change: "-1 this week",
      icon: <DoorOpen className="w-6 h-6" />,
      color: "from-teal-500 to-teal-600",
    },
    {
      label: "Pending Complaints",
      value: "4",
      change: "2 resolved today",
      icon: <AlertCircle className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Total Rooms",
      value: "100",
      change: "All assigned",
      icon: <Building2 className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
    },
  ];

  const modules: ModuleCard[] = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Residents",
      description: "Manage residents in your hostel",
      href: "/residents",
      color: "from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900",
    },
    {
      icon: <DoorOpen className="w-8 h-8" />,
      title: "Rooms",
      description: "Allocate and manage rooms",
      href: "/rooms",
      color: "from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900",
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Complaints",
      description: "Handle student complaints",
      href: "/complaints",
      color: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
    },
    {
      icon: <ClipboardList className="w-8 h-8" />,
      title: "Attendance",
      description: "Track student attendance",
      href: "/attendance",
      color: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: "Mess Management",
      description: "Manage meal plans",
      href: "/mess",
      color: "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Notifications",
      description: "Send notifications to residents",
      href: "/notifications",
      color: "from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl lg:rounded-2xl p-6 lg:p-8 text-primary-foreground shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Key className="w-8 h-8" />
          <h1 className="text-2xl lg:text-4xl font-bold">Warden Dashboard</h1>
        </div>
        <p className="text-base lg:text-lg opacity-90">
          Manage your hostel's residents, rooms, and day-to-day operations.
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
              <div
                className={cn(
                  "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white",
                  stat.color
                )}
              >
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
              Manage your hostel's operations
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
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                    module.color
                  )}
                />
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

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-medium hover:bg-primary/90 transition-colors">
              Add New Room
            </button>
            <button className="w-full bg-secondary text-secondary-foreground rounded-lg py-3 font-medium hover:bg-secondary/90 transition-colors">
              Register Resident
            </button>
            <button className="w-full border border-border text-foreground rounded-lg py-3 font-medium hover:bg-muted transition-colors">
              Send Announcement
            </button>
          </div>

          {/* Hostel Stats Card */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="font-semibold text-foreground mb-4">
              Hostel Overview
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Occupancy Rate:</span>
                <span className="font-bold text-foreground">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Students:</span>
                <span className="font-bold text-foreground">87</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Issues:</span>
                <span className="font-bold text-orange-600">4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Recent Complaints
          </h3>
          <div className="space-y-3">
            {[
              {
                room: "Room 205",
                issue: "Water leakage",
                status: "In Progress",
              },
              {
                room: "Room 312",
                issue: "Broken fan",
                status: "Open",
              },
              {
                room: "Room 101",
                issue: "Electrical issue",
                status: "Resolved",
              },
            ].map((complaint, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{complaint.room}</p>
                  <p className="text-sm text-muted-foreground">
                    {complaint.issue}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded",
                    complaint.status === "Open"
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                      : complaint.status === "In Progress"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  )}
                >
                  {complaint.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {[
              {
                event: "Mess Fee Collection",
                date: "Tomorrow",
                priority: "high",
              },
              {
                event: "Maintenance Check",
                date: "Next Week",
                priority: "medium",
              },
              {
                event: "Hostel Inspection",
                date: "15th Jan",
                priority: "high",
              },
            ].map((event, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{event.event}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded",
                    event.priority === "high"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                  )}
                >
                  {event.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
