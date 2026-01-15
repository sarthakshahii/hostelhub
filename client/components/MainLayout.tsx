import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  Menu,
  X,
  Users,
  DoorOpen,
  ClipboardList,
  AlertCircle,
  UtensilsCrossed,
  CreditCard,
  Bell,
  BarChart3,
  LogOut,
  Settings,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // All available navigation items
  const allNavItems: NavItem[] = [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard", href: "/" },
    {
      icon: <Building2 className="w-5 h-5" />,
      label: "Hostels",
      href: "/hostels",
    },
    { icon: <DoorOpen className="w-5 h-5" />, label: "Rooms", href: "/rooms" },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Residents",
      href: "/residents",
    },
    {
      icon: <ClipboardList className="w-5 h-5" />,
      label: "Attendance",
      href: "/attendance",
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      label: "Complaints",
      href: "/complaints",
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5" />,
      label: "Mess Management",
      href: "/mess",
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: "Payments",
      href: "/payments",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
      href: "/notifications",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Reports",
      href: "/reports",
    },
  ];

  // Filter nav items based on user role
  let navItems: NavItem[] = allNavItems;
  if (user?.role === "student") {
    navItems = [allNavItems[0], allNavItems[5], allNavItems[7], allNavItems[8]]; // Dashboard, Complaints, Payments, Notifications
  } else if (user?.role === "warden") {
    navItems = allNavItems.filter((item) => item.href !== "/hostels" && item.href !== "/reports");
  }

  const isActive = (href: string) => location.pathname === href;

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-sidebar-border">
        {isSidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sidebar-primary to-accent flex items-center justify-center">
              <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <h1 className="font-bold text-lg text-sidebar-foreground">
              HostelHub
            </h1>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              isActive(item.href)
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
            title={!isSidebarOpen ? item.label : undefined}
          >
            {item.icon}
            {isSidebarOpen && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <Settings className="w-5 h-5" />
          {isSidebarOpen && <span className="font-medium">Settings</span>}
        </button>
        <button
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {isSidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isSidebarOpen ? "lg:w-64" : "lg:w-20"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:hidden flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">
              {navItems.find((item) => item.href === location.pathname)
                ?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:block">
              <Bell className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              {isSidebarOpen && (
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role}
                  </p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
