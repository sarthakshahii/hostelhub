import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import WardenDashboard from "./pages/dashboards/WardenDashboard";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import Dashboard from "./pages/Dashboard";
import Hostels from "./pages/Hostels";
import Rooms from "./pages/Rooms";
import Residents from "./pages/Residents";
import Attendance from "./pages/Attendance";
import Complaints from "./pages/Complaints";
import Mess from "./pages/Mess";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Component to handle role-based dashboard routing
const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminDashboard />;
  } else if (user?.role === "warden") {
    return <WardenDashboard />;
  } else if (user?.role === "student") {
    return <StudentDashboard />;
  }

  return <Dashboard />;
};

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <RoleBasedDashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hostels"
              element={
                <ProtectedRoute requiredRoles={["admin", "warden"]}>
                  <MainLayout>
                    <Hostels />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <ProtectedRoute requiredRoles={["admin", "warden", "student"]}>
                  <MainLayout>
                    <Rooms />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/residents"
              element={
                <ProtectedRoute requiredRoles={["admin", "warden"]}>
                  <MainLayout>
                    <Residents />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute requiredRoles={["admin", "warden"]}>
                  <MainLayout>
                    <Attendance />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints"
              element={
                <ProtectedRoute requiredRoles={["admin", "warden", "student"]}>
                  <MainLayout>
                    <Complaints />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mess"
              element={
                <ProtectedRoute requiredRoles={["admin", "warden", "student"]}>
                  <MainLayout>
                    <Mess />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute requiredRoles={["admin", "warden", "student"]}>
                  <MainLayout>
                    <Payments />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute requiredRoles={["admin", "warden", "student"]}>
                  <MainLayout>
                    <Notifications />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback Routes */}
            <Route path="/unauthorized" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
