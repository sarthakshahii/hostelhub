import { Link } from "react-router-dom";
import {
  DoorOpen,
  AlertCircle,
  UtensilsCrossed,
  CreditCard,
  Bell,
  ArrowRight,
  User,
  Calendar,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}

export default function StudentDashboard() {
  const modules: ModuleCard[] = [
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Lodge Complaint",
      description: "Report any issues in your room",
      href: "/complaints",
      color: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: "Mess Menu",
      description: "View today's meal options",
      href: "/mess",
      color: "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Payments",
      description: "View bills and make payments",
      href: "/payments",
      color: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Notifications",
      description: "Check important announcements",
      href: "/notifications",
      color: "from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl lg:rounded-2xl p-6 lg:p-8 text-primary-foreground shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-8 h-8" />
          <h1 className="text-2xl lg:text-4xl font-bold">Student Portal</h1>
        </div>
        <p className="text-base lg:text-lg opacity-90">
          Welcome to your hostel. Manage your room, view notices, and stay updated.
        </p>
      </div>

      {/* Room Information Card */}
      <div className="bg-card rounded-xl border border-border p-6 lg:p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Your Room Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Building2Icon />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hostel</p>
                <p className="text-lg font-bold text-foreground">Hostel A</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <DoorOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Room Number</p>
                <p className="text-lg font-bold text-foreground">Room 205</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Floor</p>
                <p className="text-lg font-bold text-foreground">2nd Floor</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Checked In</p>
                <p className="text-lg font-bold text-foreground">
                  Jan 15, 2024
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Roommates</p>
                <p className="text-lg font-bold text-foreground">2</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Fees</p>
                <p className="text-lg font-bold text-foreground">₹5,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Modules Grid */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-2">
              Quick Actions
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground">
              Access common features
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Items */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Pending Items
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm">
                  Complaint Status
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  1 complaint pending
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100 text-sm">
                  Pending Payment
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Due by Jan 25, 2024
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                  New Announcement
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Check hostel updates
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Important Documents
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-center justify-between group">
                <span className="text-sm font-medium text-foreground">
                  Room Agreement
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-center justify-between group">
                <span className="text-sm font-medium text-foreground">
                  Hostel Rules
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-center justify-between group">
                <span className="text-sm font-medium text-foreground">
                  Fee Receipt
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Building2Icon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4 0h1m-1-4h1"
      />
    </svg>
  );
}
