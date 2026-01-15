import { useState, useEffect } from "react";
import { Trash2, Eye, Mail, CheckCircle, AlertCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  createdAt: string;
}

interface NotificationStats {
  total: number;
  read: number;
  unread: number;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRead, setFilterRead] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    read: 0,
    unread: 0,
  });
  const { toast } = useToast();

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Update stats whenever notifications change
  useEffect(() => {
    setStats({
      total: notifications.length,
      read: notifications.filter((n) => n.read).length,
      unread: notifications.filter((n) => !n.read).length,
    });
  }, [notifications]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to mark notification as read");

      toast({
        title: "Success",
        description: "Notification marked as read",
      });

      fetchNotifications();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to mark all as read");

      toast({
        title: "Success",
        description: "All notifications marked as read",
      });

      fetchNotifications();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to mark all as read",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete notification");

      toast({
        title: "Success",
        description: "Notification deleted successfully",
      });

      fetchNotifications();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRead =
      filterRead === "all" ||
      (filterRead === "read" && notification.read) ||
      (filterRead === "unread" && !notification.read);
    const matchesType =
      filterType === "all" || notification.type === filterType;
    return matchesSearch && matchesRead && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700";
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "info":
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Notifications
          </h1>
          <p className="text-muted-foreground">
            View and manage all system notifications
          </p>
        </div>
        {stats.unread > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            className="w-full md:w-auto"
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Notifications
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats.total}
              </p>
            </div>
            <Mail className="w-10 h-10 text-blue-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Unread</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.unread}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Read</p>
              <p className="text-3xl font-bold text-foreground">{stats.read}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500/20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
        />
        <select
          value={filterRead}
          onChange={(e) => setFilterRead(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
        >
          <option value="all">All Types</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-8 text-center text-muted-foreground">
            Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-8 text-center text-muted-foreground">
            No notifications found.
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-lg p-4 transition-all ${getTypeColor(
                notification.type
              )} ${!notification.read ? "ring-2 ring-offset-2 ring-primary" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize flex-shrink-0 ${getTypeBadgeColor(
                        notification.type
                      )}`}
                    >
                      {notification.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedNotification(notification);
                          setShowDetailsDialog(true);
                        }}
                        className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-muted-foreground hover:text-foreground transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription>Notification Details</DialogDescription>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <p className="font-medium text-foreground">
                  {selectedNotification.message}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${getTypeBadgeColor(
                      selectedNotification.type
                    )}`}
                  >
                    {selectedNotification.type}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      selectedNotification.read
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    }`}
                  >
                    {selectedNotification.read ? "Read" : "Unread"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground text-sm">
                    {new Date(
                      selectedNotification.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
